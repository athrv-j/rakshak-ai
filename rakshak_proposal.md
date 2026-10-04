# RAKSHAK — SANGYAN 2026 Hackathon Strategy

> **SANGYAN** | IIT BHU Varanasi x SEBI x NSDL | 4-Day Online Hackathon
> **Your Track**: A (Digital Fraud & Scam Resilience) + E (Misinformation & Financial Content Literacy)

---

## What Your Document Already Has (Strong Foundation)

Your Word doc "Rakshak — AI Financial Firewall" is **very well thought out**. Here's what's already defined:

| Section | Status |
|---|---|
| Problem Statement | Clear & specific |
| Core User Journey (6 steps) | Excellent |
| Scam DNA Graph concept | Unique & differentiating |
| Trust Passport output | Well-designed |
| Bharat-First design principles | Addressed |
| MVP Tech Stack | Defined (React + FastAPI + SQLite + NetworkX) |
| Demo Script (3-5 min) | Scripted |
| 48-Hour Build Plan | Mentioned |
| Team Roles | Defined |

---

## THE UNIQUE IDEA ANGLE — What Will Make You WIN

Your document is solid, but the **Scam DNA Graph** is your secret weapon. Here's how to sharpen the unique angle:

### Core Differentiator: "Financial Fingerprinting"

> **Instead of just flagging ONE message as suspicious, Rakshak maps the entire ECOSYSTEM of a scam operation — connecting UPI IDs, phone numbers, social handles, and domain patterns across MULTIPLE cases.**

This is genuinely novel for India's retail investor space. No existing tool does this at this level.

---

## UNIQUE ADDITIONS Your Document Doesn't Have Yet

### 1. "Scam Lineage" Feature (NEW)
Show users **how a scam evolved over time** — e.g., same operator changed UPI ID but kept same phone, moved from Telegram to Instagram. Visual timeline of operator behavior.

**Why it wins:** It turns static fraud detection into a **living intelligence network** — far more compelling for judges.

### 2. "Whisper Network" — Crowdsourced Case Reporting (NEW)
Allow users to **anonymously submit suspicious messages** to expand the seeded case database in real-time. Each submission enriches the Scam DNA graph.

**Why it wins:** Addresses SANGYAN's focus on **community resilience**, not just individual protection. Shows scalability.

### 3. "Investor Risk IQ" — Gamified Literacy Score (NEW)
After using Rakshak, show the user a **Financial Scam IQ score** based on what red flags they spotted vs. what Rakshak found. Teaches through feedback loops.

**Why it wins:** Directly targets SANGYAN's Track E (misinformation literacy) and the **young investor** target demographic.

### 4. WhatsApp-Forward Deeplink (NEW)
Generate a shareable link: `rakshak.app/check?id=XXXXX` that a user can **forward to family members** so they can also see the Trust Passport for a suspicious message they received.

**Why it wins:** Targets **elderly investors and families** — a key SANGYAN demographic. Turns Rakshak into a community tool.

### 5. Voice-First Mode (Enhance Existing)
Your doc mentions voice as "nice-to-have." **Make it a core feature for the demo.** A Hindi-speaking grandmother can say: *"Yeh message safe hai kya?"* and get a voice response.

**Why it wins:** Judges are explicitly told to look for voice interfaces. This will emotionally resonate.

---

## AUTHORITATIVE DATASET STORY (Judges' Favorite)

Instead of claiming to have "downloaded a generic Kaggle dataset and fine-tuned an LLM", Rakshak is powered by the **Rakshak Financial Scam Intelligence Dataset (R-FSID)** built directly from primary SEBI and exchange sources:

| Source | Role in Rakshak |
|---|---|
| **SEBI Recognised Intermediaries** | Real-time registry verification (INZ / INA / INH / ARN / INP) |
| **SEBI Fake Trading App Scam Landscape** | 8-stage Scam DNA Attack Ontology (28 distinct behavioral markers) |
| **SEBI Social Media Frauds Material** | Hook, Grooming, and Psychological manipulation taxonomies |
| **SEBI Enforcement Orders (Sec 11B)** | Ground-truth syndicates & IOC graphs (UPI, phone, domain, APK) |
| **SEBI Check & Broker Whitelisting (2026)** | Ecosystem guardrails checking official UPI handles & domains |

---

## RECOMMENDED MVP SCOPE (What to Actually Build in 4 Days)

Focus on **depth over breadth**. Build these 5 things PERFECTLY:

### Must-Build (MVP Core)

```
1. Screenshot Upload -> OCR -> Entity Extraction
   (UPI, Phone, URL, Social Handle, SEBI reg no., Claims)

2. Trust Passport Output
   (Visual card: Identity | Claims | Red Flags | Safe Next Steps)

3. Scam DNA Graph (Seeded with 20-30 demo cases)
   (NetworkX backend -> D3.js or React Force Graph frontend)

4. Hindi Language Mode
   (UI toggle + translated Trust Passport output)

5. Promotion vs Education Classifier
   (LLM prompt: classify as Educational / Promotional / Manipulative)
```

### Add If Time Permits

```
- Whisper Network (anonymous submission form -> adds to case DB)
- Investor Risk IQ score
- WhatsApp share deeplink
- Voice input (Web Speech API — no extra infra needed)
```

---

## RECOMMENDED TECH STACK (Refined)

| Layer | Tool | Why |
|---|---|---|
| Frontend | React + Vite | Fast, modern |
| Styling | Tailwind CSS | Rapid prototyping |
| Graph Viz | React Force Graph or D3.js | Beautiful interactive graphs |
| Backend | FastAPI (Python) | Fast to build, async |
| OCR | Google Cloud Vision API (free tier) | Better than Tesseract for screenshots |
| NLP/AI | Gemini API (free, generous limits) | Entity extraction + claim analysis |
| Graph | NetworkX -> JSON for frontend | Simple, no extra infra |
| DB | SQLite | Zero setup, demo-ready |
| TTS/Voice | Web Speech API | Browser-native, no infra |
| Language | Gemini translate prompt | Hindi/Marathi output |

> [!TIP]
> Use **Gemini API** for both entity extraction AND claim analysis with a single well-crafted prompt. This removes the need for a separate NLP model and speeds up development massively.

---

## EVALUATION CRITERIA ALIGNMENT

| SANGYAN Criteria | How Rakshak Addresses It |
|---|---|
| **1. Investor Resilience & Safety** | Core purpose — stops money transfer BEFORE it happens |
| **2. Bharat-First Usability** | Hindi mode, voice input, large cards, simple flow |
| **3. Trust, Privacy & Guardrail Compliance** | No stock tips, no OTP collection, privacy-by-design |
| **4. Technical Execution** | Working prototype with real OCR + AI pipeline |
| **5. Impact & Scalability** | Crowdsourced graph grows with users; API-ready for SEBI integration |

---

## YOUR PITCH NARRATIVE (One-Liner)

> **"Rakshak doesn't just tell you a message is suspicious — it shows you the entire criminal fingerprint behind it."**

---

## RISKS TO WATCH

| Risk | Mitigation |
|---|---|
| OCR accuracy on low-quality screenshots | Use Google Vision API + fallback text paste |
| Gemini API rate limits | Cache responses + use seeded demo data |
| Graph too complex for judges | Prepare 3 specific demo paths, not open exploration |
| Hindi translation quality | Pre-translate key Trust Passport phrases manually |
| Looks like a "stock tip" tool | Always frame as VERIFICATION not RECOMMENDATION |

---

## SUGGESTED 4-DAY BUILD TIMELINE

| Day | Focus |
|---|---|
| **Day 1** | Setup + Backend (FastAPI + OCR + Gemini entity extraction) |
| **Day 2** | Frontend (Upload UI + Trust Passport UI + Hindi toggle) |
| **Day 3** | Scam DNA Graph (seed 25 demo cases + NetworkX + React viz) |
| **Day 4** | Polish + Demo video + PPT + Whisper Network (if time) |

---

## OTHER IDEAS YOU COULD PIVOT TO (If Needed)

| Idea | Track | Unique Angle |
|---|---|---|
| **SEBI Sathi Bot** | A + C | WhatsApp chatbot that explains grievance filing in regional languages |
| **FinFluencer Watchdog** | E | Rates YouTube/Instagram financial influencers by disclosure compliance |
| **Nominee Guardian** | D | Helps elderly investors document nominees with guided voice flow |
| **Disclosure Simplifier** | B | Converts complex mutual fund documents to plain Hindi summaries |
| **Pump & Dump Detector** | A | Detects coordinated messaging spikes in Telegram investment groups |

> [!NOTE]
> **Rakshak is still your best bet.** The Scam DNA Graph concept is genuinely unique and highly visual — critical for a 4-day hackathon where you need to WOW judges quickly.

---

## IMMEDIATE NEXT STEPS

1. **Lock your team roles** (Frontend / Backend / AI / Data / Pitch)
2. **Get Gemini API key** (free at aistudio.google.com)
3. **Seed your demo database** with 25-30 realistic Indian scam case examples
4. **Build the Trust Passport card first** — it's the hero UI element
5. **Record demo video on Day 4 morning** — leave buffer for edits

---

*Built for SANGYAN 2026 | IIT BHU x SEBI x NSDL*
