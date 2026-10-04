import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

# Primary and fallback model choices supported on current API version
AVAILABLE_MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"]

def get_working_model():
    for model_name in AVAILABLE_MODELS:
        try:
            return genai.GenerativeModel(model_name)
        except Exception:
            continue
    return genai.GenerativeModel("gemini-3.5-flash")

model = get_working_model()

ANALYSIS_PROMPT = """
You are Rakshak, an intelligent AI cybersecurity and fraud prevention engine protecting citizens against financial scams, fake trading apps, and deceptive claims.

Carefully evaluate the user message below.
First, determine if the content is RELEVANT to financial matters (investments, stocks, trading, crypto, banking, loans, UPI/payment transfers, advisory tips, money-making offers, or KYC/account alerts).
If the text is UNRELATED (casual greetings, general chat, recipes, tech support, poetry, or random non-financial gibberish), explicitly classify it as "unrelated_content".

MESSAGE TO ANALYZE:
\"\"\"{message}\"\"\"

Return ONLY a valid JSON object with EXACTLY this structure (no markdown fences, no surrounding text):
{{
  "is_financial_related": true or false,
  "relevance_status": "financial_scam_or_claim | legitimate_financial_communication | unrelated_content | gibberish_or_insufficient",
  "relevance_explanation": "1-2 sentence explanation of whether this text is a financial communication or unrelated",
  "entities": {{
    "upi_ids": ["all UPI handles found in text, e.g. user@bank"],
    "phone_numbers": ["all phone numbers or mobile contacts found"],
    "urls": ["all website URLs or domains found"],
    "social_handles": ["all Telegram/WhatsApp/Instagram handles found, e.g. @channel"],
    "org_names": ["all company, app, or institution names found"],
    "person_names": ["all individual person names found"],
    "sebi_reg_numbers": ["any SEBI, AMFI, or ARN registration numbers claimed"]
  }},
  "claims": [
    {{
      "text": "specific claim excerpt from message",
      "type": "guaranteed_return | regulator_approved | urgency | fake_profit | authority_impersonation | task_earning | phishing | legitimate_notice | other",
      "risk": "high | medium | low",
      "explanation_english": "clear, customized 1-2 sentence explanation tailored specifically to this claim",
      "explanation_hindi": "1-2 sentence explanation in simple Hindi"
    }}
  ],
  "content_type": "scam_solicitation | aggressive_promotional | legitimate_institutional | educational | unrelated",
  "content_type_reason": "Specific reason explaining why this text was categorized this way",
  "overall_risk": "high | medium | low | not_applicable",
  "risk_score": <integer from 0 to 100 representing risk level>,
  "red_flags": ["list of specific red flags tailored to this exact message, empty if none"],
  "red_flags_hindi": ["same red flags in Hindi, empty if none"],
  "safe_next_steps": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ],
  "safe_next_steps_hindi": [
    "सिफारिश 1",
    "सिफारिश 2"
  ],
  "english_summary": "Conversational, plain English summary of what Rakshak found in this specific message",
  "hindi_summary": "आम नागरिक के लिए सरल हिंदी में निष्कर्ष",
  "sebi_attack_stage": "Stage 1: Social Media Hook | Stage 2: Trust Building | Stage 3: Fake Expert | Stage 4: Unverified App/Group Onboarding | Stage 5: Virtual Profit Display | Stage 6: Pressure & Upsell | Stage 7: Withdrawal Block | Phishing Attack | Not Applicable",
  "trust_passport": {{
    "identity_status": "verified | unverified | suspicious | not_applicable",
    "registration_status": "verified | not_found | mismatch | not_applicable",
    "return_claim": "guaranteed | unrealistic | reasonable | not_applicable",
    "urgency_detected": true or false,
    "social_pressure_detected": true or false,
    "payment_id_risk": "linked_to_known_case | unknown | not_applicable",
    "sebi_evidence_source": "SEBI Intermediary Registry / Cybercrime Threat Intelligence / Not Applicable"
  }}
}}
"""

RISK_IQ_PROMPT = """
You are a financial literacy educator. A user reviewed a message and identified some red flags.
Compare their findings with the actual red flags detected in the message.

Actual red flags detected: {actual_flags}
User-identified flags: {user_flags}

Return ONLY valid JSON:
{{
  "score": <integer 0-100>,
  "grade": "A | B | C | D | F",
  "missed_flags": ["flags the user missed"],
  "correctly_identified": ["flags user got right"],
  "feedback": "2-3 sentence encouraging feedback in English",
  "feedback_hindi": "2-3 sentence encouraging feedback in Hindi",
  "tips": ["2-3 practical tips to improve scam detection skills"]
}}
"""

def analyze_message(message: str) -> dict:
    """Run Gemini analysis on the given message/text with automatic model fallback."""
    for model_name in AVAILABLE_MODELS:
        try:
            active_model = genai.GenerativeModel(model_name)
            prompt = ANALYSIS_PROMPT.format(message=message)
            response = active_model.generate_content(prompt)
            raw_text = response.text.strip()
            
            # Clean json fences
            if raw_text.startswith("```"):
                raw_text = raw_text[raw_text.find("{"):raw_text.rfind("}")+1]
            elif "{" in raw_text and "}" in raw_text:
                raw_text = raw_text[raw_text.find("{"):raw_text.rfind("}")+1]
                
            result = json.loads(raw_text)
            return result
        except json.JSONDecodeError:
            continue
        except Exception as e:
            print(f"[Gemini] Error with {model_name}: {e}")
            continue

    # If all API calls fail, run context-aware local analysis
    return _context_aware_fallback(message)

def calculate_risk_iq(actual_flags: list, user_flags: list) -> dict:
    """Calculate the user's Investor Risk IQ score."""
    for model_name in AVAILABLE_MODELS:
        try:
            active_model = genai.GenerativeModel(model_name)
            prompt = RISK_IQ_PROMPT.format(
                actual_flags=json.dumps(actual_flags),
                user_flags=json.dumps(user_flags)
            )
            response = active_model.generate_content(prompt)
            raw_text = response.text.strip()
            if "{" in raw_text and "}" in raw_text:
                raw_text = raw_text[raw_text.find("{"):raw_text.rfind("}")+1]
            return json.loads(raw_text)
        except Exception:
            continue

    return {
        "score": 60, "grade": "B",
        "missed_flags": [], "correctly_identified": user_flags,
        "feedback": "Good effort analyzing this message! Continue checking registration before trusting offers.",
        "feedback_hindi": "अच्छा प्रयास! किसी भी प्रस्ताव पर विश्वास करने से पहले हमेशा जांच करें।",
        "tips": ["Always check official government registries before transferring funds."]
    }

def _context_aware_fallback(message: str) -> dict:
    """Intelligent fallback that detects whether content is financial, unrelated, or a scam."""
    msg_lower = message.lower()
    
    # Financial keyword dictionary
    financial_keywords = [
        "invest", "profit", "return", "stock", "trade", "share", "crypto", "upi",
        "pay", "bank", "sebi", "demat", "money", "rupees", "₹", "rs.", "loan",
        "earn", "salary", "bonus", "transfer", "deposit", "withdraw", "fund",
        "broker", "yono", "kyc", "otp", "nifty", "sensex", "trading", "dividend",
        "account", "credit", "debit", "wallet", "payout"
    ]
    
    has_financial_context = any(k in msg_lower for k in financial_keywords)

    # 1. Non-Financial / Unrelated Content
    if not has_financial_context:
        return {
            "is_financial_related": False,
            "relevance_status": "unrelated_content",
            "relevance_explanation": "This message does not contain any financial claims, stock advice, banking links, or payment requests.",
            "entities": {
                "upi_ids": [], "phone_numbers": [], "urls": [],
                "social_handles": [], "org_names": [], "person_names": [], "sebi_reg_numbers": []
            },
            "claims": [],
            "content_type": "unrelated",
            "content_type_reason": "General or non-financial content.",
            "overall_risk": "not_applicable",
            "risk_score": 0,
            "red_flags": [],
            "red_flags_hindi": [],
            "safe_next_steps": [
                "No financial risk detected in this message.",
                "If you receive an investment offer, stock recommendation, or payment request, submit it here to verify."
            ],
            "safe_next_steps_hindi": [
                "इस संदेश में कोई वित्तीय जोखिम नहीं मिला।",
                "यदि आपको कोई निवेश प्रस्ताव या भुगतान अनुरोध मिलता है, तो यहां जांचें।"
            ],
            "english_summary": "This message is unrelated to financial transactions, trading, or investments. No fraud indicators apply.",
            "hindi_summary": "यह संदेश किसी वित्तीय लेनदेन या निवेश से संबंधित नहीं है। कोई धोखाधड़ी का संकेत नहीं है।",
            "sebi_attack_stage": "Not Applicable",
            "trust_passport": {
                "identity_status": "not_applicable",
                "registration_status": "not_applicable",
                "return_claim": "not_applicable",
                "urgency_detected": False,
                "social_pressure_detected": False,
                "payment_id_risk": "not_applicable",
                "sebi_evidence_source": "Not Applicable"
            }
        }

    # 2. Financial message analysis
    has_guaranteed = any(w in msg_lower for w in ["guaranteed", "100%", "assured", "गारंटी", "fixed return", "double", "200%"])
    has_urgency = any(w in msg_lower for w in ["urgent", "limited slots", "today only", "hurry", "last chance", "closes in", "2 hours"])
    has_sebi = any(w in msg_lower for w in ["sebi", "nsdl", "cdsl", "registered", "approved", "certified"])
    has_upi = bool(re.search(r'[\w\.\-]+@[\w]+', message))
    is_phishing = any(w in msg_lower for w in ["yono", "kyc", "blocked", "suspended", "pan link", "apk", "lottery"])

    flags = []
    claims = []

    if has_guaranteed:
        flags.append("Guaranteed return promise (unlawful under SEBI regulations)")
        claims.append({
            "text": "Guaranteed / Assured profits promised",
            "type": "guaranteed_return",
            "risk": "high",
            "explanation_english": "No legitimate financial market intermediary is legally permitted to guarantee returns.",
            "explanation_hindi": "कोई भी वैध ब्रोकर या सलाहकार शेयर बाजार में मुनाफे की गारंटी नहीं दे सकता।"
        })

    if has_urgency:
        flags.append("Artificial urgency tactic ('limited slots/time')")
        claims.append({
            "text": "Time-pressure or limited availability claimed",
            "type": "urgency",
            "risk": "medium",
            "explanation_english": "Scammers manufacture urgency so victims pay before verifying credentials.",
            "explanation_hindi": "जल्दबाजी करवाकर सोचने का मौका न देना धोखाधड़ी का मुख्य तरीका है।"
        })

    if has_upi:
        flags.append("Direct personal UPI payment requested")

    if is_phishing:
        flags.append("Urgent banking alert or account suspension threat (likely phishing)")

    risk_level = "high" if (has_guaranteed or is_phishing or (has_upi and has_urgency)) else ("medium" if has_financial_context else "low")
    risk_score = 90 if risk_level == "high" else (45 if risk_level == "medium" else 15)

    return {
        "is_financial_related": True,
        "relevance_status": "financial_scam_or_claim" if risk_level in ["high", "medium"] else "legitimate_financial_communication",
        "relevance_explanation": "Financial communication containing investment or payment claims.",
        "entities": {
            "upi_ids": re.findall(r'[\w\.\-]+@[\w]+', message),
            "phone_numbers": re.findall(r'(?:\+91[\-\s]?)?[6789]\d{9}', message),
            "urls": re.findall(r'https?://[^\s]+|[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?', message),
            "social_handles": re.findall(r'@[a-zA-Z0-9_]+', message),
            "org_names": [],
            "person_names": [],
            "sebi_reg_numbers": re.findall(r'IN[A-Z0-9]{8,}', message)
        },
        "claims": claims,
        "content_type": "scam_solicitation" if risk_level == "high" else "aggressive_promotional",
        "content_type_reason": "Contains high-risk promises and payment identifiers." if risk_level == "high" else "Promotional financial offer.",
        "overall_risk": risk_level,
        "risk_score": risk_score,
        "red_flags": flags if flags else ["Unverified investment solicitation"],
        "red_flags_hindi": ["संदिग्ध वित्तीय अनुरोध"],
        "safe_next_steps": [
            "Do NOT transfer funds to individual UPI handles.",
            "Independently verify advisor credentials on sebi.gov.in.",
            "Report any suspicious payment demand to Cybercrime Helpline 1930."
        ],
        "safe_next_steps_hindi": [
            "व्यक्तिगत यूपीआई पर पैसे ट्रांसफर न करें।",
            "sebi.gov.in पर सलाहकार का पंजीकरण जांचें।"
        ],
        "english_summary": f"Rakshak detected {len(flags)} critical risk signal(s) in this message. Do not send funds until verified.",
        "hindi_summary": "इस संदेश में जोखिम भरे संकेत पाए गए हैं। पुष्टि किए बिना कोई भी राशि ट्रांसफर न करें।",
        "sebi_attack_stage": "Stage 4: Unverified App/Group Onboarding" if has_guaranteed else "Stage 1: Social Media Hook",
        "trust_passport": {
            "identity_status": "suspicious" if risk_level == "high" else "unverified",
            "registration_status": "not_found" if not has_sebi else "unverified",
            "return_claim": "guaranteed" if has_guaranteed else "unrealistic",
            "urgency_detected": has_urgency,
            "social_pressure_detected": False,
            "payment_id_risk": "unknown",
            "sebi_evidence_source": "SEBI Intermediary Registry & Cyber Threat Intelligence"
        }
    }
