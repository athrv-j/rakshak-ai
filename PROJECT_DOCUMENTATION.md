# 🛡️ PROJECT RAKSHAK (रक्षक)
### *AI-Powered Investor Defense Firewall & Scam DNA Knowledge Graph*
**Unified Track A (Regulatory Verification & Claim Auditing) + Track E (Syndicate Threat Intelligence & Cross-Case Linkage)**

---

## 1. Project Title
* **Official Project Name:** **RAKSHAK** (Cyber Financial Defense & Scam Intelligence Engine)
* **Tagline:** *"Before you trust it, Rakshak checks it — Decoding Scam DNA Before Capital is Lost."*
* **Core Philosophy:** Transforming isolated, victim-blaming fraud warnings into a deterministic, evidence-bound defense graph combining real-time regulatory registers with syndicated threat intelligence.

---

## 2. Problem Statement

### 2.1 The Real-World Crisis
India's retail investment revolution has seen over 160+ million demat accounts opened, with millions of first-time investors entering capital markets via digital platforms. However, this democratization has been met with an unprecedented industrialization of financial cyber fraud. Over ₹1.2 Lakh Crore was lost to financial cybercrimes in India between 2022 and 2025.

### 2.2 Why the Problem Matters
Unlike traditional credit card or phishing theft where unauthorized transactions occur without consent, **modern investment scams deceive the victim into authorizing the transaction themselves**. Victims liquidate life savings, take emergency personal loans, and transfer funds willingly under the influence of psychological coercion, forged credentials, and fabricated profit screens.

### 2.3 Who Is Affected
1. **Tier-2 & Tier-3 Retail Investors:** First-generation investors lacking institutional financial literacy who rely on WhatsApp and Telegram groups for market tips.
2. **Senior Citizens & Pensioners:** Targeted with "pre-IPO allocations", "institutional trading bypass", and "guaranteed pension multiplier" schemes.
3. **Legitimate Financial Intermediaries:** SEBI-registered brokers (e.g., Zerodha, Groww, AngelOne) and registered Research Analysts (RAs) whose identities, logos, and registration numbers are cloned by criminal syndicates.
4. **Law Enforcement & Regulators (MHA/I4C/SEBI):** Overwhelmed with thousands of fragmented complaints daily that lack cross-case entity linkage.

### 2.4 Limitations of Current Solutions
* **Passive Static Warning Lists:** Circulars and PDFs published on regulatory websites are buried in bureaucratic language and never reach a citizen at the moment of persuasion.
* **Isolated Verification Tools:** Checking a SEBI registration number requires manually scouring tabular databases across disparate portals; citizens do not know how to cross-examine whether the recipient UPI matches the registered intermediary.
* **Lack of Contextual Ingestion:** Existing antivirus and SMS spam filters only flag known spam numbers; they fail completely on encrypted channels (Telegram, WhatsApp) and cannot parse screenshots or QR codes.
* **The "Escrow Bypass" Blind Spot:** Fraudsters routinely use real registered firm names while directing deposits to mule UPI accounts (e.g., `hdfc-wealth-management@okaxis` belonging to a private individual). No existing consumer tool flags this architectural mismatch.

---

## 3. Our Solution
RAKSHAK is an active **AI Financial Firewall & Cyber Defense Engine** that operates as an intelligent verification proxy between incoming investment messages and citizen bank accounts.

```
+----------------------------------------------------------------------------------------------------+
|                                    CITIZEN INCOMING CLAIM                                          |
| (WhatsApp forward, Telegram channel post, Instagram ad, SMS, Trading App Screenshot, or Voice Note) |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                  RAKSHAK FINANCIAL FIREWALL                                        |
|                                                                                                    |
|   [Track A: Ingestion & Verification]           |    [Track E: Intelligence & Graph Engine]        |
|   - Multi-modal OCR & Speech Transcriber        |    - Scam DNA Fingerprinting                     |
|   - Statutory SEBI Intermediary Registry Check  |    - Cross-Case Entity Correlation               |
|   - Escrow Bypass & Personal UPI Detector       |    - Syndicated Modus Operandi Clustering        |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                    DIGITAL TRUST PASSPORT(TM)                                      |
| - Unmistakable Verdict: [STOP - HIGH RISK] / [VERIFIED OFFICIAL] / [CAUTION - UNVERIFIED]          |
| - Forensic Highlights (SEBI Status, Payment Destination, Urgency Tactics, Linked Cases)           |
| - 3 Immediate Actions: Do Not Pay | Dial 1930 Helpline | Verify via SEBI SCORES                     |
| - Audio Readout in 8 Indian Regional Languages                                                     |
+----------------------------------------------------------------------------------------------------+
```

### What Makes RAKSHAK Unique & Innovative:
1. **Deterministic Regulatory Cross-Examination:** We do not guess with general LLM predictions; we query authoritative SEBI registries directly and cross-reference claimed credentials against designated bank accounts.
2. **Escrow Bypass Detection:** Instantly flags the fatal mismatch between corporate intermediary claims and personal peer-to-peer (P2P) UPI payment endpoints.
3. **Scam DNA Network Intelligence:** Reconstructs the underlying infrastructure of the syndicate (shared telephone numbers, mule UPIs, spoofed domains, and Telegram channels) across thousands of citizen reports.
4. **Digital Trust Passport™:** Replaces vague confidence scores with an evidence-backed certificate that explains *why* something is fraudulent in plain, regional language.

---

## 4. Core Idea — The Scam DNA Graph

### 4.1 What Is the DNA Graph?
The **Scam DNA Graph** is a knowledge graph network that treats scam campaigns not as isolated events, but as genetically linked operations that share underlying infrastructure and behavioral patterns.

```
       [Citizen Case 1]                                [Citizen Case 2]
     (Telegram VIP Club)                              (WhatsApp Stock Tips)
             |                                                 |
             +-------------> (UPI: fastwealth@axis) <----------+
                                     |
                                     v
                       [Mule Account Infrastructure]
                                     |
             +-----------------------+------------------------+
             |                                                |
             v                                                v
    (Phone: +91 98765...)                           (Domain: profit-sebi.in)
             |                                                |
             v                                                v
    [Syndicate Cluster #14] <========================> [Fake SEBI Reg: INH000999]
```

### 4.2 Why a Graph Database is Required
Relational databases (SQL) require expensive multi-table joins to trace connections beyond one degree of separation. In fraud investigation, a fraudster may use **UPI A** in one scheme and **Phone Number B** in another, while **Phone B** was previously tied to **Telegram Channel C**. A graph database models these entities as first-class citizens, enabling sub-millisecond, multi-hop traversals to uncover entire fraud networks.

### 4.3 Nodes and Edges Representation
* **Node Types:**
  * `CaseNode`: Represents an analyzed report (text, screenshot, citizen case ID).
  * `UPINode`: Virtual Payment Address (e.g., `invest@okicici`).
  * `PhoneNode`: Extracted telephone number / WhatsApp contact.
  * `DomainNode`: URL, host, or registrar domain.
  * `RegNode`: Claimed regulatory license (e.g., `INH000012345`).
  * `ChannelNode`: Telegram group, WhatsApp community, or Instagram handle.
  * `TacticNode`: Behavioral signature (e.g., *Guaranteed 100% Yield*, *Fake Institutional App*, *Urgency Pressure*).
* **Edge Types (Relationships):**
  * `[:UTILIZES_PAYMENT]` $\rightarrow$ Links Case to UPI handle.
  * `[:CONTACTS_VIA]` $\rightarrow$ Links Case to Phone number or Channel.
  * `[:IMPERSONATES_REG]` $\rightarrow$ Links Case to statutory license number.
  * `[:HOSTED_ON]` $\rightarrow$ Links Case to Domain/URL.
  * `[:EXHIBITS_TACTIC]` $\rightarrow$ Links Case to psychological manipulation tactic.
  * `[:CO_OCCURS_WITH]` $\rightarrow$ Weighted correlation between two entities sharing campaigns.

### 4.4 Flow of Information
When a new message is analyzed, its extracted entities are projected into the graph. The system executes a neighborhood expansion query. If an incoming UPI handle has an edge pointing to an entity cluster already flagged in previous cybercrime cases, the new submission inherits that risk profile instantly, even if the scammer changed their name and marketing pitch.

### 4.5 Non-Technical Analogy for Judges
> *"Think of financial scammers like international counterfeiters. They might print different book covers (different message texts and logos), but they all buy paper from the same paper mill and use the same printing press (the same mule bank accounts and phone numbers). The Scam DNA Graph ignores the cover story and fingerprints the printing press."*

---

## 5. Track A + Track E Integration

| Dimension | Track A: Claim Verification & Regulatory Checks | Track E: Scam DNA Intelligence & Syndicate Linkage | **Unified Rakshak Synergistic Engine** |
| :--- | :--- | :--- | :--- |
| **Primary Focus** | Does this specific message match official statutory records? | How does this message relate to other cybercrime operations? | **Complete Defense:** Immediate statutory audit + systemic crime footprinting. |
| **Key Inputs** | Claimed SEBI numbers, broker names, return guarantees, URLs. | Extracted identifiers, mule UPIs, Telegram channels, behavioral modus operandi. | Ingests claims through multi-modal OCR/voice, verifies regulatory compliance, then maps shared IOCs into the network graph. |
| **Output** | Regulatory validity badge (`Verified`, `Fake/Unlisted`, `Unregistered`). | Network graph showing linked syndicates, shared mule rings, and case clusters. | **Digital Trust Passport™:** Unites regulatory non-compliance with visual proof of syndicate overlap. |
| **Why Combined?** | A SEBI check alone cannot tell you if an unregistered entity has stolen crores elsewhere. | A syndicate graph alone cannot tell you if an intermediary is legally registered with SEBI. | **Together:** Catches impersonators trying to hide behind real SEBI credentials while directing funds to mule accounts. |

---

## 6. How the System Works: End-to-End Workflow

```
[1. CITIZEN INPUT]
      |-- Pastes text, uploads screenshot/QR, or speaks voice query in 8 languages.
      v
[2. INGESTION & PRE-PROCESSING]
      |-- Normalization, Multi-modal OCR text extraction, Web Speech API transcription.
      v
[3. FORENSIC ENTITY & HEURISTIC SENSORS]
      |-- Regex + NER extracts: UPI VPAs, Phones, URLs, SEBI Reg IDs, Telegram handles.
      |-- Live sensors flag: Escrow bypass, urgent FOMO claims, non-financial chatter.
      v
[4. TRACK A: STATUTORY REGISTRY CROSS-EXAMINATION]
      |-- Instant lookup against local indexed SEBI Intermediary Registry database.
      |-- Validates: Entity name match, registration validity, permitted business scope.
      v
[5. TRACK E: SCAM DNA GRAPH PROJECTION]
      |-- Entities queried against Network Graph.
      |-- Evaluates: Multi-hop shared infrastructure, co-occurring mule accounts.
      v
[6. AI SYNTHESIS & RISK ENGINE]
      |-- Computes Risk Score (0-100) & classifies into Action Verdict.
      |-- Generates SHA-256 cryptographic provenance hash.
      v
[7. OUTPUT: DIGITAL TRUST PASSPORT(TM)]
      |-- Displays High-Impact Verdict, 4 Forensic Chips, and 3 Immediate Actions.
      |-- Triggers interactive 3D Scam Network visualization.
      |-- Provides Regional Voice Readout via native speech synthesis.
```

---

## 7. System Architecture

```
+----------------------------------------------------------------------------------------------------+
|                                    PRESENTATION LAYER (Frontend)                                   |
| - React 19 + Vite + Tailwind CSS / Modern Light Theme Design System                                 |
| - Three.js WebGL: 3D Holographic Protection Shield Core                                             |
| - 3D / 2D Force-Directed Graph Engine (WebGL canvas with interactive camera orbit)                 |
| - Web Speech API: Regional Voice Recognition & Regional Speech Synthesis Readout                    |
+-------------------------------------------------+--------------------------------------------------+
                                                  | REST API (HTTP / JSON / Multi-part)
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                   APPLICATION GATEWAY & LOGIC (FastAPI)                             |
| - Asynchronous Request Dispatcher & CORS Security Middleware                                      |
| - Multi-Modal Ingestion Controller (Text, Screenshot File Upload, Audio Stream)                    |
| - Real-time Heuristic Sensor Pipeline & Live Input Validator                                       |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
         +----------------------------------------+----------------------------------------+
         |                                                                                 |
         v                                                                                 v
+------------------------------------+                           +------------------------------------+
|    TRACK A: REGULATORY VERIFICATION |                           |      TRACK E: SCAM DNA ENGINE       |
| - SEBI Registry Index (Fast SQLite/ |                           | - NetworkX / In-Memory Graph Index  |
|   In-Memory Inverted Index)        |                           | - Deterministic IOC Matcher        |
| - SEBI Registration Format Validator|                           | - Cross-Case Linkage Matrix        |
| - P2P UPI Escrow Bypass Checker    |                           | - Modus Operandi Pattern Evaluator |
+------------------------------------+                           +------------------------------------+
         |                                                                                 |
         +----------------------------------------+----------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                 SYNTHESIS & PROVENANCE GENERATOR                                    |
| - Evidence Package Builder (Verdict, Explanations, Action Matrix)                                  |
| - Cryptographic SHA-256 Content Hasher & Case Vault Storage                                        |
| - Multilingual Dynamic Prompt Engine (Translates forensic insights into 8 Indian languages)       |
+----------------------------------------------------------------------------------------------------+
```

---

## 8. AI/ML Component

### 8.1 Where AI is Used
1. **Multi-Modal Text Extraction:** OCR parsing of messy forwarded screenshots, chat bubbles, and watermarked payment receipts.
2. **Entity & Claim Recognition:** Extracting unstructured investment promises (*"Double your money in 15 days"*, *"Zero risk pre-IPO quota"*).
3. **Behavioral Manipulation Classification:** Categorizing psychological coercion strategies (Artificial Scarcity, Authority Impersonation, Social Proof).
4. **Natural Language Translation & Synthesized Explanations:** Generating plain-language explanations in regional Indian dialects.

### 8.2 Why Rule-Based Logic Alone is Insufficient
Scammers intentionally introduce typographical obfuscations (e.g., `S.E.B.I. approved`, `U-P-I: pay*here`, writing numbers in Hindi-English code words). Pure regex patterns will miss these obfuscations. An AI linguistic model recognizes semantic intent regardless of character substitutions.

### 8.3 Algorithms & Models Used
* **Lightweight Heuristic Transformer / Fast Embeddings:** Semantic similarity matching between new claims and known fraud patterns.
* **Deterministic Fallback Pipeline:** Zero-hallucination guarantee — regulatory verification is performed strictly against actual databases, using AI solely to normalize and extract entities.

---

## 9. DNA Graph Algorithm & Pseudocode

```python
class ScamDNAGraphEngine:
    def __init__(self):
        self.graph = NetworkGraph()  # Nodes: Cases, UPIs, Phones, Regs, Tactics

    def process_new_submission(self, case_id, raw_content, extracted_entities):
        # Step 1: Create Case Node
        content_hash = sha256(raw_content.encode()).hexdigest()
        case_node = self.graph.add_node(
            node_id=case_id,
            node_type="case",
            hash=content_hash,
            timestamp=get_current_utc()
        )

        # Step 2: Bind Extracted Identifiers (Nodes & Edges)
        for upi in extracted_entities.get("upi_ids", []):
            upi_node = self.graph.get_or_create_node(node_id=upi, node_type="upi")
            self.graph.add_edge(case_node, upi_node, relation="UTILIZES_PAYMENT")

        for phone in extracted_entities.get("phone_numbers", []):
            phone_node = self.graph.get_or_create_node(node_id=phone, node_type="phone")
            self.graph.add_edge(case_node, phone_node, relation="CONTACTS_VIA")

        for reg in extracted_entities.get("sebi_reg_numbers", []):
            reg_node = self.graph.get_or_create_node(node_id=reg, node_type="sebi_reg")
            self.graph.add_edge(case_node, reg_node, relation="CLAIMS_REGISTRATION")

        # Step 3: Graph Traversal & Syndicate Linkage Analysis
        linked_cases = set()
        syndicate_score = 0.0

        for entity_node in self.graph.get_neighbors(case_node):
            connected_cases = [n for n in self.graph.get_neighbors(entity_node) 
                               if n.type == "case" and n.id != case_id]
            for past_case in connected_cases:
                linked_cases.add(past_case)
                syndicate_score += 25.0  # Increment risk per shared deterministic IOC

        # Step 4: Output Correlation Results
        return {
            "syndicate_detected": len(linked_cases) > 0,
            "connected_case_count": len(linked_cases),
            "linked_cases": list(linked_cases),
            "graph_risk_boost": min(syndicate_score, 50.0)
        }
```

---

## 10. Feature Breakdown

### 10.1 Core Features
* Real-time statutory cross-examination of claimed credentials against SEBI databases.
* Multi-modal ingestion supporting raw text, WhatsApp/Telegram forwards, and screenshots.
* Live Threat Sensor strip providing sub-second heuristics on user input.

### 10.2 AI Features
* Behavioral manipulation detection flagging guaranteed returns, urgent FOMO, and false statutory claims.
* Dynamic Multilingual Explainer translating technical security verdicts into plain regional dialects.

### 10.3 Graph Features
* Real-time entity correlation linking shared mule UPIs, phone numbers, and domains across cases.
* Dual-Engine Interactive Graph: Full 3D WebGL orbit graph + 2D Force-Directed visualizer.
* Side-by-Side Case Comparator identifying exact shared infrastructure between two distinct messages.

### 10.4 User-Facing & Accessibility Features
* Digital Trust Passport™ providing an unmistakable, visual security verdict with a clear action matrix.
* One-Tap Golden Hour Action dialing the 1930 National Cybercrime Reporting Portal.
* Regional speech synthesis reading verdicts aloud for elderly and low-literacy citizens.
* High-visibility, crisp Light Fintech Theme optimized for outdoor mobile use.

### 10.5 Advanced & Future Features
* Browser extension intercepting malicious links on social web apps.
* SDK integration into consumer UPI apps to warn users before funds leave their account.

---

## 11. MVP vs. Future Scope

```
+----------------------------------------------------------------------------------------------------+
|                                    MINIMUM VIABLE PRODUCT (MVP)                                    |
| [X] Full FastAPI Backend with async ingestion (/analyze/text, /analyze/screenshot, /compare)       |
| [X] Indexed SEBI Intermediary Registry database validation                                        |
| [X] Working Scam DNA Graph engine with deterministic entity linking                                |
| [X] React 19 Frontend with Light Fintech Design System & 3D Three.js Visual Shield                 |
| [X] Digital Trust Passport(TM) with 7 Audited Dimensions & Action Matrix                          |
| [X] Multilingual Voice Dictation & Audio Readout in 8 Indian Regional Languages                    |
| [X] Side-by-Side Dual-Case Comparator Tool                                                         |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                  SHOULD HAVE (Next Iteration / Phase 2)                            |
| [*] WhatsApp Verification Bot webhook (forward message -> receive Trust Passport card)             |
| [*] Direct API ingestion endpoint for Citizen Cyber Crime Reporting Portal (1930)                  |
| [*] Automated nightly sync with SEBI & RBI gazette updates                                         |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                  FUTURE / OPTIONAL (Commercial Scale)                              |
| [ ] Banking SDK for pre-transaction UPI beneficiary verification inside GPay / PhonePe / Paytm     |
| [ ] Federated learning network between commercial banks to freeze mule accounts in real time       |
+----------------------------------------------------------------------------------------------------+
```

---

## 12. Complete User Journey

```
[Step 1: Ingestion]
Citizen receives a forwarded Telegram tip promising 200% return.
Citizen opens Rakshak on mobile -> Pastes text or uploads screenshot.

[Step 2: Real-time Feedback]
As citizen types, the Live Threat Sensor highlights:
- Personal UPI Handle (@okaxis)
- Urgency Trigger ("Only 15 slots remaining")

[Step 3: Multi-Vector Verification]
Citizen clicks "Check Message Now".
A 6-stage holographic animation executes:
1. Entity extraction -> 2. Claim check -> 3. SEBI database query ->
4. Scam DNA Graph traversal -> 5. Risk score synthesis -> 6. Passport generation.

[Step 4: Trust Passport & Verdict]
Screen displays STOP - HIGH RISK SCAM.
Citizen listens to the audio readout in Hindi explaining that genuine SEBI entities
never collect funds into personal UPI accounts.

[Step 5: Immediate Action]
Citizen taps "Dial 1930 Helpline" or blocks the scammer immediately. Zero money lost.
```

---

## 13. Realistic Example Use Case Walkthrough

### Sample Scam Input:
```
SEBI APPROVED OPPORTUNITY!
Invest ₹10,000 and get ₹25,000 guaranteed in 30 days.
Only 20 slots remaining. Join our VIP Telegram: @ABCInvestOfficial
UPI ID for booking: abcinvest@xyz
Website: abc-invest.com
SEBI Registration: INH000FAKE1
```

### System Execution:
1. **Entity Extraction:**
   * UPI: `abcinvest@xyz`
   * SEBI Number: `INH000FAKE1`
   * Channel: `@ABCInvestOfficial`
   * Domain: `abc-invest.com`
2. **Track A Check:** Queries SEBI database for `INH000FAKE1`. Result: **NOT FOUND IN REGISTRY (Fake License Number)**.
3. **Escrow Bypass Detection:** Flags personal payment destination `abcinvest@xyz`.
4. **Track E Graph Linkage:** Queries graph for `abcinvest@xyz`. Finds that this handle was previously reported in 3 other cyber fraud complaints across Pune and Bengaluru.
5. **Final Output (Digital Trust Passport™):**
   * **Verdict:** ⛔ STOP — HIGH RISK SCAM
   * **Risk Score:** 94/100
   * **Key Highlights:** Fake SEBI Number | Personal UPI Detected | 3 Linked Cybercrime Reports.
   * **Immediate Actions:** DO NOT PAY | Dial 1930 Helpline | File Complaint on SEBI SCORES.

---

## 14. Technology Stack Justification

| Layer | Selected Technology | Technical Justification |
| :--- | :--- | :--- |
| **Frontend** | **React 19 + Vite** | Instant HMR, minimal bundle overhead, component modularity. |
| **Styling** | **Custom CSS / Tailwind** | Ultra-responsive, clean light fintech design tokens with custom HUD elements. |
| **3D & Graphics** | **Three.js + ForceGraph2D/3D** | Hardware-accelerated WebGL rendering for 3D interactive defense shield and graph models. |
| **Backend** | **Python FastAPI** | Native asynchronous concurrency, high throughput, automated OpenAPI documentation. |
| **Graph Engine** | **NetworkX / Graph Index** | Deterministic in-memory graph traversal with zero external database connection latency. |
| **Registry Storage**| **Indexed SQLite / JSON** | Sub-millisecond lookup latency for fast statutory intermediary validation. |
| **Audio/Voice** | **HTML5 Web Speech API** | Universal browser-level support for speech-to-text dictation and speech synthesis readouts. |

---

## 15. Database & Data Model

### Relational Schema (Entities & Registries)
```sql
-- SEBI Statutory Registry Table
CREATE TABLE sebi_registry (
    registration_no VARCHAR(32) PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(64) NOT NULL, -- Research Analyst, Broker, RIA
    valid_from DATE,
    valid_upto DATE,
    status VARCHAR(16) DEFAULT 'ACTIVE',
    official_domain VARCHAR(255)
);

-- Case Vault Table
CREATE TABLE case_vault (
    case_id VARCHAR(64) PRIMARY KEY,
    content_hash VARCHAR(64) NOT NULL,
    raw_text TEXT,
    risk_score INTEGER,
    verdict VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Graph Data Model (Nodes & Relationships)
* `(:CaseNode {id, hash, risk_score, timestamp})`
* `(:UPINode {handle, bank_domain, report_count})`
* `(:PhoneNode {number, country_code, carrier})`
* `(:DomainNode {url, domain_name, is_suspicious})`
* `(:RegNode {registration_no, status, verified_entity})`

---

## 16. API Specification

| Endpoint | Method | Input Parameters | Output Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/analyze/text` | `POST` | `{"text": string}` | `EvidencePackage` (JSON) | Primary verification pipeline for text messages. |
| `/analyze/screenshot` | `POST` | `Multipart/form-data (file)`| `EvidencePackage` (JSON) | OCR extraction + multi-vector verification. |
| `/analyze/compare` | `POST` | `{"text_a": str, "text_b": str}` | `ComparisonResult` (JSON) | Side-by-side IOC overlap & shared DNA detection. |
| `/graph/full` | `GET` | *None* | `{"nodes": [], "links": []}` | Serialized graph for full 3D/2D visual rendering. |
| `/analyze/ask` | `POST` | `{"result_id": str, "question": str}` | `{"answer": str, "provenance": str}`| Natural language Q&A regarding a specific case. |
| `/health` | `GET` | *None* | `{"status": "healthy", "sebi_records": int}` | Health check and regulatory sync status. |

---

## 17. UI/UX Screen Specifications

1. **Top Navigation Header:** Frosted glass navbar with live statutory indicator (`SEBI DB Live`), Emergency Golden Hour trigger (`1930 Helpline`), and regional language selector.
2. **Hero & 3D Interactive Shield:** High-impact value proposition featuring an interactive WebGL Three.js glass shield with orbiting verification nodes.
3. **Primary Scanner & Live Threat Sensors:** Dual-tab input (Text / Screenshot) with sub-second heuristic indicators highlighting detected UPIs, claims, and urgency in real time.
4. **Investigation Hologram Screen:** 6-stage sequential radar inspection animation displaying real-time inspection telemetry and latency metrics.
5. **Digital Trust Passport™ Page:** Unmistakable colored hero banner (`STOP`, `SAFE`, `BE CAREFUL`), 4 forensic highlight chips, 3 high-impact action cards, and voice read-aloud controls.
6. **3D Scam DNA Graph Explorer:** Fullscreen interactive canvas allowing users to orbit, zoom, and click nodes to inspect connected criminal syndicates.
7. **Side-by-Side Case Comparator:** Dual-column comparative interface highlighting exact deterministic IOC overlaps and operational differences.

---

## 18. 3D & Visual Experience Architecture
* **Holographic 3D Shield (Three.js):** Custom extruded geometry with glass-like transmission (`roughness: 0.12`, `transmission: 0.65`, `ior: 1.52`), responsive lighting, and 7 orbiting data nodes.
* **3D Force Network (ForceGraph3D):** Hardware-accelerated canvas mapping nodes as glowing emissive spheres with color-coded risk vectors and dynamic camera tweening.
* **Smooth Micro-Animations (Framer Motion):** Staggered layout reveals, subtle bracket pulses, and drag-and-drop feedback overlays.

---

## 19. Genuine Innovation & Judge Takeaway
* **Why Judges Remember Rakshak:** Most hackathon projects generate generic AI chat responses or show static data tables. Rakshak provides an active **Financial Defense Firewall** that links isolated messages into a systemic **Scam DNA Knowledge Graph** while delivering immediate legal protections (SEBI SCORES + 1930 Helpline) in the citizen's native language.

---

## 20. Competitive Advantage

| Feature / Dimension | Traditional Anti-Spam (Truecaller) | Static Govt Portals (SEBI/RBI) | Generic AI Chat (ChatGPT) | **RAKSHAK (Our Solution)** |
| :--- | :--- | :--- | :--- | :--- |
| **Ingestion Type** | Phone numbers only | Manual registration search | Unstructured text | **Omni-modal (Text, OCR, QR, Voice)** |
| **Regulatory Validation** | None | Raw tabular database | Often hallucinates regulations | **Deterministic Statutory SEBI Query** |
| **Escrow Bypass Detection** | No | No | No | **Yes (Flags Corporate/UPI Mismatch)** |
| **Syndicate DNA Graph** | Closed crowd tags | No cross-case linking | No persistent graph | **3D Scam Knowledge Graph Linkage** |
| **Citizen Usability** | Caller ID only | Complex legal language | Verbose text paragraphs | **Digital Trust Passport™ + Voice Readout** |
| **Direct Emergency Action**| None | Manual complaint filing | Generic advice | **One-Tap 1930 Hotline Integration** |

---

## 21. Social & Economic Impact
* **Capital Protection:** Directly halts unrecoverable peer-to-peer transfers before execution.
* **Democratization of Security:** Gives first-time rural investors the same institutional verification capabilities as major brokerage compliance departments.
* **Law Enforcement Multiplier:** Groups fragmented citizen reports into high-conviction criminal syndicates with shared mule account chains.

---

## 22. Business & Real-World Deployments
* **Direct-to-Consumer Platform:** Free web and WhatsApp bot service for retail investors.
* **Fintech & Broker Integration:** Embedded verification widget inside Zerodha, Groww, and AngelOne communities.
* **UPI Pre-Payment Gateway Plugin:** Safety validation API for payment service providers (BHIM, PhonePe, Google Pay).
* **Law Enforcement Dashboard:** Intelligence feed for state police cyber cells and I4C.

---

## 23. Security, Privacy & Responsible AI
* **Zero Credential Collection:** Rakshak strictly prohibits collecting OTPs, passwords, bank account numbers, or PINs.
* **Client-Side Data Sanitization:** Local scrubbing of incidental citizen identifiers before query execution.
* **Cryptographic Immutability:** SHA-256 fingerprinting ensures tamper-proof chain of custody for evidence presented to authorities.

---

## 24. Scalability Architecture
* **Stateless Microservices:** FastAPI backend nodes scale horizontally behind load balancers.
* **Fast In-Memory Graph Traversals:** Read-heavy graph operations cached via Redis / In-memory structures, delivering sub-50ms responses for millions of daily queries.

---

## 25. Challenges & Mitigation Strategies

| Challenge | Risk | Engineering Mitigation |
| :--- | :--- | :--- |
| **OCR Obfuscation** | Scammers distort images or use stylized fonts. | Pre-processing image thresholding + multi-scale contrast normalization. |
| **Hallucination Risk** | LLM falsely approves an unregistered entity. | Strict deterministic separation: LLM only formats explanations; regulatory registry validation is strictly deterministic code. |
| **Evolving Syndicate Tactics** | Scammers frequently discard and rotate UPI IDs. | Track E correlates phone prefixes, domain registrars, and behavioral text patterns, not just UPIs. |

---

## 26. Technical & Practical Feasibility
The entire core architecture is implemented, tested, and running locally. The backend communicates via high-speed REST endpoints, the frontend bundle compiles with zero build errors (`vite build`), and both Track A regulatory databases and Track E graph models are fully operational.

---

## 27. Future Scope
* Automated browser extension scanning investment groups across WhatsApp Web and Telegram Desktop in real time.
* Direct integration with Indian telecom carriers for network-level SMS link neutralization.

---

## 28. Hackathon Winning Criteria Matrix

| Judge Evaluation Criteria | How RAKSHAK Wins |
| :--- | :--- |
| **Innovation & Originality** | Introduces the Scam DNA Graph to solve fraud structurally rather than treating symptoms. |
| **Technical Depth** | Combines Three.js WebGL, graph traversal algorithms, OCR pipelines, and FastAPI async microservices. |
| **Practical Impact** | Protects citizen savings across 8 Indian languages and bridges directly into the 1930 Cyber Helpline. |
| **UI/UX Craftsmanship** | Features an ultra-premium, high-visibility Light Fintech theme with an interactive 3D defense core. |
| **Demo Feasibility** | Live, functional application with pre-configured, realistic test cases ready for immediate verification. |

---

## 29. 3–5 Minute Live Demo Execution Plan

* **0:00 – 0:45 | The Problem:** Show a fraudulent Telegram investment message claiming to be "SEBI-approved" while demanding a ₹10,000 transfer to a personal UPI address.
* **0:45 – 1:30 | Live Ingestion & Threat Sensors:** Paste the message into Rakshak. Point out the Live Threat Sensor immediately highlighting the personal UPI handle and urgency trigger.
* **1:30 – 2:30 | The Trust Passport Verdict:** Click "Check Message Now". The 6-step radar animation finishes and reveals the red **STOP — HIGH RISK SCAM** Trust Passport. Click the **"🔊 Listen (आवाज़ में सुनें)"** button to demonstrate voice readout in Hindi.
* **2:30 – 3:30 | 3D Scam DNA Graph:** Switch to the 3D Network tab. Orbit and zoom through the network to show how the scammer's UPI handle connects directly to 3 other historical fraud complaints.
* **3:30 – 4:00 | Dual Case Comparator & 1930 Integration:** Demonstrate the side-by-side comparator showing shared syndicate infrastructure, then point out the one-tap 1930 Helpline dialer.

---

## 30. Recommended 12-Slide Pitch Deck Structure

| Slide # | Slide Title | Visual / Diagram | Key Presentation Takeaway |
| :---: | :--- | :--- | :--- |
| **1** | **Title Slide: RAKSHAK** | Rakshak Logo + 3D Holographic Shield | AI Financial Firewall & Scam DNA Engine for Bharat. |
| **2** | **The Crisis: Capital Market Fraud** | Infographic on ₹1.2 Lakh Cr cyber fraud | Retail investors are deceived into authorizing fraudulent transfers. |
| **3** | **The Verification Chasm** | Diagram comparing isolated databases vs users | Regulatory data is disconnected from user messaging apps. |
| **4** | **Introducing Rakshak** | Platform screenshot with light fintech UI | An active firewall intercepting fraud before capital leaves accounts. |
| **5** | **The Core Architecture** | Full End-to-End Pipeline Diagram | Seamless multi-modal ingestion, statutory checks, and graph synthesis. |
| **6** | **Track A: Statutory Enforcement** | SEBI database cross-examination split-screen | Deterministic registry checks + Personal UPI Escrow Bypass detection. |
| **7** | **Track E: The Scam DNA Graph** | 3D Graph visualization with syndicate nodes | Fingerprints shared infrastructure across thousands of complaints. |
| **8** | **Digital Trust Passport™** | Screenshot of Passport Verdict card | Replaces confusing metrics with clear legal actions (Do Not Pay, 1930). |
| **9** | **Inclusion & Voice Readout** | 8 regional language flags + audio waveform | High-accessibility audio readouts for citizens across tier-2/tier-3 cities. |
| **10** | **Live Prototype Demo** | Live Screen Recording / Real-time app window | Live validation of fraudulent, legitimate, and ambiguous scenarios. |
| **11** | **National Scale & Law Enforcement** | Deployment map (WhatsApp Bot, UPI SDK, I4C)| Turn crowdsourced reports into syndicate takedown intelligence. |
| **12** | **Conclusion & Vision** | Team slide with contact details & 1930 badge | Protecting every Indian citizen's hard-earned savings before they click Send. |

---

## 31. Complete Verbatim Presentation Script

#### Slide 1: Introduction (0:00 – 0:25)
> *"Respected judges, over the last three years, more than 160 million Indians entered the financial markets. But as digital investments boomed, so did digital crime. Today, we present **RAKSHAK**, India's first AI-powered Cyber Financial Defense Engine and Scam DNA Knowledge Graph. Our mission is simple: Before you trust it, Rakshak checks it."*

#### Slide 2: The Problem (0:25 – 0:50)
> *"Consider how modern financial fraud occurs. It does not begin with a hacked account; it begins with an ordinary WhatsApp forward or Telegram tip offering guaranteed returns. Fraudsters impersonate registered SEBI research analysts and provide fake certificates. Crucially, they ask victims to deposit money into personal mule UPI accounts, completely bypassing legitimate broker escrow mechanisms."*

#### Slide 3: The Gap (0:50 – 1:15)
> *"Why do victims fall for this? Because checking SEBI registration requires manually navigating complex regulatory portals, which is unrealistic in high-pressure situations. Furthermore, existing spam apps only check phone numbers; they cannot analyze screenshots, understand investment claims, or trace shared syndicate accounts."*

#### Slide 4: Our Solution — Rakshak (1:15 – 1:40)
> *"Rakshak bridges this gap. It acts as an intelligent financial firewall. A citizen can paste a forwarded message, upload a screenshot, or speak in their native language. Rakshak combines **Track A's statutory verification** with **Track E's Scam DNA graph intelligence** to issue a clear, cryptographic **Digital Trust Passport**."*

#### Slide 5: System Architecture (1:40 – 2:05)
> *"Under the hood, Rakshak runs an asynchronous FastAPI gateway. When content arrives, it passes through our multi-modal OCR and regex NER pipeline to extract UPI addresses, telephone numbers, and regulatory IDs. These entities are simultaneously cross-referenced against our local SEBI statutory registry and our Scam DNA graph engine."*

#### Slide 6: Track A — Statutory Validation (2:05 – 2:30)
> *"Track A provides deterministic regulatory auditing. When an investment proposal claims registration number INH000FAKE1, Rakshak checks the official registry. It immediately flags unregistered entities and detects 'Escrow Bypass'—alerting the user whenever an entity claiming corporate status asks for funds via a personal P2P UPI handle."*

#### Slide 7: Track E — Scam DNA Graph (2:30 – 3:00)
> *"Track E provides network intelligence. Fraudsters continually change message scripts, but they reuse underlying infrastructure—mule accounts, phone numbers, and Telegram channels. Our graph database links these entities together. Even if a scammer creates a brand-new marketing pitch, the moment they provide a previously flagged UPI address, Rakshak links them to existing cybercrime syndicates."*

#### Slide 8: The Digital Trust Passport™ (3:00 – 3:25)
> *"Rather than confusing the user with raw risk numbers, Rakshak issues the Digital Trust Passport. It provides an unmistakable verdict—STOP: HIGH RISK SCAM—and details four forensic checks: SEBI status, payment destination, pressure tactics, and crime records. It also provides three immediate actions, including a one-tap dialer for the national 1930 Cybercrime Helpline."*

#### Slide 9: Accessibility for Bharat (3:25 – 3:45)
> *"Security must be accessible to every citizen. Rakshak supports eight Indian regional languages, complete with voice dictation and high-clarity speech synthesis readouts. If a user cannot read English, Rakshak speaks the verdict aloud in Hindi, Marathi, Telugu, or Tamil."*

#### Slide 10: Live Working Prototype (3:45 – 4:20)
> *"Our working prototype is live. Here you see our primary scanner. As we enter a Telegram scam message, our live threat sensors flag the personal UPI handle and urgency tactics in real time. We click 'Check Message Now', our six-stage inspection pipeline executes, and within milliseconds, the Trust Passport appears alongside our interactive 3D Scam Network."*

#### Slide 11: Scalability & National Impact (4:20 – 4:45)
> *"Rakshak is architected to scale. Our stateless microservices can power a public WhatsApp verification bot, embed into banking apps as a pre-payment UPI security plugin, and deliver structured syndicate intelligence directly to law enforcement via the 1930 portal."*

#### Slide 12: Conclusion & Q&A (4:45 – 5:00)
> *"Every rupee stolen by financial fraudsters represents years of honest labor. Rakshak delivers the intelligence and institutional defense needed to protect citizen capital before a transfer occurs. Thank you, and we welcome your questions."*
