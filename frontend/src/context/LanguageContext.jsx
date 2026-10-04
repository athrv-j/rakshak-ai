import React, { createContext, useContext, useState, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', region: 'Pan-India' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', region: 'North / Central' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🚩', region: 'West (Maharashtra)' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🏛️', region: 'South (AP & Telangana)' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🌊', region: 'South (Tamil Nadu)' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🦁', region: 'West (Gujarat)' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🌾', region: 'North (Punjab)' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🐅', region: 'East / North-East' },
]

export const TRANSLATIONS = {
  en: {
    // Nav
    brand_sub: 'AI Financial Firewall',
    nav_home: 'Home',
    nav_check: 'Check',
    nav_graph: 'Scam DNA',
    nav_check_btn: 'Check Now',
    
    // Home
    hero_badge: '🛡️ SANGYAN 2026 · AI Financial Firewall for Bharat',
    hero_title_1: 'Stop Financial Scams',
    hero_title_2: 'Before You Transfer.',
    hero_desc: 'Rakshak scans WhatsApp messages, Telegram links, and fake trading apps. Uncover forged SEBI certificates and track criminal syndicate networks before losing your savings.',
    hero_cta_check: 'Check a Suspicious Message',
    hero_cta_demo: 'Try Demo Scam',
    hero_cta_graph: 'Explore Scam DNA',
    
    stats_cases: 'Cases Analysed',
    stats_scams: 'Scams Detected',
    stats_reports: 'Community Reports',
    stats_langs: 'Regional Languages',
    
    // Analyze
    analyze_title: 'Financial Scam Firewall',
    analyze_sub: 'Paste any WhatsApp message, Telegram tip, or upload a screenshot to generate your Trust Passport.',
    tab_text: 'Paste Text / SMS',
    tab_image: 'Upload Screenshot',
    placeholder_text: 'Paste suspicious message, WhatsApp forward, Telegram tip, or payment request here...',
    btn_listening: 'Listening… speak now',
    btn_voice: 'Voice Input (Speak)',
    drop_title: 'Drop screenshot here, or browse',
    drop_sub: 'Supports PNG, JPG, WEBP (WhatsApp, Telegram, or App screenshots)',
    flag_label: 'Did you spot any red flags yourself? (Optional - tests your Risk IQ)',
    flag_placeholder: 'e.g. Guaranteed 200% return, personal UPI handle...',
    btn_add_flag: 'Add Flag',
    btn_scan_now: 'Scan & Verify with Rakshak',
    analyzing_title: 'Analyzing with AI & SEBI Registry…',
    
    // Trust Passport
    tp_title: 'Rakshak Trust Passport',
    tp_assessment: 'RISK ASSESSMENT',
    tp_identity_check: 'Identity & SEBI Registry Check',
    tp_extracted_entities: 'Extracted Identifiers & IOCs',
    tp_red_flags: 'Red Flags Detected',
    tp_claims: 'Deceptive Claims Analysis',
    tp_related_cases: 'Related Cases Linked in Scam DNA',
    tp_safe_steps: 'Safe Next Steps (What to do now)',
    tp_verify_sebi: 'Verify on Official SEBI Registry',
    tp_report_cyber: 'Report to Cybercrime.gov.in',
    tp_copy_link: 'Copy Report Link',
    tp_copied: 'Link Copied!',
    tp_share_wa: 'Share on WhatsApp',
    tp_risk_iq: 'Your Investor Risk IQ',
    tp_scam_dna: 'Scam DNA Ecosystem Graph',
    
    // Labels
    risk_high: '⚠️ HIGH RISK DETECTED',
    risk_medium: '⚡ SUSPICIOUS / PROCEED WITH CAUTION',
    risk_low: '✅ VERIFIED SAFE COMMUNICATION',
    risk_unknown: '❓ UNKNOWN RISK',
    
    status_verified: 'Verified Official',
    status_unverified: 'Needs Verification',
    status_suspicious: 'SUSPICIOUS',
    status_not_found: 'NOT REGISTERED ON SEBI',
    status_mismatch: 'IDENTITY / ESCROW MISMATCH',
    status_guaranteed: 'GUARANTEED ROI (Illegal)',
    status_linked: 'LINKED TO KNOWN SCAM SYNDICATE',
    status_not_applicable: 'Not Applicable',
  },
  hi: {
    // Nav
    brand_sub: 'एआई वित्तीय सुरक्षा कवच',
    nav_home: 'होम',
    nav_check: 'जांचें',
    nav_graph: 'स्कैम डीएनए',
    nav_check_btn: 'अभी जांचें',
    
    // Home
    hero_badge: '🛡️ संज्ञान 2026 · भारत का एआई वित्तीय सुरक्षा कवच',
    hero_title_1: 'पैसे ट्रांसफर करने से पहले',
    hero_title_2: 'वित्तीय धोखाधड़ी को रोकें।',
    hero_desc: 'रक्षक व्हाट्सएप संदेशों, टेलीग्राम लिंक्स और फर्जी ट्रेडिंग ऐप्स की जांच करता है। अपनी जीवन भर की जमा पूंजी गंवाने से पहले नकली सेबी प्रमाणपत्रों और आपराधिक नेटवर्क को उजागर करें।',
    hero_cta_check: 'संदिग्ध संदेश की जांच करें',
    hero_cta_demo: 'डेमो संदेश जांचें',
    hero_cta_graph: 'स्कैम डीएनए नेटवर्क देखें',
    
    stats_cases: 'विश्लेषित मामले',
    stats_scams: 'पकड़े गए फ्रॉड',
    stats_reports: 'सामुदायिक रिपोर्ट्स',
    stats_langs: 'क्षेत्रीय भाषाएं',
    
    // Analyze
    analyze_title: 'वित्तीय धोखाधड़ी सुरक्षा जांच',
    analyze_sub: 'ट्रस्ट पासपोर्ट बनाने के लिए कोई भी व्हाट्सएप संदेश, टेलीग्राम टिप चिपकाएं या स्क्रीनशॉट अपलोड करें।',
    tab_text: 'संदेश / टेक्स्ट दर्ज करें',
    tab_image: 'स्क्रीनशॉट अपलोड करें',
    placeholder_text: 'यहाँ संदिग्ध संदेश, व्हाट्सएप फॉरवर्ड, टेलीग्राम टिप या यूपीआई पेमेंट लिंक पेस्ट करें...',
    btn_listening: 'सुन रहे हैं... कृपया बोलें',
    btn_voice: 'बोलकर इनपुट दें (आवाज)',
    drop_title: 'स्क्रीनशॉट यहाँ छोड़ें या फाइल चुनें',
    drop_sub: 'PNG, JPG, WEBP समर्थित (व्हाट्सएप, टेलीग्राम या ट्रेडिंग ऐप स्क्रीनशॉट)',
    flag_label: 'क्या आपने स्वयं कोई लाल झंडा (धोखा) पहचाना? (वैकल्पिक - आपका रिस्क आईक्यू टेस्ट)',
    flag_placeholder: 'जैसे: गारंटीड 200% रिटर्न, व्यक्तिगत यूपीआई...',
    btn_add_flag: 'जोड़ें',
    btn_scan_now: 'रक्षक से तुरंत जांचें और सत्यापित करें',
    analyzing_title: 'एआई और सेबी रजिस्ट्री से विश्लेषण जारी है…',
    
    // Trust Passport
    tp_title: 'रक्षक ट्रस्ट पासपोर्ट',
    tp_assessment: 'जोखिम मूल्यांकन',
    tp_identity_check: 'पहचान एवं सेबी पंजीकरण सत्यापन',
    tp_extracted_entities: 'पहचाने गए यूपीआई, फोन व लिंक्स',
    tp_red_flags: 'पाए गए खतरे और लाल झंडे',
    tp_claims: 'भ्रामक दावों का विश्लेषण',
    tp_related_cases: 'स्कैम डीएनए में जुड़े संबंधित मामले',
    tp_safe_steps: 'सुरक्षित अगले कदम (अब क्या करें)',
    tp_verify_sebi: 'आधिकारिक सेबी पोर्टल पर जांचें',
    tp_report_cyber: 'साइबर अपराध 1930 पर रिपोर्ट करें',
    tp_copy_link: 'रिपोर्ट लिंक कॉपी करें',
    tp_copied: 'लिंक कॉपी हो गया!',
    tp_share_wa: 'व्हाट्सएप पर परिवार को भेजें',
    tp_risk_iq: 'आपका निवेशक रिस्क आईक्यू',
    tp_scam_dna: 'स्कैम डीएनए क्रिमिनल नेटवर्क ग्राफ',
    
    // Labels
    risk_high: '⚠️ उच्च जोखिम (सावधान - फ्रॉड का खतरा)',
    risk_medium: '⚡ संदिग्ध संदेश / सावधानी से आगे बढ़ें',
    risk_low: '✅ सत्यापित एवं सुरक्षित संचार',
    risk_unknown: '❓ अज्ञात स्थिति',
    
    status_verified: 'सत्यापित आधिकारिक',
    status_unverified: 'सत्यापन आवश्यक',
    status_suspicious: 'अत्यधिक संदिग्ध',
    status_not_found: 'सेबी पर पंजीकृत नहीं है',
    status_mismatch: 'पहचान / बैंक खाता बेमेल (दुरुपयोग)',
    status_guaranteed: 'गारंटीड रिटर्न (सेबी नियमों में अवैध)',
    status_linked: 'ज्ञात ठग सिंडिकेट से जुड़ा हुआ',
    status_not_applicable: 'लागू नहीं',
  },
  mr: {
    // Nav
    brand_sub: 'एआय आर्थिक सुरक्षा कवच',
    nav_home: 'मुख्यपृष्ठ',
    nav_check: 'तपासा',
    nav_graph: 'स्कॅम डीएनए',
    nav_check_btn: 'आता तपासा',
    
    // Home
    hero_badge: '🛡️ संज्ञान 2026 · महाराष्ट्रासाठी एआय आर्थिक सुरक्षा ढाल',
    hero_title_1: 'पैसे पाठवण्यापूर्वी',
    hero_title_2: 'आर्थिक फसवणूक ओळखा आणि थांबवा.',
    hero_desc: 'रक्षक व्हॉट्सॲप मेसेज, टेलिग्राम ग्रुप्स आणि खोट्या ट्रेडिंग ॲप्सची सत्यता तपासतो. आयुष्यभराची पुंजी गमावण्याआधी बनावट सेबी प्रमाणपत्रे आणि फसवणूक करणाऱ्या टोळ्या उघड करा.',
    hero_cta_check: 'संशयास्पद मेसेज तपासा',
    hero_cta_demo: 'डेमो मेसेज पाहा',
    hero_cta_graph: 'स्कॅम डीएनए नेटवर्क पाहा',
    
    stats_cases: 'तपासलेली प्रकरणे',
    stats_scams: 'उघड झालेले स्कॅम्स',
    stats_reports: 'नागरिकांचे अहवाल',
    stats_langs: 'प्रादेशिक भाषा',
    
    // Analyze
    analyze_title: 'आर्थिक घोटाळा सुरक्षा तपासणी',
    analyze_sub: 'ट्रस्ट पासपोर्ट मिळवण्यासाठी संशयास्पद व्हॉट्सॲप संदेश किंवा स्क्रीनशॉट टाका.',
    tab_text: 'संदेश टाईप करा',
    tab_image: 'स्क्रीनशॉट अपलोड करा',
    placeholder_text: 'इथे संशयास्पद मेसेज, व्हॉट्सॲप फॉरवर्ड किंवा टेलिग्राम टिप पेस्ट करा...',
    btn_listening: 'ऐकत आहे... बोला',
    btn_voice: 'व्हॉइस इनपुट (मराठीत बोला)',
    drop_title: 'स्क्रीनशॉट इथे टाका किंवा निवडा',
    drop_sub: 'PNG, JPG, WEBP फॉरमॅट (व्हॉट्सॲप, टेलिग्राम स्क्रीनशॉट)',
    flag_label: 'तुम्हाला काही संशयास्पद वाटले का? (पर्यायी - रिस्क आयक्यू)',
    flag_placeholder: 'उदा. गॅरंटीड परतावा, वैयक्तिक यूपीआय...',
    btn_add_flag: 'जोडा',
    btn_scan_now: 'रक्षकद्वारे पडताळणी करा',
    analyzing_title: 'एआय आणि सेबी नोंदणी तपासणी सुरू आहे…',
    
    // Trust Passport
    tp_title: 'रक्षक ट्रस्ट पासपोर्ट',
    tp_assessment: 'धोका मूल्यांकन',
    tp_identity_check: 'ओळख आणि सेबी नोंदणी पडताळणी',
    tp_extracted_entities: 'शोधलेले यूपीआय, फोन व वेब लिंक्स',
    tp_red_flags: 'आढळलेले धोके (Red Flags)',
    tp_claims: 'खोट्या दाव्यांचे विश्लेषण',
    tp_related_cases: 'स्कॅम डीएनए मधील संबंधित गुन्हे',
    tp_safe_steps: 'सुरक्षित राहण्यासाठी पुढील पावले',
    tp_verify_sebi: 'अधिकृत सेबी संकेतस्थळावर तपासा',
    tp_report_cyber: 'सायबर सेल 1930 वर तक्रार करा',
    tp_copy_link: 'अहवाल लिंक कॉपी करा',
    tp_copied: 'लिंक कॉपी झाली!',
    tp_share_wa: 'व्हॉट्सॲपवर कुटुंबाला पाठवा',
    tp_risk_iq: 'तुमचा गुंतवणूक रिस्क आयक्यू',
    tp_scam_dna: 'स्कॅम डीएनए गुन्हेगारी जाळे',
    
    // Labels
    risk_high: '⚠️ उच्च धोका (फसवणुकीची दाट शक्यता)',
    risk_medium: '⚡ संशयास्पद संदेश / सावधगिरी बाळगा',
    risk_low: '✅ अधिकृत आणि सुरक्षित संदेश',
    risk_unknown: '❓ अज्ञात स्थिती',
    
    status_verified: 'अधिकृत नोंदणीकृत',
    status_unverified: 'पडताळणी बाकी',
    status_suspicious: 'संशयास्पद',
    status_not_found: 'सेबीकडे नोंदणी नाही',
    status_mismatch: 'नाव किंवा बँक खात्यात विसंगती',
    status_guaranteed: 'गॅरंटीड परतावा (कायद्यानुसार बेकायदेशीर)',
    status_linked: 'गुन्हेगारी टोळीशी संबंध आढळला',
    status_not_applicable: 'लागू नाही',
  },
  te: {
    // Nav
    brand_sub: 'AI ఆర్థిక రక్షణ కవచం',
    nav_home: 'హోమ్',
    nav_check: 'పరిశీలించండి',
    nav_graph: 'స్కామ్ DNA',
    nav_check_btn: 'ఇప్పుడే తనిఖీ చేయండి',
    
    // Home
    hero_badge: '🛡️ సంజ్ఞాన్ 2026 · భారతీయ మదుపరులకు AI రక్షణ కవచం',
    hero_title_1: 'డబ్బు పంపే ముందే',
    hero_title_2: 'ఆర్థిక మోసాలను అడ్డుకోండి.',
    hero_desc: 'వాట్సాప్ సందేశాలు, టెలిగ్రామ్ లింకులు మరియు నకిలీ ట్రేడింగ్ యాప్‌ల నిజానిజాలను రక్షక్ గుర్తిస్తుంది. మీ కష్టార్జితాన్ని కోల్పోకముందే నకిలీ సెబీ సర్టిఫికెట్లను బట్టబయలు చేయండి.',
    hero_cta_check: 'అనుమానాస్పద సందేశాన్ని తనిఖీ చేయండి',
    hero_cta_demo: 'డెమో పరిశీలించండి',
    hero_cta_graph: 'స్కామ్ DNA నెట్‌వర్క్ చూడండి',
    
    stats_cases: 'విశ్లేషించిన కేసులు',
    stats_scams: 'గుర్తించిన స్కామ్‌లు',
    stats_reports: 'ప్రజల నివేదికలు',
    stats_langs: 'ప్రాంతీయ భాషలు',
    
    // Analyze
    analyze_title: 'ఆర్థిక స్కామ్ సెక్యూరిటీ స్కానర్',
    analyze_sub: 'ట్రస్ట్ పాస్‌పోర్ట్ పొందడానికి వాట్సాప్ సందేశం లేదా స్క్రీన్‌షాట్‌ను ఇక్కడ ఉంచండి.',
    tab_text: 'టెక్స్ట్ ఎంటర్ చేయండి',
    tab_image: 'స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి',
    placeholder_text: 'అనుమానాస్పద సందేశం, వాట్సాప్ ఫార్వర్డ్ లేదా టెలిగ్రామ్ లింక్‌ను ఇక్కడ పేస్ట్ చేయండి...',
    btn_listening: 'వింటున్నాము... మాట్లాడండి',
    btn_voice: 'వాయిస్ ఇన్‌పుట్ (తెలుగులో మాట్లాడండి)',
    drop_title: 'స్క్రీన్‌షాట్ ఇక్కడ వేయండి లేదా ఎంచుకోండి',
    drop_sub: 'PNG, JPG, WEBP సపోర్ట్ చేస్తుంది',
    flag_label: 'మీరు ఏమైనా అనుమానాలను గమనించారా? (ఆప్షనల్ - రిస్క్ IQ)',
    flag_placeholder: 'ఉదాహరణ: గ్యారెంటీడ్ 200% లాభం, వ్యక్తిగత UPI...',
    btn_add_flag: 'జతచేయి',
    btn_scan_now: 'రక్షక్ ద్వారా తనిఖీ చేయండి',
    analyzing_title: 'AI మరియు సెబీ రిజిస్ట్రీతో తనిఖీ జరుగుతోంది…',
    
    // Trust Passport
    tp_title: 'రక్షక్ ట్రస్ట్ పాస్‌పోర్ట్',
    tp_assessment: 'రిస్క్ విశ్లేషణ',
    tp_identity_check: 'గుర్తింపు & సెబీ రిజిస్ట్రేషన్ నిర్ధారణ',
    tp_extracted_entities: 'గుర్తించిన UPI, ఫోన్ నంబర్లు',
    tp_red_flags: 'గుర్తించిన ప్రమాద హెచ్చరికలు (Red Flags)',
    tp_claims: 'తప్పుడు వాగ్దానాల విశ్లేషణ',
    tp_related_cases: 'స్కామ్ DNA లో లింక్ అయిన కేసులు',
    tp_safe_steps: 'సురక్షిత తదుపరి చర్యలు (ఇప్పుడు ఏం చేయాలి)',
    tp_verify_sebi: 'అధికారిక సెబీ పోర్టల్‌లో ధృవీకరించండి',
    tp_report_cyber: 'సైబర్ క్రైమ్ 1930 కు ఫిర్యాదు చేయండి',
    tp_copy_link: 'లింక్ కాపీ చేయండి',
    tp_copied: 'కాపీ చేయబడింది!',
    tp_share_wa: 'వాట్సాప్‌లో కుటుంబంతో పంచుకోండి',
    tp_risk_iq: 'మీ ఇన్వెస్టర్ రిస్క్ IQ',
    tp_scam_dna: 'స్కామ్ DNA నెట్‌వర్క్ గ్రాఫ్',
    
    // Labels
    risk_high: '⚠️ తీవ్రమైన ప్రమాదం (మోసం జరిగే అవకాశం ఉంది)',
    risk_medium: '⚡ అనుమానాస్పద సందేశం / జాగ్రత్తగా ఉండండి',
    risk_low: '✅ ధృవీకరించబడిన సురక్షిత సందేశం',
    risk_unknown: '❓ తెలియని స్థితి',
    
    status_verified: 'అధికారికంగా ధృవీకరించబడింది',
    status_unverified: 'ధృవీకరణ అవసరం',
    status_suspicious: 'అనుమానాస్పదం',
    status_not_found: 'సెబీ లో నమోదు కాలేదు',
    status_mismatch: 'పేరు లేదా ఖాతా తేడాలున్నాయి',
    status_guaranteed: 'గ్యారెంటీడ్ లాభాలు (చట్టవిరుద్ధం)',
    status_linked: 'తెలిసిన మోసగాళ్ల ముఠాతో సంబంధం ఉంది',
    status_not_applicable: 'వర్తించదు',
  },
  ta: {
    // Nav
    brand_sub: 'AI நிதி பாதுகாப்பு கவசம்',
    nav_home: 'முகப்பு',
    nav_check: 'சரிபார்க்கவும்',
    nav_graph: 'ஸ்கேம் டிஎன்ஏ',
    nav_check_btn: 'இப்போதே சரிபார்க்கவும்',
    
    // Home
    hero_badge: '🛡️ சஞ்யான் 2026 · இந்திய முதலீட்டாளர்களுக்கான AI பாதுகாப்பு கவசம்',
    hero_title_1: 'பணம் மாற்றும் முன்',
    hero_title_2: 'நிதி மோசடிகளை தடுத்து நிறுத்துங்கள்.',
    hero_desc: 'வாட்ஸ்அப் செய்திகள், டெலிகிராம் இணைப்புகள் மற்றும் போலி வர்த்தக செயலிகளை ரக்ஷக் ஆராய்கிறது. உங்கள் பணத்தை இழக்கும் முன் போலி செபி சான்றிதழ்களை கண்டறியுங்கள்.',
    hero_cta_check: 'சந்தேகத்திற்கிடமான செய்தியை சோதிக்கவும்',
    hero_cta_demo: 'மாதிரி செய்தியை காண்க',
    hero_cta_graph: 'ஸ்கேம் டிஎன்ஏ வலையமைப்பை காண்க',
    
    stats_cases: 'ஆய்வு செய்யப்பட்டவை',
    stats_scams: 'கண்டறியப்பட்ட மோசடிகள்',
    stats_reports: 'மக்கள் புகார்கள்',
    stats_langs: 'பிராந்திய மொழிகள்',
    
    // Analyze
    analyze_title: 'நிதி மோசடி தடுப்பு சோதனை',
    analyze_sub: 'டிரஸ்ட் பாஸ்போர்ட் பெற வாட்ஸ்அப் செய்தி அல்லது ஸ்கிரீன்ஷாட்டை பதிவேற்றவும்.',
    tab_text: 'செய்தி தட்டச்சு செய்யவும்',
    tab_image: 'ஸ்கிரீன்ஷாட் பதிவேற்றவும்',
    placeholder_text: 'சந்தேகத்திற்கிடமான வாட்ஸ்அப் செய்தி அல்லது முதலீட்டு ஆலோசனையை இங்கே ஒட்டவும்...',
    btn_listening: 'கேட்கிறது... பேசுங்கள்',
    btn_voice: 'குரல் உள்ளீடு (தமிழில் பேசுங்கள்)',
    drop_title: 'ஸ்கிரீன்ஷாட்டை இங்கே போடவும் அல்லது தேர்ந்தெடுக்கவும்',
    drop_sub: 'PNG, JPG, WEBP ஆதரவு உண்டு',
    flag_label: 'ஏதேனும் ஆபத்து அறிகுறிகளை கண்டறிந்தீர்களா? (விருப்பத்திற்குரியது)',
    flag_placeholder: 'உதாரணம்: 200% உறுதி அளிக்கப்பட்ட லாபம், தனிநபர் UPI...',
    btn_add_flag: 'சேர்',
    btn_scan_now: 'ரக்ஷக் மூலம் உடனடியாக சரிபார்க்கவும்',
    analyzing_title: 'AI மற்றும் செபி பதிவேட்டில் சரிபார்க்கப்படுகிறது…',
    
    // Trust Passport
    tp_title: 'ரக்ஷக் டிரஸ்ட் பாஸ்போர்ட்',
    tp_assessment: 'ஆபத்து மதிப்பீடு',
    tp_identity_check: 'அடையாளம் மற்றும் செபி பதிவு சரிபார்ப்பு',
    tp_extracted_entities: 'கண்டறியப்பட்ட UPI மற்றும் எண்கள்',
    tp_red_flags: 'கண்டறியப்பட்ட எச்சரிக்கைகள் (Red Flags)',
    tp_claims: 'போலி வாக்குறுதிகள் பற்றிய ஆய்வு',
    tp_related_cases: 'ஸ்கேம் டிஎன்ஏ-வில் தொடர்புடைய வழக்குகள்',
    tp_safe_steps: 'பாதுகாப்பான அடுத்த நடவடிக்கைகள்',
    tp_verify_sebi: 'அதிகாரப்பூர்வ செபி தளத்தில் சரிபார்க்கவும்',
    tp_report_cyber: 'சைபர் கிரைம் 1930 இல் புகார் அளிக்கவும்',
    tp_copy_link: 'இணைப்பை நகலெடுக்கவும்',
    tp_copied: 'நகலெடுக்கப்பட்டது!',
    tp_share_wa: 'வாட்ஸ்அப்பில் குடும்பத்துடன் பகிரவும்',
    tp_risk_iq: 'உங்கள் முதலீட்டாளர் ரிஸ்க் IQ',
    tp_scam_dna: 'ஸ்கேம் டிஎன்ஏ வரைபடம்',
    
    // Labels
    risk_high: '⚠️ அதிக ஆபத்து (மோசடி எச்சரிக்கை)',
    risk_medium: '⚡ சந்தேகத்திற்குரிய செய்தி / எச்சரிக்கையுடன் செயல்படவும்',
    risk_low: '✅ பாதுகாப்பான பதிவுபெற்ற தகவல்',
    risk_unknown: '❓ தெரியாத நிலை',
    
    status_verified: 'அங்கீகரிக்கப்பட்டது',
    status_unverified: 'சரிபார்ப்பு தேவை',
    status_suspicious: 'சந்தேகத்திற்குரியது',
    status_not_found: 'செபியில் பதிவு செய்யப்படவில்லை',
    status_mismatch: 'பெயர் அல்லது வங்கி கணக்கில் முரண்பாடு',
    status_guaranteed: 'உறுதி அளிக்கப்பட்ட லாபம் (சட்டவிரோதம்)',
    status_linked: 'மோசடி கும்பலுடன் தொடர்பு உள்ளது',
    status_not_applicable: 'பொருந்தாது',
  },
  gu: {
    // Nav
    brand_sub: 'AI નાણાકીય સુરક્ષા કવચ',
    nav_home: 'મુખ્ય પૃષ્ઠ',
    nav_check: 'તપાસો',
    nav_graph: 'સ્કેમ DNA',
    nav_check_btn: 'હમણાં તપાસો',
    
    // Home
    hero_badge: '🛡️ સંજ્ઞાન 2026 · રોકાણકારો માટે AI સુરક્ષા કવચ',
    hero_title_1: 'પૈસા ટ્રાન્સફર કરતા પહેલા',
    hero_title_2: 'નાણાકીય છેતરપિંડી રોકો.',
    hero_desc: 'રક્ષક વ્હોટ્સએપ સંદેશાઓ, ટેલિગ્રામ લિંક્સ અને નકલી ટ્રેડિંગ એપ્સની તપાસ કરે છે. તમારી મૂડી ગુમાવતા પહેલા નકલી સેબી પ્રમાણપત્રો અને ગુનાહિત નેટવર્કને ઓળખો.',
    hero_cta_check: 'શંકાસ્પદ મેસેજ તપાસો',
    hero_cta_demo: 'ડેમો મેસેજ જુઓ',
    hero_cta_graph: 'સ્કેમ DNA નેટવર્ક જુઓ',
    
    stats_cases: 'તપાસેલા કેસ',
    stats_scams: 'પકડાયેલા સ્કેમ',
    stats_reports: 'નાગરિક રિપોર્ટ્સ',
    stats_langs: 'પ્રાદેશિક ભાષાઓ',
    
    // Analyze
    analyze_title: 'નાણાકીય છેતરપિંડી સુરક્ષા સ્કેનર',
    analyze_sub: 'ટ્રસ્ટ પાસપોર્ટ મેળવવા માટે વ્હોટ્સએપ સંદેશ અથવા સ્ક્રીનશૉટ અપલોડ કરો.',
    tab_text: 'મેસેજ પેસ્ટ કરો',
    tab_image: 'સ્ક્રીનશૉટ અપલોડ કરો',
    placeholder_text: 'અહીં શંકાસ્પદ મેસેજ અથવા ટેલિગ્રામ રોકાણ ટિપ્સ પેસ્ટ કરો...',
    btn_listening: 'સાંભળી રહ્યા છીએ... બોલો',
    btn_voice: 'વોઇસ ઇનપુટ (ગુજરાતીમાં બોલો)',
    drop_title: 'સ્ક્રીનશૉટ અહીં મૂકો અથવા પસંદ કરો',
    drop_sub: 'PNG, JPG, WEBP ફોર્મેટ સપોર્ટેડ',
    flag_label: 'તમને કોઈ શંકાસ્પદ સંકેત મળ્યો? (વૈકલ્પિક - રિસ્ક IQ)',
    flag_placeholder: 'દા.ત. 100% ગેરંટીડ રિટર્ન, પર્સનલ UPI...',
    btn_add_flag: 'ઉમેરો',
    btn_scan_now: 'રક્ષક દ્વારા ચકાસો',
    analyzing_title: 'AI અને સેબી રજિસ્ટ્રી સાથે ચકાસણી ચાલુ છે…',
    
    // Trust Passport
    tp_title: 'રક્ષક ટ્રસ્ટ પાસપોર્ટ',
    tp_assessment: 'જોખમ મૂલ્યાંકન',
    tp_identity_check: 'ઓળખ અને સેબી નોંધણી ચકાસણી',
    tp_extracted_entities: 'ઓળખાયેલા UPI અને ફોન નંબર્સ',
    tp_red_flags: 'શોધાયેલ જોખમો (Red Flags)',
    tp_claims: 'ભ્રામક દાવાઓનું વિશ્લેષણ',
    tp_related_cases: 'સ્કેમ DNA સાથે જોડાયેલા કેસ',
    tp_safe_steps: 'સુરક્ષિત રહેવાના પગલાં (હવે શું કરવું)',
    tp_verify_sebi: 'સત્તાવાર સેબી વેબસાઇટ પર ચકાસો',
    tp_report_cyber: 'સાયબર ક્રાઇમ 1930 પર ફરિયાદ કરો',
    tp_copy_link: 'લિંક કૉપિ કરો',
    tp_copied: 'કૉપિ થઈ ગયું!',
    tp_share_wa: 'વ્હોટ્સએપ પર પરિવારને મોકલો',
    tp_risk_iq: 'તમારો ઇન્વેસ્ટર રિસ્ક IQ',
    tp_scam_dna: 'સ્કેમ DNA ગુનાહિત નેટવર્ક ગ્રાફ',
    
    // Labels
    risk_high: '⚠️ ઊંચું જોખમ (છેતરપિંડીનો ભય)',
    risk_medium: '⚡ શંકાસ્પદ મેસેજ / સાવચેતી રાખો',
    risk_low: '✅ ચકાસાયેલ સત્તાવાર મેસેજ',
    risk_unknown: '❓ અજાણી સ્થિતિ',
    
    status_verified: 'સત્તાવાર ચકાસાયેલ',
    status_unverified: 'ચકાસણી જરૂરી',
    status_suspicious: 'શંકાસ્પદ',
    status_not_found: 'સેબીમાં નોંધણી નથી',
    status_mismatch: 'નામ કે બેંક ખાતામાં વિસંગતતા',
    status_guaranteed: 'ગેરંટીડ રિટર્ન (કાયદેસર ગેરકાયદેસર)',
    status_linked: 'જાણીતા સ્કેમ સિન્ડિકેટ સાથે જોડાયેલ',
    status_not_applicable: 'લાગુ પડતું નથી',
  },
  pa: {
    // Nav
    brand_sub: 'AI ਵਿੱਤੀ ਸੁਰੱਖਿਆ ਢਾਲ',
    nav_home: 'ਮੁੱਖ ਪੰਨਾ',
    nav_check: 'ਜਾਂਚ ਕਰੋ',
    nav_graph: 'ਸਕੈਮ DNA',
    nav_check_btn: 'ਹੁਣੇ ਜਾਂਚੋ',
    
    // Home
    hero_badge: '🛡️ ਸੰਗਿਆਨ 2026 · ਨਿਵੇਸ਼ਕਾਂ ਲਈ AI ਸੁਰੱਖਿਆ ਕਵਚ',
    hero_title_1: 'ਪੈਸੇ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ',
    hero_title_2: 'ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਰੋਕੋ।',
    hero_desc: 'ਰਕਸ਼ਕ ਵਟਸਐਪ ਸੰਦੇਸ਼ਾਂ, ਟੈਲੀਗ੍ਰਾਮ ਲਿੰਕਾਂ ਅਤੇ ਜਾਅਲੀ ਟ੍ਰੇਡਿੰਗ ਐਪਸ ਦੀ ਪੜਤਾਲ ਕਰਦਾ ਹੈ। ਆਪਣੀ ਕਮਾਈ ਗੁਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਅਲੀ ਸੇਬੀ ਸਰਟੀਫਿਕੇਟਾਂ ਨੂੰ ਬੇਨਕਾਬ ਕਰੋ।',
    hero_cta_check: 'ਸ਼ੱਕੀ ਸੁਨੇਹਾ ਜਾਂਚੋ',
    hero_cta_demo: 'ਡੈਮੋ ਵੇਖੋ',
    hero_cta_graph: 'ਸਕੈਮ DNA ਨੈੱਟਵਰਕ ਵੇਖੋ',
    
    stats_cases: 'ਜਾਂਚੇ ਗਏ ਕੇਸ',
    stats_scams: 'ਫੜੇ ਗਏ ਘਪਲੇ',
    stats_reports: 'ਜਨਤਕ ਰਿਪੋਰਟਾਂ',
    stats_langs: 'ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ',
    
    // Analyze
    analyze_title: 'ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ ਜਾਂਚ',
    analyze_sub: 'ਟਰੱਸਟ ਪਾਸਪੋਰਟ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕੋਈ ਵੀ ਵਟਸਐਪ ਸੁਨੇਹਾ ਜਾਂ ਸਕ੍ਰੀਨਸ਼ਾਟ ਇੱਥੇ ਪਾਓ।',
    tab_text: 'ਸੁਨੇਹਾ ਦਰਜ ਕਰੋ',
    tab_image: 'ਸਕ੍ਰੀਨਸ਼ਾਟ ਅੱਪਲੋਡ ਕਰੋ',
    placeholder_text: 'ਇੱਥੇ ਸ਼ੱਕੀ ਵਟਸਐਪ ਜਾਂ ਟੈਲੀਗ੍ਰਾਮ ਸੁਨੇਹਾ ਪੇਸਟ ਕਰੋ...',
    btn_listening: 'ਸੁਣ ਰਹੇ ਹਾਂ... ਬੋਲੋ ਜੀ',
    btn_voice: 'ਆਵਾਜ਼ ਇਨਪੁੱਟ (ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ)',
    drop_title: 'ਸਕ੍ਰੀਨਸ਼ਾਟ ਇੱਥੇ ਸੁੱਟੋ ਜਾਂ ਚੁਣੋ',
    drop_sub: 'PNG, JPG, WEBP ਸਹਾਇਕ',
    flag_label: 'ਕੀ ਤੁਸੀਂ ਕੋਈ ਖਤਰਾ ਪਛਾਣਿਆ? (ਵਿਕਲਪਿਕ)',
    flag_placeholder: 'ਜਿਵੇਂ: 100% ਗਾਰੰਟੀਸ਼ੁਦਾ ਮੁਨਾਫਾ, ਨਿੱਜੀ UPI...',
    btn_add_flag: 'ਸ਼ਾਮਲ ਕਰੋ',
    btn_scan_now: 'ਰਕਸ਼ਕ ਦੁਆਰਾ ਪੜਤਾਲ ਕਰੋ',
    analyzing_title: 'AI ਅਤੇ ਸੇਬੀ ਰਜਿਸਟਰੀ ਨਾਲ ਜਾਂਚ ਜਾਰੀ ਹੈ…',
    
    // Trust Passport
    tp_title: 'ਰਕਸ਼ਕ ਟਰੱਸਟ ਪਾਸਪੋਰਟ',
    tp_assessment: 'ਜੋਖਮ ਮੁਲਾਂਕਣ',
    tp_identity_check: 'ਪਛਾਣ ਅਤੇ ਸੇਬੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਜਾਂਚ',
    tp_extracted_entities: 'ਪਛਾਣੇ ਗਏ UPI ਅਤੇ ਫੋਨ ਨੰਬਰ',
    tp_red_flags: 'ਮਿਲੇ ਖਤਰੇ ਅਤੇ ਚੇਤਾਵਨੀਆਂ',
    tp_claims: 'ਝੂਠੇ ਦਾਅਵਿਆਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ',
    tp_related_cases: 'ਸਕੈਮ DNA ਵਿੱਚ ਜੁੜੇ ਸੰਬੰਧਿਤ ਕੇਸ',
    tp_safe_steps: 'ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਲਈ ਅਗਲੇ ਕਦਮ',
    tp_verify_sebi: 'ਅਧਿਕਾਰਤ ਸੇਬੀ ਪੋਰਟਲ ਤੇ ਜਾਂਚ ਕਰੋ',
    tp_report_cyber: 'ਸਾਈਬਰ ਕ੍ਰਾਈਮ 1930 ਤੇ ਰਿਪੋਰਟ ਕਰੋ',
    tp_copy_link: 'ਲਿੰਕ ਕਾਪੀ ਕਰੋ',
    tp_copied: 'ਕਾਪੀ ਹੋ ਗਿਆ!',
    tp_share_wa: 'ਵਟਸਐਪ ਤੇ ਪਰਿਵਾਰ ਨਾਲ ਸਾਂਝਾ ਕਰੋ',
    tp_risk_iq: 'ਤੁਹਾਡਾ ਰਿਸਕ IQ',
    tp_scam_dna: 'ਸਕੈਮ DNA ਗ੍ਰਾਫ',
    
    // Labels
    risk_high: '⚠️ ਉੱਚ ਜੋਖਮ (ਧੋਖਾਧੜੀ ਦਾ ਖ਼ਤਰਾ)',
    risk_medium: '⚡ ਸ਼ੱਕੀ ਸੁਨੇਹਾ / ਸਾਵਧਾਨ ਰਹੋ',
    risk_low: '✅ ਪ੍ਰਮਾਣਿਤ ਅਤੇ ਸੁਰੱਖਿਅਤ',
    risk_unknown: '❓ ਅਣਪਛਾਤੀ ਸਥਿਤੀ',
    
    status_verified: 'ਪ੍ਰਮਾਣਿਤ ਅਧਿਕਾਰਤ',
    status_unverified: 'ਜਾਂਚ ਦੀ ਲੋੜ ਹੈ',
    status_suspicious: 'ਸ਼ੱਕੀ',
    status_not_found: 'ਸੇਬੀ ਤੇ ਰਜਿਸਟਰਡ ਨਹੀਂ',
    status_mismatch: 'ਨਾਮ ਜਾਂ ਖਾਤੇ ਵਿੱਚ ਗੜਬੜ',
    status_guaranteed: 'ਗਾਰੰਟੀਸ਼ੁਦਾ ਮੁਨਾਫਾ (ਗੈਰ-ਕਾਨੂੰਨੀ)',
    status_linked: 'ਜਾਣੇ-ਪਛਾਣੇ ਠੱਗ ਗਰੋਹ ਨਾਲ ਸੰਬੰਧਿਤ',
    status_not_applicable: 'ਲਾਗੂ ਨਹੀਂ',
  },
  bn: {
    // Nav
    brand_sub: 'এআই আর্থিক সুরক্ষা কবচ',
    nav_home: 'হোম',
    nav_check: 'যাচাই করুন',
    nav_graph: 'স্ক্যাম ডিএনএ',
    nav_check_btn: 'এখনই যাচাই করুন',
    
    // Home
    hero_badge: '🛡️ সংজ্ঞান ২০২৬ · ভারতীয় বিনিয়োগকারীদের জন্য এআই সুরক্ষা কবচ',
    hero_title_1: 'টাকা পাঠানোর আগে',
    hero_title_2: 'আর্থিক প্রতারণা রুখে দিন।',
    hero_desc: 'রক্ষক হোয়াটসঅ্যাপ বার্তা, টেলিগ্রাম লিঙ্ক এবং ভুয়ো ট্রেডিং অ্যাপগুলির সত্যতা পরীক্ষা করে। আপনার সঞ্চয় হারানোর আগে ভুয়ো সেবি সার্টিফিকেট এবং অপরাধী চক্র ফাঁস করুন।',
    hero_cta_check: 'সন্দেহজনক বার্তা পরীক্ষা করুন',
    hero_cta_demo: 'ডেমো দেখুন',
    hero_cta_graph: 'স্ক্যাম ডিএনএ নেটওয়ার্ক দেখুন',
    
    stats_cases: 'বিশ্লেষিত কেস',
    stats_scams: 'শনাক্ত প্রতারণা',
    stats_reports: 'নাগরিকদের রিপোর্ট',
    stats_langs: 'আঞ্চলিক ভাষা',
    
    // Analyze
    analyze_title: 'আর্থিক জালিয়াতি প্রতিরোধক স্ক্যানার',
    analyze_sub: 'ট্রাস্ট পাসপোর্ট তৈরি করতে কোনো সন্দেহজনক বার্তা পেস্ট করুন বা স্ক্রিনশট আপলোড করুন।',
    tab_text: 'বার্তা লিখুন',
    tab_image: 'স্ক্রিনশট আপলোড করুন',
    placeholder_text: 'এখানে সন্দেহজনক হোয়াটসঅ্যাপ মেসেজ বা টেলিগ্রাম ইনভেস্টমেন্ট টিপস পেস্ট করুন...',
    btn_listening: 'শুনছি... কথা বলুন',
    btn_voice: 'ভয়েস ইনপুট (বাংলায় বলুন)',
    drop_title: 'স্ক্রিনশট এখানে ড্রপ করুন বা ব্রাউজ করুন',
    drop_sub: 'PNG, JPG, WEBP সমর্থিত',
    flag_label: 'আপনি কি কোনো সন্দেহজনক লক্ষণ দেখেছেন? (ঐচ্ছিক)',
    flag_placeholder: 'যেমন: নিশ্চিত ২০০% রিটার্ন, ব্যক্তিগত ইউপিআই...',
    btn_add_flag: 'যোগ করুন',
    btn_scan_now: 'রক্ষক দিয়ে যাচাই করুন',
    analyzing_title: 'এআই এবং সেবি রেজিস্ট্রির সাহায্যে যাচাই চলছে…',
    
    // Trust Passport
    tp_title: 'রক্ষক ট্রাস্ট পাসপোর্ট',
    tp_assessment: 'ঝুঁকি মূল্যায়ন',
    tp_identity_check: 'পরিচয় ও সেবি নিবন্ধন যাচাই',
    tp_extracted_entities: 'শনাক্ত করা UPI ও ফোন নম্বর',
    tp_red_flags: 'শনাক্ত করা বিপদের লক্ষণ (Red Flags)',
    tp_claims: 'মিথ্যা প্রতিশ্রুতির বিশ্লেষণ',
    tp_related_cases: 'স্ক্যাম ডিএনএ-তে যুক্ত অন্যান্য মামলা',
    tp_safe_steps: 'নিরাপদ থাকার পরবর্তী পদক্ষেপ',
    tp_verify_sebi: 'অফিসিয়াল সেবি পোর্টালে যাচাই করুন',
    tp_report_cyber: 'সাইবার ক্রাইম ১৯৩০ এ অভিযোগ করুন',
    tp_copy_link: 'লিঙ্ক কপি করুন',
    tp_copied: 'কপি হয়েছে!',
    tp_share_wa: 'হোয়াটসঅ্যাপে পরিবারকে পাঠান',
    tp_risk_iq: 'আপনার ইনভেস্টর রিস্ক আইকিউ',
    tp_scam_dna: 'স্ক্যাম ডিএনএ ক্রাইম গ্রাফ',
    
    // Labels
    risk_high: '⚠️ উচ্চ ঝুঁকি (প্রতারণার আশঙ্কা)',
    risk_medium: '⚡ সন্দেহজনক বার্তা / সতর্ক থাকুন',
    risk_low: '✅ যাচাইকৃত নিরাপদ বার্তা',
    risk_unknown: '❓ অজানা স্থিতি',
    
    status_verified: 'অফিসিয়ালি যাচাইকৃত',
    status_unverified: 'যাচাই প্রয়োজন',
    status_suspicious: 'সন্দেহজনক',
    status_not_found: 'সেবিতে নিবন্ধিত নয়',
    status_mismatch: 'নাম বা ব্যাঙ্ক অ্যাকাউন্টে গরমিল',
    status_guaranteed: 'নিশ্চিত রিটার্ন (আইনত অবৈধ)',
    status_linked: 'পরিচিত জালিয়াত চক্রের সাথে যুক্ত',
    status_not_applicable: 'প্রযোজ্য নয়',
  }
}

// Multilingual fallback translator for dynamic entities, attack stages, and safe next steps
export const TRANSLATE_DYNAMIC = {
  safe_steps: {
    en: [
      "Do NOT transfer money to any personal UPI ID or unverified account.",
      "Verify registration directly on the official SEBI registry at sebi.gov.in.",
      "If money was already deducted, immediately call 1930 or file a report at cybercrime.gov.in within the golden hour."
    ],
    hi: [
      "किसी भी व्यक्तिगत यूपीআই आईडी या असत्यापित बैंक खाते में पैसे ट्रांसफर न करें।",
      "sebi.gov.in पर आधिकारिक सेबी रजिस्ट्री में पंजीकरण संख्या सीधे सत्यापित करें।",
      "यदि पैसे पहले ही कट चुके हैं, तो तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर रिपोर्ट दर्ज करें।"
    ],
    mr: [
      "कोणत्याही वैयक्तिक यूपीआय आयडी किंवा अनोळखी खात्यावर पैसे पाठवू नका.",
      "sebi.gov.in या अधिकृत संकेतस्थळावर जाऊन नोंदणी क्रमांकाची खात्री करा.",
      "पैसे खात्यातून गेले असल्यास तात्काळ १९३० सायबर हेल्पलाइनवर कॉल करा किंवा cybercrime.gov.in वर तक्रार नोंदवा."
    ],
    te: [
      "ఎలాంటి వ్యక్తిగత UPI ID లేదా ధృవీకరించని ఖాతాకు డబ్బు పంపవద్దు.",
      "sebi.gov.in అధికారిక సెబీ పోర్టల్‌లో రిజిస్ట్రేషన్ నంబర్‌ను నేరుగా ధృవీకరించుకోండి.",
      "ఒకవేళ డబ్బులు కట్ అయితే, వెంటనే 1930 కు కాల్ చేయండి లేదా cybercrime.gov.in లో ఫిర్యాదు చేయండి."
    ],
    ta: [
      "எந்தவொரு தனிநபர் UPI முகவரி அல்லது சரிபார்க்கப்படாத கணக்கிற்கும் பணம் அனுப்ப வேண்டாம்.",
      "sebi.gov.in அதிகாரப்பூர்வ தளத்தில் பதிவு எண்ணை நேரில் சரிபார்க்கவும்.",
      "ஏற்கனவே பணம் அனுப்பியிருந்தால், உடனே 1930 எண்ணை அழைக்கவும் அல்லது cybercrime.gov.in இல் புகார் செய்யவும்."
    ],
    gu: [
      "કોઈપણ વ્યક્તિગત UPI ID અથવા અનધિકૃત ખાતામાં પૈસા ક્યારેય ટ્રાન્સફર ન કરો.",
      "sebi.gov.in પર સત્તાવાર સેબી રજિસ્ટ્રીમાં નોંધણી નંબર સીધો ચકાસો.",
      "જો પૈસા કપાઈ ગયા હોય, તો તાત્કાલિક ૧૯૩૦ પર કૉલ કરો અથવા cybercrime.gov.in પર ફરિયાદ નોંધાવો."
    ],
    pa: [
      "ਕਿਸੇ ਵੀ ਨਿੱਜੀ UPI ਆਈਡੀ ਜਾਂ ਅਣਜਾਣ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਟ੍ਰਾਂਸਫਰ ਨਾ ਕਰੋ।",
      "sebi.gov.in ਤੇ ਜਾ ਕੇ ਸੇਬੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ ਦੀ ਸਿੱਧੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
      "ਜੇਕਰ ਪੈਸੇ ਕੱਟੇ ਗਏ ਹਨ, ਤਾਂ ਤੁਰੰਤ 1930 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ cybercrime.gov.in ਤੇ ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ।"
    ],
    bn: [
      "কোনো ব্যক্তিগত ইউপিআই আইডি বা অসত্যায়িত অ্যাকাউন্টে টাকা পাঠাবেন না।",
      "sebi.gov.in এ সরাসরি অফিশিয়াল সেবি রেজিস্ট্রেশন নম্বর যাচাই করুন।",
      "যদি টাকা কেটে নেওয়া হয়ে থাকে, তবে অবিলম্বে ১৯৩০ নম্বরে কল করুন বা cybercrime.gov.in এ অভিযোগ দায়ের করুন।"
    ]
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('rakshak_lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('rakshak_lang', lang)
  }, [lang])

  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en
    return dict[key] || TRANSLATIONS.en[key] || key
  }

  const currentLanguage = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
