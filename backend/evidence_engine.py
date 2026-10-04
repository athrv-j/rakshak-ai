import re
import json
import hashlib
from typing import Dict, Any, List

def build_evidence_package(
    analysis_result: Dict[str, Any],
    entities: Dict[str, List[str]],
    text: str,
    sebi_verification: Dict[str, Any],
    related_cases: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Transforms raw analysis and entity extractions into an evidence-first,
    provenance-backed intelligence package.
    """
    text_lower = text.lower()
    red_flags = analysis_result.get("red_flags", [])
    claims = analysis_result.get("claims", [])
    reg_status = sebi_verification.get("status", "not_applicable")

    # 1. Determine Hero Status (No Fake Precision)
    indicators = []
    
    if entities.get("upi_ids"):
        indicators.append({
            "key": "payment_id",
            "label": "Payment Identifier Detected",
            "detail": f"{len(entities['upi_ids'])} UPI handle(s) identified in message",
            "status": "warning" if len(entities['upi_ids']) > 0 else "neutral",
            "provenance": "USER_PROVIDED"
        })

    if reg_status == "mismatch":
        indicators.append({
            "key": "reg_mismatch",
            "label": "Regulatory Identity Mismatch",
            "detail": "Claimed SEBI registration number belongs to another entity or uses unverified escrow handles.",
            "status": "danger",
            "provenance": "VERIFIED_REGISTRY_CHECK"
        })
    elif reg_status == "not_found":
        indicators.append({
            "key": "reg_not_found",
            "label": "Unregistered Claims",
            "detail": "Registration number could not be found in active SEBI intermediary database.",
            "status": "warning",
            "provenance": "VERIFIED_REGISTRY_CHECK"
        })
    elif reg_status == "verified":
        indicators.append({
            "key": "reg_verified",
            "label": "Official SEBI Intermediary Verified",
            "detail": f"Registration confirmed for {sebi_verification.get('legal_name', 'Entity')}.",
            "status": "safe",
            "provenance": "VERIFIED_REGISTRY_CHECK"
        })

    # Check for guaranteed return claims
    has_guaranteed = any(c.get("type") == "guaranteed_return" for c in claims) or any(
        w in text_lower for w in ["guaranteed", "100%", "assured", "गारंटी", "zero risk", "fixed return"]
    )
    if has_guaranteed:
        indicators.append({
            "key": "guaranteed_return",
            "label": "Guaranteed / Assured Return Claim",
            "detail": "Guaranteed return language detected. Regulated intermediaries are legally barred from promising returns.",
            "status": "danger",
            "provenance": "REFERENCE_EVIDENCE"
        })

    # Check for urgency
    has_urgency = any(c.get("type") == "urgency" for c in claims) or any(
        w in text_lower for w in ["urgent", "limited slots", "today only", "hurry", "last chance", "closes in"]
    )
    if has_urgency:
        indicators.append({
            "key": "urgency",
            "label": "Artificial Urgency Detected",
            "detail": "Time-pressure tactics used to bypass critical thinking and verification.",
            "status": "warning",
            "provenance": "USER_PROVIDED"
        })

    # Check for related syndicates
    if related_cases:
        indicators.append({
            "key": "syndicate_link",
            "label": "Linked to Known Scam Syndicate",
            "detail": f"Shares identifiers with {len(related_cases)} previously documented fraud case(s).",
            "status": "danger",
            "provenance": "REFERENCE_EVIDENCE"
        })

    # Check if message is non-financial or unrelated
    is_unrelated = (
        analysis_result.get("is_financial_related") is False
        or analysis_result.get("content_type") == "unrelated"
        or analysis_result.get("overall_risk") == "not_applicable"
        or analysis_result.get("relevance_status") in ["unrelated_content", "gibberish_or_insufficient"]
    )

    # Deduce Hero Status
    danger_count = sum(1 for ind in indicators if ind["status"] in ["danger", "warning"])
    if is_unrelated:
        hero_status = "NON-FINANCIAL / NO RISK"
        hero_theme = "unrelated"
        hero_summary = analysis_result.get("english_summary") or "This message is conversational or non-financial. No fraud indicators apply."
        indicators = [{
            "key": "non_financial",
            "label": "Non-Financial Content",
            "detail": "General conversation or greeting. No financial risk detected.",
            "status": "safe",
            "provenance": "USER_PROVIDED"
        }]
    elif danger_count >= 2:
        hero_status = "PAUSE & VERIFY"
        hero_theme = "danger"
        hero_summary = f"We found {danger_count} indicators that require verification before taking any action."
    elif danger_count == 1:
        hero_status = "NEEDS VERIFICATION"
        hero_theme = "warning"
        hero_summary = "At least one key claim or payment identifier could not be verified."
    elif reg_status == "verified" and not has_guaranteed and not entities.get("upi_ids"):
        hero_status = "EVIDENCE VERIFIED"
        hero_theme = "safe"
        hero_summary = "Communication aligns with verified official intermediary credentials and lacks fraud indicators."
    else:
        hero_status = "INSUFFICIENT EVIDENCE"
        hero_theme = "neutral"
        hero_summary = "Not enough conclusive evidence found in message to verify legitimacy. Exercise standard caution."

    # 2. "Why This Warning?" Structured Explainable Evidence Cards
    why_this_warning = []

    if not is_unrelated:
        if has_guaranteed:
            why_this_warning.append({
                "id": "wtw-guaranteed",
                "title": "Guaranteed Return Claim",
                "detected": "Promised fixed or guaranteed return on investment",
                "why_it_matters": "Under SEBI (Prohibition of Fraudulent and Unfair Trade Practices) Regulations, 2003, no registered market intermediary is permitted to guarantee market returns. Market investments inherently bear volatility risk.",
                "source": "SEBI PFUTP Regulations, 2003 (Reg 4(2)(k))",
                "provenance": "REFERENCE_EVIDENCE",
                "simple_explanation": "Real investments always carry risk. Anyone promising guaranteed or risk-free market profits is using a classic deception tactic."
            })

        if reg_status in ["mismatch", "not_found"]:
            why_this_warning.append({
                "id": "wtw-reg",
                "title": "Unverified or Misrepresented Registration",
                "detected": f"Status: {reg_status.upper()}",
                "why_it_matters": sebi_verification.get("reason", "Could not independently verify SEBI registration."),
                "source": "SEBI Recognised Intermediaries Database (sebi.gov.in)",
                "provenance": "VERIFIED_REGISTRY_CHECK",
                "simple_explanation": "Fraudsters often copy names of genuine companies but use their own phone numbers or personal UPI handles to steal money."
            })

        if entities.get("upi_ids"):
            upis_joined = ", ".join(entities["upi_ids"])
            why_this_warning.append({
                "id": "wtw-upi",
                "title": "Direct Payment / UPI Redirection",
                "detected": f"Payment handle(s): {upis_joined}",
                "why_it_matters": "Brokers and mutual funds must collect funds exclusively into registered corporate bank accounts or clearing corporation escrows. Sending money to individual UPI handles bypasses exchange investor protection.",
                "source": "SEBI Master Circular for Stock Brokers & Validated UPI Norms (2026)",
                "provenance": "USER_PROVIDED",
                "simple_explanation": "Never transfer investment money to personal UPI accounts. Legitimate brokers only accept funds through official banking portals or verified broker escrow handles."
            })

        if has_urgency:
            why_this_warning.append({
                "id": "wtw-urgency",
                "title": "High-Pressure Urgency",
                "detected": "Countdown / scarcity language detected",
                "why_it_matters": "Artificial scarcity is designed to induce fear-of-missing-out (FOMO) and prevent investors from consulting family, SEBI, or independent advisors.",
                "source": "SEBI Investor Education on Modus Operandi of Social Media Frauds",
                "provenance": "USER_PROVIDED",
                "simple_explanation": "Legitimate investment opportunities do not expire in hours. Scammers create rush so you do not pause to check facts."
            })

        if related_cases:
            case_names = ", ".join([rc["name"] for rc in related_cases[:2]])
            why_this_warning.append({
                "id": "wtw-network",
                "title": "Cross-Case Identifier Linkage",
                "detected": f"Linked to documented case: {case_names}",
                "why_it_matters": "The UPI ID, phone number, or domain in this message matches records from previous enforcement actions or cybercrime reports.",
                "source": "Rakshak Scam DNA Cross-Case Evidence Graph",
                "provenance": "REFERENCE_EVIDENCE",
                "simple_explanation": "The contact details or bank handles here have already been reported in previous fraud operations."
            })

    # 3. Scam DNA Behavioral Signals (Severity Dots / Signals, not fake probability)
    scam_dna_signals = [
        {
            "name": "Guaranteed Return",
            "level": 0 if is_unrelated else (4 if has_guaranteed else 0),
            "max": 4,
            "detected": False if is_unrelated else has_guaranteed,
            "category": "Claim Integrity",
            "statutory_ref": "SEBI PFUTP Reg 4(2)"
        },
        {
            "name": "Authority / Broker Impersonation",
            "level": 0 if is_unrelated else (4 if reg_status == "mismatch" else (2 if reg_status == "not_found" else 0)),
            "max": 4,
            "detected": False if is_unrelated else (reg_status in ["mismatch", "not_found"]),
            "category": "Identity",
            "statutory_ref": "SEBI Intermediary Regulations"
        },
        {
            "name": "Artificial Urgency & Scarcity",
            "level": 0 if is_unrelated else (3 if has_urgency else 0),
            "max": 4,
            "detected": False if is_unrelated else has_urgency,
            "category": "Psychological Manipulation",
            "statutory_ref": "Investor Protection Code"
        },
        {
            "name": "Payment Redirection (Personal UPI)",
            "level": 0 if is_unrelated else (4 if entities.get("upi_ids") else 0),
            "max": 4,
            "detected": False if is_unrelated else bool(entities.get("upi_ids")),
            "category": "Escrow Bypass",
            "statutory_ref": "NSE/BSE Member Fund Routing Guidelines"
        },
        {
            "name": "Syndicate Lineage Match",
            "level": 0 if is_unrelated else (4 if related_cases else 0),
            "max": 4,
            "detected": False if is_unrelated else bool(related_cases),
            "category": "Network Correlation",
            "statutory_ref": "SEBI Enforcement Precedent"
        }
    ]

    # 4. What We Could NOT Verify (Honesty / Explicit Uncertainty)
    if is_unrelated:
        what_we_could_not_verify = [
            "This message does not present any financial claims or investment accounts to verify."
        ]
    else:
        what_we_could_not_verify = [
            "Whether the phone number(s) in this message belong to authorized corporate officers or rented SIM cards.",
            "Whether the bank account behind the UPI handle has been KYC-verified or is an unmonitored mule account.",
            "Whether any purported profit screenshots or customer testimonials have been synthetically fabricated or altered.",
            "Private direct-message chat histories or off-platform phone conversations."
        ]

    # 5. Before You Act Checklist
    if is_unrelated:
        before_you_act = [
            {
                "id": "bya-1",
                "title": "No Financial Risk Detected",
                "desc": "This message appears to be conversational or non-financial. No money transfer or KYC action is requested.",
                "urgent": False,
                "action_url": None
            },
            {
                "id": "bya-2",
                "title": "Verify any future investment offers",
                "desc": "If you receive follow-up messages promising trading profits, stock tips, or asking for UPI payments, submit them to Rakshak.",
                "urgent": False,
                "action_url": None
            },
            {
                "id": "bya-3",
                "title": "Never share financial credentials",
                "desc": "Always keep bank passwords, card details, and UPI PINs private, regardless of who is messaging.",
                "urgent": False,
                "action_url": None
            }
        ]
    else:
        before_you_act = [
            {
                "id": "bya-1",
                "title": "Verify registration on official SEBI database directly",
                "desc": "Do not trust registration certificates shared over WhatsApp or Telegram. Search manually on sebi.gov.in.",
                "urgent": reg_status in ["mismatch", "not_found"],
                "action_url": "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes"
            },
            {
                "id": "bya-2",
                "title": "Do not transfer funds to personal UPI or savings accounts",
                "desc": "All SEBI-registered brokers collect capital through registered corporate banking escrows or exchange clearing accounts.",
                "urgent": bool(entities.get("upi_ids")),
                "action_url": None
            },
            {
                "id": "bya-3",
                "title": "Call National Cybercrime Helpline 1930 if money was sent",
                "desc": "If you have already transferred funds, immediately dial 1930 or file an incident at cybercrime.gov.in within the golden hour.",
                "urgent": danger_count >= 2,
                "action_url": "https://cybercrime.gov.in"
            },
            {
                "id": "bya-4",
                "title": "Do not install unknown APK files or remote desktop tools",
                "desc": "Never sideload apps outside Google Play Store or Apple App Store, and never install AnyDesk or TeamViewer for trading assistance.",
                "urgent": any("apk" in text_lower or ".app" in text_lower for _ in [0]),
                "action_url": None
            }
        ]

    # 6. Investigator Mode Metadata
    investigator_metadata = {
        "raw_text_length": len(text),
        "content_hash": hashlib.sha256(text.encode("utf-8")).hexdigest()[:16],
        "extraction_method": "Multi-tier Regex + Gemini 1.5 Flash AST",
        "provenance_breakdown": {
            "verified_registry": 1 if reg_status != "not_applicable" else 0,
            "user_provided_iocs": len(entities.get("upi_ids", [])) + len(entities.get("phone_numbers", [])) + len(entities.get("urls", [])),
            "reference_evidence_rules": len(why_this_warning),
            "network_relations": len(related_cases)
        },
        "regulatory_statutes_cited": [
            "SEBI Act, 1992 (Section 11, 11B, 12A)",
            "SEBI (PFUTP) Regulations, 2003",
            "SEBI (Investment Advisers) Regulations, 2013",
            "SEBI (Research Analysts) Regulations, 2014"
        ]
    }

    return {
        "hero_status": hero_status,
        "hero_theme": hero_theme,
        "hero_summary": hero_summary,
        "indicators": indicators,
        "danger_count": danger_count,
        "why_this_warning": why_this_warning,
        "scam_dna_signals": scam_dna_signals,
        "what_we_could_not_verify": what_we_could_not_verify,
        "before_you_act": before_you_act,
        "investigator_metadata": investigator_metadata
    }

def compare_cases(text_a: str, text_b: str, entities_a: dict, entities_b: dict) -> dict:
    """
    Compares two messages to identify Shared DNA and contrasts differences
    with strict provenance labels.
    """
    shared_upis = list(set(entities_a.get("upi_ids", [])) & set(entities_b.get("upi_ids", [])))
    shared_phones = list(set(entities_a.get("phone_numbers", [])) & set(entities_b.get("phone_numbers", [])))
    shared_urls = list(set(entities_a.get("urls", [])) & set(entities_b.get("urls", [])))
    shared_regs = list(set(entities_a.get("sebi_reg_numbers", [])) & set(entities_b.get("sebi_reg_numbers", [])))

    # Compare linguistic / behavioral patterns
    has_guaranteed_a = any(w in text_a.lower() for w in ["guaranteed", "100%", "assured", "गारंटी"])
    has_guaranteed_b = any(w in text_b.lower() for w in ["guaranteed", "100%", "assured", "गारंटी"])
    has_urgency_a = any(w in text_a.lower() for w in ["urgent", "limited", "today only", "now"])
    has_urgency_b = any(w in text_b.lower() for w in ["urgent", "limited", "today only", "now"])

    shared_behaviors = []
    if has_guaranteed_a and has_guaranteed_b:
        shared_behaviors.append("Both messages promise guaranteed / assured market returns.")
    if has_urgency_a and has_urgency_b:
        shared_behaviors.append("Both messages deploy artificial urgency and countdown pressure.")

    # Distinct elements
    differences = []
    if entities_a.get("upi_ids") != entities_b.get("upi_ids"):
        differences.append({
            "attribute": "Payment Identifiers (UPI)",
            "message_a": entities_a.get("upi_ids", []),
            "message_b": entities_b.get("upi_ids", [])
        })
    if entities_a.get("phone_numbers") != entities_b.get("phone_numbers"):
        differences.append({
            "attribute": "Contact Phone Numbers",
            "message_a": entities_a.get("phone_numbers", []),
            "message_b": entities_b.get("phone_numbers", [])
        })

    is_syndicate_link = bool(shared_upis or shared_phones or shared_urls)

    return {
        "correlation_summary": (
            "These cases share verified identifiers and behavioral patterns, indicating a shared operational syndicate."
            if is_syndicate_link else
            "These cases share similar deceptive behavioral patterns, but have distinct contact identifiers."
        ),
        "is_syndicate_link": is_syndicate_link,
        "shared_dna": {
            "shared_upis": shared_upis,
            "shared_phones": shared_phones,
            "shared_urls": shared_urls,
            "shared_regs": shared_regs,
            "shared_behaviors": shared_behaviors,
            "provenance": "VERIFIED_EXTRACTION_MATCH" if is_syndicate_link else "AI_SIMILARITY"
        },
        "differences": differences,
        "cautious_conclusion": (
            "Supported by evidence: Messages share concrete contact/escrow identifiers."
            if is_syndicate_link else
            "Unverified connection: Common tactics observed across independent operations."
        )
    }

def ask_rakshak_evidence_bound(case_data: dict, question: str) -> dict:
    """
    Evidence-bounded answerer strictly constrained to current case facts and reference data.
    """
    q_lower = question.lower()
    entities = case_data.get("entities", {})
    trust = case_data.get("trust_passport", {})
    sebi_verif = trust.get("sebi_registry_verification", {})
    claims = case_data.get("claims", [])
    ev_pkg = case_data.get("evidence_package", {})
    why_this = ev_pkg.get("why_this_warning", [])

    # Case 1: Company verification
    if any(k in q_lower for k in ["company", "sebi", "register", "reg", "authorized", "verified"]):
        status = sebi_verif.get("status", trust.get("registration_status", "not_found"))
        if status == "verified":
            return {
                "answer": f"Yes, we cross-referenced SEBI's official database. '{sebi_verif.get('legal_name')}' is an officially registered intermediary with registration number {sebi_verif.get('reg_number')}.",
                "source": "SEBI Recognised Intermediaries Database",
                "provenance": "VERIFIED_REGISTRY_CHECK",
                "certainty": "HIGH"
            }
        elif status == "mismatch":
            return {
                "answer": f"Critical mismatch detected: {sebi_verif.get('reason', 'Registration claimed in message does not match official records.')}",
                "source": "SEBI Recognised Intermediaries Database",
                "provenance": "VERIFIED_REGISTRY_CHECK",
                "certainty": "HIGH"
            }
        else:
            return {
                "answer": "Rakshak could not independently confirm any active SEBI registration for the entity mentioned in this message.",
                "source": "SEBI Intermediaries Registry Lookup",
                "provenance": "NEEDS_VERIFICATION",
                "certainty": "HIGH_CONFIDENCE_UNVERIFIED"
            }

    # Case 2: Why is it suspicious?
    if any(k in q_lower for k in ["why", "suspicious", "scam", "danger", "warning"]):
        wtw_texts = [w["why_it_matters"] for w in why_this]
        summary = " ".join(wtw_texts) if wtw_texts else "Multiple high-pressure sales indicators and unverified payment channels were detected."
        return {
            "answer": summary,
            "source": "SEBI Scam DNA Behavioral Framework & PFUTP Regulations",
            "provenance": "REFERENCE_EVIDENCE",
            "certainty": "HIGH"
        }

    # Case 3: Payment / UPI
    if any(k in q_lower for k in ["upi", "pay", "money", "transfer", "bank", "account"]):
        upis = entities.get("upi_ids", [])
        if upis:
            return {
                "answer": f"The message requests funds to be sent to personal UPI handle(s): {', '.join(upis)}. Legitimate SEBI stock brokers never collect client investments via personal UPI accounts.",
                "source": "Extracted Message Payload & SEBI Broker Fund Regulations",
                "provenance": "USER_PROVIDED",
                "certainty": "VERIFIED_EXTRACTION"
            }
        else:
            return {
                "answer": "No direct payment or UPI identifier was extracted from this message.",
                "source": "Case Extraction",
                "provenance": "USER_PROVIDED",
                "certainty": "VERIFIED_EXTRACTION"
            }

    # Case 4: What should I do?
    if any(k in q_lower for k in ["what should i do", "action", "next step", "safe", "help"]):
        steps = ev_pkg.get("before_you_act", [])
        titles = [f"{i+1}. {s['title']}" for i, s in enumerate(steps)]
        return {
            "answer": "Recommended action: " + " ".join(titles),
            "source": "Rakshak Before You Act Guidelines & Cybercrime 1930",
            "provenance": "SAFETY_DIRECTIVE",
            "certainty": "ACTIONABLE"
        }

    # Fallback to explicit uncertainty
    return {
        "answer": f"Rakshak evaluated your query ('{question}'), but does not have verified evidence on this specific point in the current case payload. We refuse to speculate without primary evidence.",
        "source": "Rakshak Evidence-Bound Safety Guardrail",
        "provenance": "INSUFFICIENT_EVIDENCE",
        "certainty": "UNCERTAIN"
    }
