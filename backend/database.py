import sqlite3
import json
import os

DB_PATH = "rakshak.db"

DEMO_CASES = [
    {
        "id": 1, "name": "ABC Invest Scam", "description": "Fake investment scheme promising 250% returns",
        "upi_ids": ["abcinvest@xyz", "abc.invest@paytm"],
        "phones": ["9876543210", "8765432109"],
        "domains": ["abc-invest.com", "abcinvest.in"],
        "social_handles": ["@ABCInvestOfficial", "@abc_invest_guru"],
        "sebi_regs": ["SEBI-FAKE-001", "INH000FAKE1"],
        "patterns": ["guaranteed_return", "urgency", "telegram_migration", "fake_sebi_reg"],
        "risk": "high", "reported_count": 47
    },
    {
        "id": 2, "name": "QuickProfit Ponzi", "description": "Referral-based multi-level investment fraud",
        "upi_ids": ["quickprofit@paytm", "qprofit@upi"],
        "phones": ["9876543211", "7654321098"],
        "domains": ["quickprofit.in", "quick-profit-official.com"],
        "social_handles": ["@QuickProfitGroup", "@quickprofit_india"],
        "sebi_regs": ["SEBI-FAKE-002"],
        "patterns": ["guaranteed_return", "fake_sebi_reg", "mlm_referral"],
        "risk": "high", "reported_count": 83
    },
    {
        "id": 3, "name": "InvestGuru Fraud", "description": "SEBI impersonation with fake advisory",
        "upi_ids": ["abcinvest@xyz", "investguru@hdfc"],
        "phones": ["9999888877", "8888777766"],
        "domains": ["investguru.net", "sebi-invest-guru.com"],
        "social_handles": ["@InvestGuruOfficial", "@sebi_investguru"],
        "sebi_regs": ["SEBI-FAKE-003", "INH000FAKE1"],
        "patterns": ["authority_impersonation", "guaranteed_return", "fake_sebi_reg"],
        "risk": "high", "reported_count": 31
    },
    {
        "id": 4, "name": "CryptoGain India", "description": "Fake crypto investment with withdrawal fees",
        "upi_ids": ["cryptogain@okaxis", "crypto.gain@ybl"],
        "phones": ["9123456780", "8012345678"],
        "domains": ["cryptogain.in", "cryptogain-official.com"],
        "social_handles": ["@CryptoGainIndia", "@crypto_gain_official"],
        "sebi_regs": [],
        "patterns": ["guaranteed_return", "withdrawal_fee_trap", "urgency"],
        "risk": "high", "reported_count": 62
    },
    {
        "id": 5, "name": "StockPro Tips Group", "description": "Paid Telegram group with pump-and-dump tips",
        "upi_ids": ["stockpro@upi", "stockprotips@paytm"],
        "phones": ["9012345678", "8901234567"],
        "domains": ["stockpro-tips.com"],
        "social_handles": ["@StockProTipsOfficial", "@stockpro_tips"],
        "sebi_regs": ["SEBI-FAKE-005"],
        "patterns": ["pump_dump", "fake_sebi_reg", "telegram_migration"],
        "risk": "high", "reported_count": 118
    },
    {
        "id": 6, "name": "Wealth Shield Advisory", "description": "Fake SEBI-registered advisory targeting elderly",
        "upi_ids": ["wealthshield@sbi", "wealth.shield@upi"],
        "phones": ["7890123456", "6789012345"],
        "domains": ["wealthshield.co.in", "wealthshieldadvisory.com"],
        "social_handles": ["@WealthShieldIndia"],
        "sebi_regs": ["SEBI-FAKE-006", "INH000FAKE2"],
        "patterns": ["authority_impersonation", "guaranteed_return", "elderly_targeting"],
        "risk": "high", "reported_count": 29
    },
    {
        "id": 7, "name": "FD Doubling Scheme", "description": "Fixed deposit doubling scam via WhatsApp",
        "upi_ids": ["fdouble@axis", "abcinvest@xyz"],
        "phones": ["9876543210", "5678901234"],
        "domains": ["fd-double.in", "fddoubling.com"],
        "social_handles": ["@FDDoublingScheme"],
        "sebi_regs": [],
        "patterns": ["guaranteed_return", "urgency", "whatsapp_group"],
        "risk": "high", "reported_count": 55
    },
    {
        "id": 8, "name": "NSE Clone Portal", "description": "Cloned NSE website harvesting broker login credentials",
        "upi_ids": ["nsepayment@upi"],
        "phones": ["9345678901"],
        "domains": ["nse-india-official.com", "nseindia-trading.in"],
        "social_handles": ["@NSEOfficialTrading"],
        "sebi_regs": [],
        "patterns": ["portal_clone", "phishing", "credential_harvest"],
        "risk": "high", "reported_count": 34
    },
    {
        "id": 9, "name": "Agri Bond Investment", "description": "Fake agricultural bond scheme in rural areas",
        "upi_ids": ["agribond@paytm", "agri.bond@upi"],
        "phones": ["8234567890", "7123456789"],
        "domains": ["agribond-india.com", "agribondinvestment.in"],
        "social_handles": ["@AgriBondIndia"],
        "sebi_regs": ["SEBI-FAKE-009"],
        "patterns": ["guaranteed_return", "fake_sebi_reg", "rural_targeting"],
        "risk": "high", "reported_count": 71
    },
    {
        "id": 10, "name": "MutualFundExpert Group", "description": "Fake mutual fund advisor with forged certificates",
        "upi_ids": ["mfexpert@hdfc", "mutualfund.expert@okicici"],
        "phones": ["6012345678", "5901234567"],
        "domains": ["mutualfundexpert.in"],
        "social_handles": ["@MFExpertIndia", "@mutualfund_expert"],
        "sebi_regs": ["ARN-FAKE-001"],
        "patterns": ["fake_certificate", "guaranteed_return", "fee_upfront"],
        "risk": "medium", "reported_count": 18
    },
    {
        "id": 11, "name": "IPO Allotment Guarantee", "description": "Charges fee for guaranteed IPO allotment",
        "upi_ids": ["ipoguarantee@ybl", "ipo.allot@upi"],
        "phones": ["9456789012", "8345678901"],
        "domains": ["ipo-guarantee.com", "ipoallotment.in"],
        "social_handles": ["@IPOGuaranteeIndia"],
        "sebi_regs": [],
        "patterns": ["urgency", "fee_upfront", "guaranteed_return"],
        "risk": "high", "reported_count": 43
    },
    {
        "id": 12, "name": "SEBI Refund Scam", "description": "Calls claiming SEBI owes investor money — phishing",
        "upi_ids": ["sebirefund@upi", "sebi.refund@paytm"],
        "phones": ["1800FAKESBI", "9567890123"],
        "domains": ["sebi-refund-portal.com"],
        "social_handles": ["@SEBIRefundPortal"],
        "sebi_regs": [],
        "patterns": ["authority_impersonation", "phishing", "fake_refund"],
        "risk": "high", "reported_count": 92
    },
    {
        "id": 13, "name": "Gold Investment App", "description": "Fake gold investment app asking for Aadhaar + bank details",
        "upi_ids": ["goldinvest@axis", "quickprofit@paytm"],
        "phones": ["7890123456", "9678901234"],
        "domains": ["goldinvest.app", "gold-investment-india.com"],
        "social_handles": ["@GoldInvestApp"],
        "sebi_regs": [],
        "patterns": ["data_harvest", "fake_app", "guaranteed_return"],
        "risk": "high", "reported_count": 66
    },
    {
        "id": 14, "name": "Intraday Jackpot Group", "description": "Paid WhatsApp tips group for intraday trading",
        "upi_ids": ["intradayjackpot@upi", "intraday.jackpot@paytm"],
        "phones": ["8456789012"],
        "domains": ["intradayjackpot.com"],
        "social_handles": ["@IntradayJackpot", "@intraday_jackpot_india"],
        "sebi_regs": ["SEBI-FAKE-014"],
        "patterns": ["pump_dump", "fee_upfront", "fake_sebi_reg"],
        "risk": "medium", "reported_count": 27
    },
    {
        "id": 15, "name": "Real Estate Token Scam", "description": "Fake blockchain real estate tokenization offering 40% yearly",
        "upi_ids": ["retoken@upi", "realtoken@hdfc"],
        "phones": ["9789012345"],
        "domains": ["realestate-token.in", "re-token-india.com"],
        "social_handles": ["@RETokenIndia"],
        "sebi_regs": [],
        "patterns": ["guaranteed_return", "urgency", "tech_jargon_confusion"],
        "risk": "high", "reported_count": 38
    },
]

def _get_seeded_cases():
    """Load cases from authoritative JSON if available, fallback to DEMO_CASES."""
    json_path = os.path.join(os.path.dirname(__file__), "data", "cases", "documented_cases.json")
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                cases = json.load(f)
                if cases and isinstance(cases, list):
                    return cases
        except Exception as e:
            print(f"[DB] Error loading documented_cases.json: {e}")
    return DEMO_CASES

def verify_sebi_registry(claimed_regs=None, org_names=None, domains=None, upi_ids=None):
    """
    Verify entities against the SEBI Recognised Intermediaries Registry.
    Detects valid registration, unlisted registrations, and stolen/impersonated credentials.
    """
    claimed_regs = claimed_regs or []
    org_names = org_names or []
    domains = domains or []
    upi_ids = upi_ids or []
    
    registry_path = os.path.join(os.path.dirname(__file__), "data", "authoritative", "sebi_intermediaries.json")
    if not os.path.exists(registry_path):
        return {
            "status": "not_applicable",
            "message": "SEBI Intermediaries registry not loaded.",
            "matched_entity": None
        }

    try:
        with open(registry_path, "r", encoding="utf-8") as f:
            registry_data = json.load(f)
            intermediaries = registry_data.get("intermediaries", [])
    except Exception as e:
        return {"status": "not_applicable", "message": f"Registry read error: {e}", "matched_entity": None}

    # 1. Check claimed registration numbers
    for reg in claimed_regs:
        clean_reg = reg.strip().upper()
        # Find in registry
        match = next((item for item in intermediaries if item["reg_number"].upper() == clean_reg), None)
        if match:
            # Check for impersonation (e.g. matching reg number but suspicious personal UPI or non-official domain)
            has_domain_mismatch = False
            if domains:
                clean_domains = [d.lower().replace("www.", "") for d in domains]
                off_domains = [od.lower() for od in match.get("official_domains", [])]
                if not any(cd in off_domains or any(od in cd for od in off_domains) for cd in clean_domains):
                    has_domain_mismatch = True

            has_suspicious_upi = False
            if upi_ids:
                auth_upis = [au.lower() for au in match.get("authorized_upi_handles", [])]
                # If UPI is personal or doesn't match authorized escrows
                if not any(u.lower() in auth_upis for u in upi_ids):
                    has_suspicious_upi = True

            if has_domain_mismatch or has_suspicious_upi:
                return {
                    "status": "mismatch",
                    "legal_name": match["name"],
                    "reg_number": match["reg_number"],
                    "entity_type": match["entity_type"],
                    "reason": f"Registration number {reg} belongs to genuine entity '{match['name']}', but communication channels (UPI/domain) do NOT match official records. High probability of broker impersonation.",
                    "official_domains": match.get("official_domains", []),
                    "official_handles": match.get("verified_handles", [])
                }
            
            return {
                "status": "verified",
                "legal_name": match["name"],
                "reg_number": match["reg_number"],
                "entity_type": match["entity_type"],
                "reason": f"Registration verified on SEBI Registry for '{match['name']}'.",
                "official_domains": match.get("official_domains", []),
                "official_handles": match.get("verified_handles", [])
            }
        else:
            return {
                "status": "not_found",
                "claimed_reg": reg,
                "reason": f"Registration number '{reg}' is NOT found in SEBI active intermediary database or uses an illegitimate format."
            }

    # 2. Check org name mentions
    for org in org_names:
        clean_org = org.strip().lower()
        match = next((item for item in intermediaries if clean_org in item["name"].lower() or any(clean_org in h.lower() for h in item.get("verified_handles", []))), None)
        if match:
            return {
                "status": "unverified",
                "legal_name": match["name"],
                "reg_number": match["reg_number"],
                "reason": f"Message mentions '{match['name']}', but no verified authorization or official domain was confirmed."
            }

    return {
        "status": "not_applicable",
        "reason": "No specific SEBI registration number or recognized intermediary claimed."
    }

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.execute("""
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT,
            upi_ids TEXT,
            phones TEXT,
            domains TEXT,
            social_handles TEXT,
            sebi_regs TEXT,
            patterns TEXT,
            risk TEXT,
            reported_count INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    c.execute("""
        CREATE TABLE IF NOT EXISTS community_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            extracted_entities TEXT,
            submitter_hash TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    c.execute("""
        CREATE TABLE IF NOT EXISTS analysis_results (
            id TEXT PRIMARY KEY,
            input_text TEXT,
            entities TEXT,
            claims TEXT,
            content_type TEXT,
            overall_risk TEXT,
            red_flags TEXT,
            safe_next_steps TEXT,
            hindi_summary TEXT,
            related_cases TEXT,
            risk_iq_score INTEGER,
            full_payload TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Ensure full_payload column exists in existing DB
    try:
        c.execute("ALTER TABLE analysis_results ADD COLUMN full_payload TEXT")
    except Exception:
        pass
    
    # Seed cases from JSON or default
    cases_to_seed = _get_seeded_cases()
    for case in cases_to_seed:
        c.execute("""
            INSERT OR REPLACE INTO cases 
            (id, name, description, upi_ids, phones, domains, social_handles, sebi_regs, patterns, risk, reported_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            case["id"], case["name"], case["description"],
            json.dumps(case["upi_ids"]), json.dumps(case["phones"]),
            json.dumps(case["domains"]), json.dumps(case.get("social_handles", [])),
            json.dumps(case.get("sebi_regs", [])), json.dumps(case.get("patterns", [])),
            case["risk"], case.get("reported_count", 1)
        ))
    
    conn.commit()
    conn.close()
    print(f"[DB] Initialized with {len(cases_to_seed)} seeded cases.")

def get_all_cases():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM cases")
    rows = c.fetchall()
    conn.close()
    result = []
    for row in rows:
        r = dict(row)
        for field in ["upi_ids", "phones", "domains", "social_handles", "sebi_regs", "patterns"]:
            r[field] = json.loads(r[field])
        result.append(r)
    return result

def save_analysis(result_id: str, data: dict):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT OR REPLACE INTO analysis_results
        (id, input_text, entities, claims, content_type, overall_risk, red_flags, safe_next_steps, hindi_summary, related_cases, risk_iq_score, full_payload)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        result_id,
        data.get("input_text", ""),
        json.dumps(data.get("entities", {})),
        json.dumps(data.get("claims", [])),
        data.get("content_type", ""),
        data.get("overall_risk", ""),
        json.dumps(data.get("red_flags", [])),
        json.dumps(data.get("safe_next_steps", [])),
        data.get("hindi_summary", ""),
        json.dumps(data.get("related_cases", [])),
        data.get("risk_iq_score", 0),
        json.dumps(data)
    ))
    conn.commit()
    conn.close()

def get_analysis(result_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM analysis_results WHERE id = ?", (result_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        return None
    r = dict(row)
    if r.get("full_payload"):
        try:
            payload = json.loads(r["full_payload"])
            return payload
        except Exception:
            pass
    for field in ["entities", "claims", "red_flags", "safe_next_steps", "related_cases"]:
        r[field] = json.loads(r[field])
    return r

def save_community_report(content: str, entities: dict, submitter_hash: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO community_reports (content, extracted_entities, submitter_hash)
        VALUES (?, ?, ?)
    """, (content, json.dumps(entities), submitter_hash))
    conn.commit()
    report_id = c.lastrowid
    conn.close()
    return report_id

def get_community_report_count():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM community_reports")
    count = c.fetchone()[0]
    conn.close()
    return count
