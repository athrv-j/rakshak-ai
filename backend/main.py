import os
import uuid
import hashlib
import json
import urllib.request
import urllib.parse
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv

from database import init_db, save_analysis, get_analysis, save_community_report, get_community_report_count, verify_sebi_registry
from gemini_service import analyze_message, calculate_risk_iq
from graph_engine import build_graph, get_entity_subgraph
from ocr_service import extract_text_from_image, extract_text_from_base64, pre_extract_entities
from evidence_engine import build_evidence_package, compare_cases, ask_rakshak_evidence_bound

load_dotenv()

app = FastAPI(
    title="Rakshak API",
    description="AI Financial Firewall — SANGYAN 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("[Rakshak] Backend started. DB initialized.")

# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "Rakshak API", "version": "1.0.0"}

# ── Analyze: Text Input ───────────────────────────────────────────────────────

class TextAnalyzeRequest(BaseModel):
    text: str
    user_flagged_items: Optional[List[str]] = []

def enrich_with_sebi_verification(gemini_result: dict, entities: dict):
    """Enrich Trust Passport with deterministic SEBI registry ground-truth check."""
    # If the message is non-financial, do not apply financial fraud verification
    if (
        gemini_result.get("is_financial_related") is False
        or gemini_result.get("content_type") == "unrelated"
        or gemini_result.get("overall_risk") == "not_applicable"
        or gemini_result.get("relevance_status") in ["unrelated_content", "gibberish_or_insufficient"]
    ):
        gemini_result["overall_risk"] = "not_applicable"
        gemini_result["risk_score"] = 0
        gemini_result["red_flags"] = []
        if "trust_passport" not in gemini_result:
            gemini_result["trust_passport"] = {}
        gemini_result["trust_passport"]["registration_status"] = "not_applicable"
        gemini_result["trust_passport"]["payment_id_risk"] = "not_applicable"
        return

    sebi_info = verify_sebi_registry(
        claimed_regs=entities.get("sebi_reg_numbers", []),
        org_names=entities.get("org_names", []),
        domains=entities.get("urls", []),
        upi_ids=entities.get("upi_ids", [])
    )
    if "trust_passport" not in gemini_result:
        gemini_result["trust_passport"] = {}

    status = sebi_info.get("status", "not_applicable")
    gemini_result["trust_passport"]["registration_status"] = status
    gemini_result["trust_passport"]["sebi_registry_verification"] = sebi_info

    if status == "mismatch":
        reason = sebi_info.get("reason", "SEBI Registration mismatch")
        gemini_result["red_flags"].insert(0, f"🚨 REGULATORY MISMATCH: {reason}")
        gemini_result["overall_risk"] = "high"
        gemini_result["risk_score"] = max(gemini_result.get("risk_score", 0), 92)
    elif status == "not_found":
        reason = sebi_info.get("reason", "Registration not found")
        gemini_result["red_flags"].insert(0, f"⚠️ UNVERIFIED REGISTRATION: {reason}")
        gemini_result["overall_risk"] = "high"
        gemini_result["risk_score"] = max(gemini_result.get("risk_score", 0), 85)
    elif status == "verified":
        # Check if legitimate broker communication without suspicious claims
        is_safe = all(c.get("risk") != "high" for c in gemini_result.get("claims", []))
        if is_safe and not entities.get("upi_ids"):
            gemini_result["overall_risk"] = "low"
            gemini_result["risk_score"] = min(gemini_result.get("risk_score", 100), 15)
            gemini_result["content_type"] = "educational"

@app.post("/analyze/text")
async def analyze_text(req: TextAnalyzeRequest):
    if not req.text or len(req.text.strip()) < 2:
        raise HTTPException(status_code=400, detail="Text too short.")

    result_id = str(uuid.uuid4())
    text = req.text.strip()

    # Pre-extract entities via regex
    regex_entities = pre_extract_entities(text)

    # Gemini deep analysis
    gemini_result = analyze_message(text)

    # Merge regex + Gemini entities (Gemini wins, regex fills gaps)
    entities = gemini_result.get("entities", {})
    for key in ["upi_ids", "phone_numbers", "urls", "social_handles"]:
        existing = entities.get(key, [])
        regex_found = regex_entities.get(key, [])
        merged = list(set(existing + regex_found))
        entities[key] = merged
    gemini_result["entities"] = entities

    # Deterministic SEBI Registry verification
    enrich_with_sebi_verification(gemini_result, entities)

    # Build Scam DNA graph
    graph_data = build_graph(entities=entities, current_case_id=result_id)
    related_cases = graph_data.get("related_cases", [])

    # Update payment ID risk if related cases found
    if related_cases:
        gemini_result["trust_passport"]["payment_id_risk"] = "linked_to_known_case"

    # Build evidence package (provenance-backed intelligence)
    sebi_verif = gemini_result.get("trust_passport", {}).get("sebi_registry_verification", {})
    evidence_package = build_evidence_package(
        analysis_result=gemini_result,
        entities=entities,
        text=text,
        sebi_verification=sebi_verif,
        related_cases=related_cases
    )

    # Risk IQ score (if user flagged some items)
    risk_iq_data = None
    if req.user_flagged_items:
        risk_iq_data = calculate_risk_iq(
            actual_flags=gemini_result.get("red_flags", []),
            user_flags=req.user_flagged_items
        )

    # Save to DB (include evidence_package)
    save_analysis(result_id, {
        "input_text": text,
        **gemini_result,
        "related_cases": related_cases,
        "risk_iq_score": risk_iq_data.get("score", 0) if risk_iq_data else 0,
        "evidence_package": evidence_package
    })

    return {
        "result_id": result_id,
        "share_url": f"/result/{result_id}",
        "analysis": gemini_result,
        "evidence_package": evidence_package,
        "related_cases": related_cases,
        "graph": graph_data,
        "risk_iq": risk_iq_data,
    }

# ── Analyze: Screenshot Upload ────────────────────────────────────────────────

@app.post("/analyze/screenshot")
async def analyze_screenshot(
    file: UploadFile = File(...),
    user_flagged_items: str = Form(default="[]")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    image_bytes = await file.read()

    # OCR extraction
    ocr_text = extract_text_from_image(image_bytes)
    if not ocr_text or len(ocr_text.strip()) < 5:
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from image. Please paste the message text instead."
        )

    user_flags = json.loads(user_flagged_items) if user_flagged_items else []

    result_id = str(uuid.uuid4())
    regex_entities = pre_extract_entities(ocr_text)
    gemini_result = analyze_message(ocr_text)

    entities = gemini_result.get("entities", {})
    for key in ["upi_ids", "phone_numbers", "urls", "social_handles"]:
        entities[key] = list(set(entities.get(key, []) + regex_entities.get(key, [])))
    gemini_result["entities"] = entities

    # Deterministic SEBI Registry verification
    enrich_with_sebi_verification(gemini_result, entities)

    graph_data = build_graph(entities=entities, current_case_id=result_id)
    related_cases = graph_data.get("related_cases", [])
    if related_cases:
        gemini_result["trust_passport"]["payment_id_risk"] = "linked_to_known_case"

    # Build evidence package
    sebi_verif = gemini_result.get("trust_passport", {}).get("sebi_registry_verification", {})
    evidence_package = build_evidence_package(
        analysis_result=gemini_result,
        entities=entities,
        text=ocr_text,
        sebi_verification=sebi_verif,
        related_cases=related_cases
    )

    risk_iq_data = None
    if user_flags:
        risk_iq_data = calculate_risk_iq(
            actual_flags=gemini_result.get("red_flags", []),
            user_flags=user_flags
        )

    save_analysis(result_id, {
        "input_text": ocr_text,
        **gemini_result,
        "related_cases": related_cases,
        "risk_iq_score": risk_iq_data.get("score", 0) if risk_iq_data else 0,
        "evidence_package": evidence_package
    })

    return {
        "result_id": result_id,
        "ocr_text": ocr_text,
        "share_url": f"/result/{result_id}",
        "analysis": gemini_result,
        "evidence_package": evidence_package,
        "related_cases": related_cases,
        "graph": graph_data,
        "risk_iq": risk_iq_data,
    }

# ── Get Saved Result ──────────────────────────────────────────────────────────

@app.get("/result/{result_id}")
def get_result(result_id: str):
    result = get_analysis(result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found.")
    # Rebuild graph for this result
    graph_data = build_graph(
        entities=result.get("entities", {}),
        current_case_id=result_id
    )
    # Rebuild evidence package for saved results
    ev_entities = result.get("entities", {})
    sebi_verif = result.get("trust_passport", {}).get("sebi_registry_verification", {})
    ev_related = result.get("related_cases", [])
    evidence_package = result.get("evidence_package") or build_evidence_package(
        analysis_result=result,
        entities=ev_entities,
        text=result.get("input_text", ""),
        sebi_verification=sebi_verif,
        related_cases=ev_related
    )
    if evidence_package and (
        result.get("is_financial_related") is False
        or result.get("content_type") == "unrelated"
        or result.get("overall_risk") == "not_applicable"
        or result.get("relevance_status") in ["unrelated_content", "gibberish_or_insufficient"]
    ):
        evidence_package["hero_theme"] = "unrelated"
        evidence_package["hero_status"] = "NON-FINANCIAL / NO RISK"
    return {
        "result_id": result_id,
        "analysis": result,
        "evidence_package": evidence_package,
        "graph": graph_data,
    }

# ── Scam DNA Graph ────────────────────────────────────────────────────────────

@app.get("/graph/full")
def full_graph():
    """Return the entire Scam DNA graph (all seeded cases)."""
    return build_graph()

@app.get("/graph/entity/{entity_id:path}")
def entity_subgraph(entity_id: str):
    """Return a focused 2-hop subgraph around a specific entity."""
    return get_entity_subgraph(entity_id)

# ── Risk IQ Score ─────────────────────────────────────────────────────────────

class RiskIQRequest(BaseModel):
    actual_flags: List[str]
    user_flags: List[str]

@app.post("/risk-iq")
def risk_iq(req: RiskIQRequest):
    result = calculate_risk_iq(req.actual_flags, req.user_flags)
    return result

# ── Whisper Network (Community Reports) ───────────────────────────────────────

class WhisperReportRequest(BaseModel):
    content: str

@app.post("/whisper/report")
async def submit_whisper_report(req: WhisperReportRequest):
    if len(req.content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Content too short.")
    entities = pre_extract_entities(req.content)
    submitter_hash = hashlib.sha256(req.content[:50].encode()).hexdigest()[:16]
    report_id = save_community_report(req.content, entities, submitter_hash)
    return {
        "success": True,
        "report_id": report_id,
        "message": "Thank you for helping protect the community!",
        "message_hindi": "समुदाय की सुरक्षा में मदद के लिए धन्यवाद!",
        "total_reports": get_community_report_count()
    }

@app.get("/whisper/stats")
def whisper_stats():
    return {
        "total_community_reports": get_community_report_count(),
        "message": "Every report helps protect more investors."
    }

# ── WhatsApp Share ────────────────────────────────────────────────────────────

@app.get("/share/{result_id}")
def get_share_info(result_id: str):
    result = get_analysis(result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found.")
    risk = result.get("overall_risk", "unknown")
    summary = result.get("english_summary", "Check this investment message on Rakshak.")
    whatsapp_text = (
        f"I used Rakshak to check a suspicious investment message.\n"
        f"Risk Level: {risk.upper()}\n"
        f"{summary}\n\n"
        f"Check it yourself: http://localhost:5173/result/{result_id}\n"
        f"Stay safe from financial scams!"
    )
    encoded_wa = urllib.parse.quote(whatsapp_text)
    whatsapp_url = f"https://wa.me/?text={encoded_wa}"
    return {
        "result_id": result_id,
        "risk": risk,
        "whatsapp_url": whatsapp_url,
        "share_text": whatsapp_text
    }

# ── Authoritative Data & Ontology Endpoints ─────────────────────────────────

@app.get("/data/intermediaries")
def get_intermediaries():
    """Return the curated SEBI Recognised Intermediaries dataset."""
    path = os.path.join(os.path.dirname(__file__), "data", "authoritative", "sebi_intermediaries.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Dataset not found"}

@app.get("/data/scam-dna")
def get_scam_dna():
    """Return the 28 Scam DNA behavioral indicators and 8 SEBI attack stages."""
    path = os.path.join(os.path.dirname(__file__), "data", "ontology", "behaviours.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Ontology not found"}

@app.get("/data/cases")
def get_documented_cases():
    """Return documented SEBI enforcement cases and syndicate intelligence graphs."""
    path = os.path.join(os.path.dirname(__file__), "data", "cases", "documented_cases.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Cases not found"}

@app.get("/data/hard-negatives")
def get_hard_negatives():
    """Return verified legitimate broker and regulatory communications (benchmark)."""
    path = os.path.join(os.path.dirname(__file__), "data", "cases", "hard_negatives.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Hard negatives not found"}

# ── Compare Cases ─────────────────────────────────────────────────────────────

class CompareCasesRequest(BaseModel):
    text_a: str
    text_b: str

@app.post("/analyze/compare")
async def compare_two_cases(req: CompareCasesRequest):
    if len(req.text_a.strip()) < 5 or len(req.text_b.strip()) < 5:
        raise HTTPException(status_code=400, detail="Both messages must contain at least 5 characters.")
    entities_a = pre_extract_entities(req.text_a)
    entities_b = pre_extract_entities(req.text_b)
    result = compare_cases(req.text_a, req.text_b, entities_a, entities_b)
    return result

# ── Ask Rakshak (Evidence-Bound) ──────────────────────────────────────────────

class AskRakshakRequest(BaseModel):
    result_id: str
    question: str

@app.post("/analyze/ask")
async def ask_rakshak(req: AskRakshakRequest):
    if len(req.question.strip()) < 3:
        raise HTTPException(status_code=400, detail="Question too short.")
    case_data = get_analysis(req.result_id)
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found. Analyze a message first.")
    answer = ask_rakshak_evidence_bound(case_data, req.question)
    return answer

# ── Demo Cases ────────────────────────────────────────────────────────────────

@app.get("/data/demo-cases")
def get_demo_cases():
    """Return the curated demo cases for the frontend Try Demo Case feature."""
    path = os.path.join(os.path.dirname(__file__), "data", "cases", "demo_cases.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# ── Multi-Lingual Regional Voice TTS (Speech Synthesis for Bharat) ────────────

_TTS_CACHE = {}

def _chunk_speech_text(text: str, max_len: int = 120) -> list[str]:
    """Split long regional text into safe chunks for Google Translate TTS API."""
    import re
    # Split by full stops, purna viram (।), exclamation, question marks, newlines
    tokens = re.split(r'([।\.!\?\n]+)', text.strip())
    chunks = []
    curr = ""
    for part in tokens:
        if not part:
            continue
        if len(curr) + len(part) <= max_len:
            curr += part
        else:
            if curr.strip():
                chunks.append(curr.strip())
            if len(part) <= max_len:
                curr = part
            else:
                words = part.split(' ')
                sub = ""
                for w in words:
                    if len(sub) + len(w) + 1 <= max_len:
                        sub += (' ' if sub else '') + w
                    else:
                        if sub.strip():
                            chunks.append(sub.strip())
                        sub = w
                curr = sub
    if curr.strip():
        chunks.append(curr.strip())
    return [c for c in chunks if c.strip()]

@app.get("/tts")
def stream_tts(lang: str = "hi", text: str = ""):
    """Stream authentic regional voice audio for Indian languages (Marathi, Telugu, Tamil, Gujarati, Bengali, Punjabi, Hindi, English)."""
    clean_text = text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text required.")
    
    clean_lang = lang.split("-")[0].lower()
    # Normalize regional language codes supported by Google TTS
    valid_langs = {"hi", "mr", "te", "ta", "gu", "bn", "pa", "en"}
    if clean_lang not in valid_langs:
        clean_lang = "hi"
    
    cache_key = f"{clean_lang}:{clean_text}"
    if cache_key in _TTS_CACHE:
        return Response(content=_TTS_CACHE[cache_key], media_type="audio/mpeg", headers={"Cache-Control": "public, max-age=86400"})
    
    chunks = _chunk_speech_text(clean_text, max_len=120)
    if not chunks:
        chunks = [clean_text[:120]]
    
    combined_audio = bytearray()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        for chunk in chunks:
            encoded = urllib.parse.quote(chunk)
            url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl={clean_lang}&q={encoded}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as res:
                combined_audio.extend(res.read())
        
        result_bytes = bytes(combined_audio)
        if len(_TTS_CACHE) < 500:
            _TTS_CACHE[cache_key] = result_bytes
        return Response(content=result_bytes, media_type="audio/mpeg", headers={"Cache-Control": "public, max-age=86400"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

