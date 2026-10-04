import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Info,
  Share2, MessageSquare, Network, ChevronDown, ChevronUp,
  ExternalLink, Copy, Check, Eye, EyeOff, HelpCircle,
  FileText, Lock, ArrowRight, Send, Loader2, Sparkles, Box,
  Volume2, VolumeX, PhoneCall, Ban, AlertOctagon, CheckCircle
} from 'lucide-react'
import ScamDNAGraph from '../components/ScamDNAGraph'
import ScamDNAGraph3D from '../components/ScamDNAGraph3D'
import TrustPassportCard from '../components/TrustPassport'
import { useLanguage, LANGUAGES, TRANSLATE_DYNAMIC } from '../context/LanguageContext'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const REGIONAL_SPEECH_SCRIPTS = {
  hi: {
    danger: "सावधान! यह संदेश अत्यंत जोखिम भरा और धोखाधड़ी से जुड़ा प्रतीत होता है। कृपया कोई भी पैसे ट्रांसफर न करें। इस नंबर को तुरंत ब्लॉक करें और सहायता के लिए हेल्पलाइन 1930 पर संपर्क करें।",
    safe: "यह संदेश आधिकारिक रिकॉर्ड से सत्यापित प्रतीत होता है। कोई धोखाधड़ी के संकेत नहीं मिले हैं।",
    unrelated: "यह संदेश सामान्य बातचीत है। इसमें किसी वित्तीय धोखाधड़ी, फर्जी निवेश प्रस्ताव या घोटाले का कोई संकेत नहीं मिला है।",
    warning: "कृपया सतर्क रहें। इस संदेश की पूरी पुष्टि नहीं हो पाई है। पैसे भेजने से पहले आधिकारिक वेबसाइट पर जांच करें।"
  },
  mr: {
    danger: "सावधान! हा संदेश अत्यंत धोकादायक आणि फसवणुकीशी संबंधित आहे. कृपया कोणतेही पैसे ट्रान्सफर करू नका. हा नंबर त्वरित ब्लॉक करा आणि मदतीसाठी राष्ट्रीय सायबर हेल्पलाईन 1930 वर संपर्क करा.",
    safe: "हा संदेश अधिकृत नोंदीनुसार सत्यापित आहे. फसवणुकीचे कोणतेही संकेत आढळले नाहीत.",
    unrelated: "हा संदेश सामान्य संभाषणाचा आहे. यामध्ये कोणतीही आर्थिक फसवणूक किंवा घोटाळ्याचे संकेत नाहीत.",
    warning: "कृपया काळजी घ्या. या संदेशाची पूर्ण खात्री झालेली नाही. पैसे पाठवण्यापूर्वी अधिकृत कंपनीशी संपर्क साधा."
  },
  te: {
    danger: "జాగ్రత్త! ఈ మెసేజ్ చాలా ప్రమాదకరమైనది మరియు ఆర్థిక మోసానికి సంబంధించింది. దయచేసి ఎటువంటి డబ్బును బదిలీ చేయవద్దు. ఈ నంబర్‌ను వెంటనే బ్లాక్ చేయండి మరియు సహాయం కోసం 1930 హెల్ప్‌లైన్‌కు కాల్ చేయండి.",
    safe: "ఈ సమాచారం అధికారిక రికార్డులతో సరిపోలింది. ఎటువంటి మోసం సంకేతాలు కనిపించలేదు.",
    unrelated: "ఇది సాధారణ సంభాషణ మాత్రమే. ఇందులో ఎటువంటి ఆర్థిక మోసం లేదా నకిలీ పెట్టుబడి సంకేతాలు లేవు.",
    warning: "దయచేసి జాగ్రత్తగా ఉండండి. కొన్ని వివరాలు ఇంకా ధృవీకరించబడలేదు. డబ్బు పంపే ముందు అధికారికంగా నిర్ధారించుకోండి."
  },
  ta: {
    danger: "எச்சரிக்கை! இந்த செய்தி மிகவும் ஆபத்தானது மற்றும் நிதி மோசடியுடன் தொடர்புடையது. தயவுசெய்து பணம் எதுவும் அனுப்ப வேண்டாம். இந்த எண்ணை உடனே பிளாக் செய்து, உதவிக்கு 1930 உதவி எண்ணை அழைக்கவும்.",
    safe: "இந்த செய்தி அதிகாரப்பூர்வ பதிவுகளுடன் சரிபார்க்கப்பட்டது. மோசடி எதுவும் இல்லை.",
    unrelated: "இது ஒரு சாதாரண உரையாடல். இதில் எந்தவிதமான நிதி மோசடியும் இல்லை.",
    warning: "தயவுசெய்து கவனமாக இருங்கள். சில விவரங்கள் இன்னும் உறுதிப்படுத்தப்படவில்லை. பணம் அனுப்புவதற்கு முன் சரிபார்க்கவும்."
  },
  gu: {
    danger: "સાવધાન! આ મેસેજ અત્યંત જોખમી અને નાણાકીય છેતરપિંડી સાથે જોડાયેલો છે. કૃપા કરીને કોઈપણ પૈસા ટ્રાન્સફર કરશો નહીં. આ નંબરને તાત્કાલિક બ્લોક કરો અને મદદ માટે હેલ્પલાઇન 1930 પર કૉલ કરો.",
    safe: "આ મેસેજ સત્તાવાર રેકોર્ડ સાથે મેળ ખાય છે અને સુરક્ષિત જણાય છે.",
    unrelated: "આ સામાન્ય વાતચીતનો મેસેજ છે. આમાં કોઈ છેતરપિંડી કે નકલી રોકાણ સ્કીમ નથી.",
    warning: "કૃપા કરીને સાવચેત રહો. આ દાવાની સંપૂર્ણ પુષ્ટિ થઈ નથી. પૈસા મોકલતા પહેલા સત્તાવાર તપાસ કરો."
  },
  bn: {
    danger: "সাবধান! এই বার্তাটি অত্যন্ত ঝুঁকিপূর্ণ এবং আর্থিক প্রতারণার সাথে জড়িত। অনুগ্রহ করে কোনো টাকা পাঠাবেন না। এই নম্বরটি অবিলম্বে ব্লক করুন এবং সাহায্যের জন্য হেল্পলাইন 1930-এ যোগাযোগ করুন।",
    safe: "এই বার্তাটি সরকারি রেকর্ডের সাথে যাচাই করা হয়েছে এবং এটি নিরাপদ।",
    unrelated: "এটি একটি সাধারণ কথোপকথন। এতে কোনো আর্থিক প্রতারণা বা ভুয়া বিনিয়োগের লক্ষণ নেই।",
    warning: "অনুগ্রহ করে সতর্ক থাকুন। এই তথ্যের সম্পূর্ণ সত্যতা যাচাই করা যায়নি। টাকা পাঠানোর আগে পুনরায় যাচাই করুন।"
  },
  pa: {
    danger: "ਸਾਵਧਾਨ! ਇਹ ਸੁਨੇਹਾ ਬਹੁਤ ਖ਼ਤਰਨਾਕ ਹੈ ਅਤੇ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਨਾਲ ਜੁੜਿਆ ਹੋਇਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਪੈਸੇ ਟ੍ਰਾਂਸਫਰ ਨਾ ਕਰੋ। ਇਸ ਨੰਬਰ ਨੂੰ ਤੁਰੰਤ ਬਲਾਕ ਕਰੋ ਅਤੇ ਮਦਦ ਲਈ 1930 ਹੈਲਪਲਾਈਨ 'ਤੇ ਸੰਪਰਕ ਕਰੋ।",
    safe: "ਇਹ ਸੁਨੇਹਾ ਅਧਿਕਾਰਤ ਰਿਕਾਰਡਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ ਅਤੇ ਬਿਲਕੁਲ ਸੁਰੱਖਿਅਤ ਹੈ।",
    unrelated: "ਇਹ ਆਮ ਗੱਲਬਾਤ ਦਾ ਸੁਨੇਹਾ ਹੈ। ਇਸ ਵਿੱਚ ਕੋਈ ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਜਾਂ ਸਕੈਮ ਦੇ ਸੰਕੇਤ ਨਹੀਂ ਹਨ।",
    warning: "ਕਿਰਪਾ ਕਰਕੇ ਸੁਚੇਤ ਰਹੋ। ਇਸ ਜਾਣਕਾਰੀ ਦੀ ਪੂਰੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ ਹੈ। ਪੈਸੇ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਕਰੋ।"
  },
  en: {
    danger: "Warning! High risk detected. Do not send any money. This message has classic hallmarks of an investment scam. Block the sender immediately. If you need help, call helpline 1930.",
    safe: "Good news! This communication appears legitimate and matches verified official regulatory records.",
    unrelated: "This message is casual conversation and unrelated to financial matters. No fraud or scam indicators were detected.",
    warning: "Please be careful. Some details could not be verified. Do not transfer any funds until you independently confirm with the official company."
  }
}

const VOICE_LOCALES = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  en: 'en-IN'
}

const HERO_THEMES = {
  danger:    { bg: 'bg-gradient-to-b from-red-50 via-white to-red-50/40', border: 'border-red-300 shadow-xl shadow-red-500/10', text: 'text-red-700', summaryText: 'text-red-950', iconBg: 'bg-red-100', iconColor: 'text-red-600', icon: AlertOctagon },
  warning:   { bg: 'bg-gradient-to-b from-amber-50 via-white to-amber-50/40', border: 'border-amber-300 shadow-xl shadow-amber-500/10', text: 'text-amber-700', summaryText: 'text-amber-950', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', icon: AlertTriangle },
  safe:      { bg: 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40', border: 'border-emerald-300 shadow-xl shadow-emerald-500/10', text: 'text-emerald-700', summaryText: 'text-emerald-950', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: CheckCircle2 },
  neutral:   { bg: 'bg-white', border: 'border-slate-200 shadow-xl shadow-slate-900/5', text: 'text-slate-700', summaryText: 'text-slate-900', iconBg: 'bg-slate-100', iconColor: 'text-slate-600', icon: Info },
  unrelated: { bg: 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40', border: 'border-emerald-300 shadow-xl shadow-emerald-500/10', text: 'text-emerald-700', summaryText: 'text-emerald-950', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: CheckCircle2 },
}

const PROVENANCE_BADGES = {
  VERIFIED_REGISTRY_CHECK: { label: 'Verified', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' },
  REFERENCE_EVIDENCE: { label: 'Reference Evidence', color: 'bg-blue-50 text-blue-800 border-blue-200 font-semibold' },
  USER_PROVIDED: { label: 'User-Provided', color: 'bg-slate-100 text-slate-700 border-slate-200 font-semibold' },
  AI_SIMILARITY: { label: 'AI Similarity', color: 'bg-purple-50 text-purple-800 border-purple-200 font-semibold' },
  NEEDS_VERIFICATION: { label: 'Needs Verification', color: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold' },
  DEMO: { label: 'Demo Data', color: 'bg-slate-100 text-slate-700 border-slate-200 font-semibold' },
}

function ProvenanceBadge({ provenance }) {
  const badge = PROVENANCE_BADGES[provenance] || PROVENANCE_BADGES.NEEDS_VERIFICATION
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider border shadow-2xs ${badge.color}`}>
      {badge.label}
    </span>
  )
}

export default function TrustPassport() {
  const { id } = useParams()
  const loc = useLocation()
  const stateData = loc.state
  const { t, lang, currentLanguage } = useLanguage()

  const [data, setData] = useState(stateData || null)
  const [loading, setLoading] = useState(!stateData)
  
  // UX Mode: 'citizen' (simple, human) vs 'forensic' (3D network, raw hashes)
  const [activeView, setActiveView] = useState('citizen')
  
  const [showGraph, setShowGraph] = useState(true)
  const [graphMode, setGraphMode] = useState('3d')
  const [showWhyWarning, setShowWhyWarning] = useState(true)
  const [showClaims, setShowClaims] = useState(false)
  const [showUnknown, setShowUnknown] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [voiceLang, setVoiceLang] = useState(lang || 'hi')
  const audioRef = useRef(null)

  useEffect(() => {
    if (lang) setVoiceLang(lang)
  }, [lang])

  // Stop any playing audio on page unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Ask Rakshak state
  const [askQuestion, setAskQuestion] = useState('')
  const [askAnswer, setAskAnswer] = useState(null)
  const [askLoading, setAskLoading] = useState(false)
  const [showAsk, setShowAsk] = useState(false)

  useEffect(() => {
    if (!stateData) {
      axios.get(`${API}/result/${id}`)
        .then(r => { setData(r.data); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [id, stateData])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied!')
  }

  const fallbackToSpeechSynthesis = (speechText, targetLang) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false)
      setAudioLoading(false)
      return
    }
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(speechText)
      const targetLocale = VOICE_LOCALES[targetLang] || 'hi-IN'
      utterance.lang = targetLocale
      utterance.rate = 0.90
      utterance.pitch = 1.0

      const voices = window.speechSynthesis.getVoices()
      if (voices && voices.length > 0) {
        const targetPrefix = targetLang.toLowerCase()
        const matched = voices.find(v => {
          const vl = v.lang.toLowerCase().replace('_', '-')
          return vl === targetLocale.toLowerCase() || vl.startsWith(targetPrefix)
        })
        if (matched) utterance.voice = matched
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setAudioLoading(false)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setAudioLoading(false)
      }
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    } catch {
      setIsSpeaking(false)
      setAudioLoading(false)
    }
  }

  // Voice Read-Aloud for low-literacy users across all 8 Indian languages (Native Audio Stream)
  const handleReadAloud = (forcedLang) => {
    // If already playing and user simply clicks Stop Audio
    if ((isSpeaking || audioLoading) && !forcedLang) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      setIsSpeaking(false)
      setAudioLoading(false)
      return
    }

    // Stop previous instance before starting new
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    const targetLang = forcedLang || voiceLang || lang || 'hi'
    const isUnrelated = data?.evidence_package?.hero_theme === 'unrelated'
      || data?.analysis?.content_type === 'unrelated'
      || data?.analysis?.overall_risk === 'not_applicable'
      || data?.analysis?.is_financial_related === false
      || data?.analysis?.relevance_status === 'unrelated_content'
    const isDanger = !isUnrelated && data?.evidence_package?.hero_theme === 'danger'
    const isSafe = !isUnrelated && data?.evidence_package?.hero_theme === 'safe'
    const verdictKey = isUnrelated ? 'unrelated' : isDanger ? 'danger' : isSafe ? 'safe' : 'warning'

    const scriptPack = REGIONAL_SPEECH_SCRIPTS[targetLang] || REGIONAL_SPEECH_SCRIPTS['hi'] || REGIONAL_SPEECH_SCRIPTS['en']
    const speechText = scriptPack[verdictKey] || scriptPack.warning

    const langObj = LANGUAGES.find(l => l.code === targetLang)
    toast.success(`Playing verdict audio in ${langObj ? langObj.name : targetLang} (${langObj ? langObj.native : ''})`)
    setAudioLoading(true)
    setIsSpeaking(true)

    // Primary: Native authentic regional voice stream from Rakshak /tts API
    const audioUrl = `${API}/tts?lang=${targetLang}&text=${encodeURIComponent(speechText)}`

    fetch(audioUrl)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const audio = new Audio(blobUrl)
        audioRef.current = audio

        audio.onended = () => {
          setIsSpeaking(false)
          setAudioLoading(false)
          URL.revokeObjectURL(blobUrl)
        }

        audio.onerror = (e) => {
          console.warn('[Rakshak] Audio element playback error, falling back:', e)
          URL.revokeObjectURL(blobUrl)
          fallbackToSpeechSynthesis(speechText, targetLang)
        }

        await audio.play()
        setAudioLoading(false)
      })
      .catch((err) => {
        console.warn('[Rakshak] Fetching TTS audio failed, falling back to speech synthesis:', err)
        fallbackToSpeechSynthesis(speechText, targetLang)
      })
  }

  const handleAskRakshak = async () => {
    if (!askQuestion.trim() || askQuestion.length < 3) return
    setAskLoading(true)
    try {
      const res = await axios.post(`${API}/analyze/ask`, {
        result_id: id,
        question: askQuestion.trim()
      })
      setAskAnswer(res.data)
    } catch {
      toast.error('Could not process question.')
    }
    setAskLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-stone-600 flex items-center gap-3 font-medium">
        <Shield className="w-6 h-6 animate-pulse text-brand-600" />
        Checking records and generating Trust Passport…
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-surface text-stone-500">
      <div className="text-center">
        <Shield className="w-10 h-10 text-stone-400 mx-auto mb-3" />
        <p className="font-semibold text-stone-800">Result not found</p>
        <Link to="/analyze" className="text-brand-600 font-semibold text-sm mt-2 inline-block hover:underline">Analyse a new message →</Link>
      </div>
    </div>
  )

  const analysis = data.analysis || {}
  const evidence = data.evidence_package || {}
  const graph = data.graph
  const relatedCases = data.related_cases || analysis.related_cases || []

  // Evidence-first hero
  const isUnrelated = evidence.hero_theme === 'unrelated'
    || analysis.content_type === 'unrelated'
    || analysis.overall_risk === 'not_applicable'
    || analysis.is_financial_related === false
    || analysis.relevance_status === 'unrelated_content'
  const heroTheme = HERO_THEMES[evidence.hero_theme] || (isUnrelated ? HERO_THEMES.unrelated : HERO_THEMES.neutral)
  const isDanger = !isUnrelated && evidence.hero_theme === 'danger'
  const isSafe = !isUnrelated && evidence.hero_theme === 'safe'
  
  const indicators = evidence.indicators || []
  const whyThisWarning = evidence.why_this_warning || []
  const beforeYouAct = evidence.before_you_act || []
  const investigatorMeta = evidence.investigator_metadata || {}

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 bg-transparent text-slate-900">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Top Header Bar & Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Rakshak Safety Verdict
              </h1>
              <p className="text-[11px] text-slate-500">
                Case ID: <span className="font-mono text-orange-600 font-bold">{id?.slice(0, 12)}</span>
              </p>
            </div>
          </div>

          {/* View Mode Switcher: Simple vs Forensic */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveView('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'citizen'
                  ? 'bg-white text-orange-600 shadow-xs border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-orange-600" />
              Simple View (आसान)
            </button>
            <button
              onClick={() => setActiveView('forensic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'forensic'
                  ? 'bg-white text-purple-700 shadow-xs border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-purple-600" />
              Forensic & 3D Network
            </button>
          </div>
        </div>

        {/* ═══════════════ UNMISTAKABLE HUMAN VERDICT BANNER ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`cyber-bracket rounded-3xl p-5 sm:p-7 border relative overflow-hidden backdrop-blur-2xl transition-all shadow-xl shadow-slate-900/5 ${
            isDanger ? 'bg-gradient-to-b from-red-50 via-white to-red-50/30 border-red-300'
            : (isSafe || isUnrelated) ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30 border-emerald-300'
            : 'bg-gradient-to-b from-amber-50 via-white to-amber-50/30 border-amber-300'
          }`}
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isDanger ? 'bg-red-200/40' : (isSafe || isUnrelated) ? 'bg-emerald-200/40' : 'bg-amber-200/40'
          }`} />

          {/* Top Verdict Row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Graphic Emblem */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                isDanger 
                  ? 'bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-red-500/30 ring-1 ring-red-400/50' 
                  : (isSafe || isUnrelated) 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 ring-1 ring-emerald-400/50' 
                  : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/30 ring-1 ring-amber-400/50'
              }`}>
                {isDanger ? <AlertOctagon className="w-8 h-8 animate-pulse" /> : (isSafe || isUnrelated) ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-black tracking-widest uppercase px-3.5 py-1 rounded-full border shadow-2xs ${
                    isDanger ? 'bg-red-50 text-red-700 border-red-300 shadow-xs' 
                    : (isSafe || isUnrelated) ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs' 
                    : 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                  }`}>
                    {isDanger ? t('risk_high') 
                     : isSafe ? t('risk_low') 
                     : isUnrelated ? t('risk_low') 
                     : t('risk_medium')}
                  </span>
                  {analysis.risk_score !== undefined && !isUnrelated && (
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-700 shadow-2xs">
                      Risk Score: {analysis.risk_score}/100
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black mt-2 leading-snug tracking-tight text-slate-900">
                  {isDanger
                    ? (lang === 'hi' ? 'कोई भी पैसे न भेजें' : lang === 'mr' ? 'कोणतेही पैसे पाठवू नका' : lang === 'te' ? 'డబ్బు పంపవద్దు' : lang === 'ta' ? 'பணம் அனுப்ப வேண்டாம்' : lang === 'gu' ? 'પૈસા મોકલશો નહીં' : lang === 'bn' ? 'টাকা পাঠাবেন না' : lang === 'pa' ? 'ਪੈਸੇ ਨਾ ਭੇਜੋ' : 'Do NOT Send Any Money or Share Details')
                    : isSafe
                    ? (lang === 'hi' ? 'यह संदेश सत्यापित और सुरक्षित है' : lang === 'mr' ? 'हा संदेश अधिकृत आणि सुरक्षित आहे' : lang === 'te' ? 'ఈ సమాచారం సురక్షితమైనది' : lang === 'ta' ? 'இந்த செய்தி பாதுகாப்பானது' : 'This Communication Appears Legitimate')
                    : isUnrelated
                    ? (lang === 'hi' ? 'कोई वित्तीय खतरा नहीं मिला' : lang === 'mr' ? 'कोणताही आर्थिक धोका नाही' : lang === 'te' ? 'ఆర్థిక మోసం లేదు' : 'No Financial Scam or Threat Detected')
                    : (lang === 'hi' ? 'संदिग्ध दावे मिले — पहले जांचें' : lang === 'mr' ? 'संशयास्पद दावे — आधी तपासा' : lang === 'te' ? 'అనుమానాస్పద సందేశం' : 'Suspicious Claims Detected — Verify First')}
                </h2>
                <p className="text-sm font-medium mt-1.5 text-slate-700 leading-relaxed max-w-xl">
                  {(REGIONAL_SPEECH_SCRIPTS[lang] || REGIONAL_SPEECH_SCRIPTS.en)[
                    isUnrelated ? 'unrelated' : isDanger ? 'danger' : isSafe ? 'safe' : 'warning'
                  ]}
                </p>
              </div>
            </div>

            {/* Multi-Lingual Regional Voice Read-Aloud for Bharat Accessibility */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start flex-shrink-0 bg-white/95 p-1.5 rounded-2xl border border-orange-200 shadow-sm backdrop-blur-xs">
              <button
                onClick={() => handleReadAloud()}
                disabled={audioLoading}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                  isSpeaking
                    ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-md shadow-red-500/30'
                    : audioLoading
                    ? 'bg-orange-400 text-white border-transparent'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent hover:from-orange-600 hover:to-amber-600 shadow-xs'
                }`}
                title="Listen to automated voice verdict in regional Indian languages"
              >
                {audioLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : isSpeaking ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
                <span>{audioLoading ? 'Loading Audio…' : isSpeaking ? 'Stop Audio' : '🔊 Listen'}</span>
              </button>

              {/* Regional Voice Selector Dropdown */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-50/80 rounded-xl border border-orange-200">
                <span className="text-[10px] font-bold text-orange-900 uppercase tracking-wider hidden sm:inline">Voice:</span>
                <select
                  value={voiceLang}
                  onChange={(e) => {
                    const newLang = e.target.value
                    setVoiceLang(newLang)
                    if (isSpeaking || audioLoading) {
                      handleReadAloud(newLang)
                    }
                  }}
                  className="text-xs font-bold bg-white border border-orange-300 text-slate-800 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-2xs"
                  aria-label="Select Regional Indian Voice Language"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.native} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ═════════ 4 KEY FORENSIC HIGHLIGHT CHIPS ═════════ */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-200">
            {/* SEBI Registry */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                🏛️ SEBI Status
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                {isUnrelated ? (
                  <span className="text-sky-700">Not Applicable</span>
                ) : analysis.entities?.sebi_reg_numbers?.length > 0 ? (
                  evidence.indicators?.some(i => i.status === 'safe') ? (
                    <span className="text-emerald-700">Verified Intermediary</span>
                  ) : (
                    <span className="text-red-700 font-black">Fake / Unlisted</span>
                  )
                ) : (
                  <span className="text-amber-700 font-semibold">Unregistered</span>
                )}
              </div>
            </div>

            {/* Payment Destination */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                💳 Payment ID
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                {analysis.entities?.upi_ids?.length > 0 ? (
                  <span className="text-red-700 font-black">Personal UPI Detected</span>
                ) : isUnrelated ? (
                  <span className="text-emerald-700">No Payment Found</span>
                ) : (
                  <span className="text-slate-700 font-medium">Standard Account</span>
                )}
              </div>
            </div>

            {/* Urgency / FOMO */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                ⚡ Pressure Tactics
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                {evidence.indicators?.some(i => i.key === 'urgency') ? (
                  <span className="text-red-700 font-black">Artificial Urgency</span>
                ) : (
                  <span className="text-emerald-700 font-medium">None Detected</span>
                )}
              </div>
            </div>

            {/* Syndicate Match */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                🕸️ Crime Records
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                {relatedCases.length > 0 ? (
                  <span className="text-red-700 font-black">{relatedCases.length} Linked Cases</span>
                ) : (
                  <span className="text-emerald-700 font-medium">Clean / 0 Matches</span>
                )}
              </div>
            </div>
          </div>

          {/* ═════════ 3 HIGH-IMPACT IMMEDIATE ACTION CARDS ═════════ */}
          <div className="relative z-10 grid sm:grid-cols-3 gap-2.5 mt-4 pt-3.5 border-t border-slate-200">
            {isUnrelated ? (
              <>
                <div className="p-3.5 rounded-2xl bg-white border border-emerald-300 flex items-start gap-3 shadow-xs card-hover">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      Safe Content
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      No payment requests, fake profits, or scam links detected in this message.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs card-hover">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      Stay Vigilant
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      If this contact later asks for investments or UPI transfer, check here.
                    </p>
                  </div>
                </div>

                <a
                  href="tel:1930"
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs card-hover hover:border-orange-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      Helpline 1930
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      Dial 1930 anytime you suspect financial fraud or phishing.
                    </p>
                  </div>
                </a>
              </>
            ) : (
              <>
                <div className="p-3.5 rounded-2xl bg-white border border-red-300 flex items-start gap-3 shadow-xs card-hover">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-black text-red-800 flex items-center gap-1.5">
                      DO NOT PAY
                      <Ban className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <p className="text-[11px] text-red-700 mt-0.5 leading-snug">
                      Never transfer funds to personal UPI or unverified accounts.
                    </p>
                  </div>
                </div>

                <a
                  href="tel:1930"
                  className="p-3.5 rounded-2xl bg-white border border-amber-300 flex items-start gap-3 shadow-xs card-hover hover:scale-[1.02] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      Dial 1930 Helpline
                      <PhoneCall className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                      National Cyber Crime Golden-Hour rescue hotline (Govt of India).
                    </p>
                  </div>
                </a>

                <a
                  href="https://scores.sebi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs card-hover hover:border-orange-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      Verify via SEBI SCORES
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      Official portal to lodge complaints against fraudulent advisories.
                    </p>
                  </div>
                </a>
              </>
            )}
          </div>
        </motion.div>

        {/* ═══════════════ CITIZEN VIEW (DEFAULT & SIMPLE) ═══════════════ */}
        {activeView === 'citizen' && (
          <div className="space-y-4">
            
            {/* Why This Warning? (Clear Explanations in Plain English / Hindi) */}
            {whyThisWarning.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-cardBorder shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-cardBorder bg-stone-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-stone-900 text-sm">
                      Why Was This Flagged? (सावधान क्यों रहें?)
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Plain Explanation</span>
                </div>

                <div className="p-4 space-y-3 bg-white">
                  {whyThisWarning.map((wtw, i) => (
                    <div
                      key={wtw.id || i}
                      className="p-4 rounded-2xl border border-stone-200/90 bg-gradient-to-r from-stone-50/70 to-white flex flex-col gap-2 relative overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                          <span className="text-xs font-black text-stone-900">{wtw.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {wtw.source && (
                            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                              {wtw.source}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                            Flagged
                          </span>
                        </div>
                      </div>

                      {wtw.detected && (
                        <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block mb-0.5">
                            Detected in Message:
                          </span>
                          <span className="font-mono font-semibold text-stone-900 bg-white px-1.5 py-0.5 rounded border border-orange-200/60 inline-block">
                            "{wtw.detected}"
                          </span>
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-stone-100/70 border border-stone-200/70 text-xs text-stone-700 leading-relaxed">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                          Plain Language Explanation:
                        </span>
                        {wtw.simple_explanation || wtw.why_it_matters}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3D Glass Trust Passport Card (7 Human-Friendly Sections) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TrustPassportCard data={data} caseId={id} />
            </motion.div>

            {/* Before You Act Checklist */}
            {beforeYouAct.filter(b => b.urgent).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-amber-100 bg-amber-50/50 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-stone-900 text-sm">Recommended Next Steps</span>
                </div>
                <div className="p-4 space-y-2.5 bg-white">
                  {beforeYouAct.filter(b => b.urgent).map((action, i) => (
                    <div key={action.id || i} className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50/60 border border-stone-200/60">
                      <div className="w-6 h-6 rounded-md bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-800">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-stone-900">{action.title}</div>
                        <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">{action.desc}</p>
                        {action.action_url && (
                          <a
                            href={action.action_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1 inline-flex items-center gap-1"
                          >
                            Open Official Resource <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Prompt to explore 3D Scam Network */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-orange-50 border border-purple-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Want to see the full 3D Scam Network?</div>
                  <div className="text-[11px] text-stone-600">See how this phone or UPI connects to other known cybercrime cases.</div>
                </div>
              </div>
              <button
                onClick={() => setActiveView('forensic')}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                View 3D Network →
              </button>
            </div>

          </div>
        )}

        {/* ═══════════════ FORENSIC & 3D NETWORK VIEW ═══════════════ */}
        {activeView === 'forensic' && (
          <div className="space-y-4">
            
            {/* 3D Scam DNA Graph Card */}
            {graph && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden border border-cardBorder shadow-sm"
              >
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-cardBorder bg-stone-50/70">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-stone-900 text-sm">3D Scam DNA Network</span>
                    {relatedCases.length > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                        {relatedCases.length} linked cases
                      </span>
                    )}
                  </div>
                  <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg border border-stone-300">
                    <button
                      onClick={() => setGraphMode('3d')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        graphMode === '3d'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <Box className="w-3 h-3" /> 3D View
                    </button>
                    <button
                      onClick={() => setGraphMode('2d')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        graphMode === '2d'
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      2D View
                    </button>
                  </div>
                </div>

                <div className="p-1">
                  {graphMode === '3d' ? (
                    <ScamDNAGraph3D graphData={graph} currentId={`case_${id}`} height={440} />
                  ) : (
                    <ScamDNAGraph graphData={graph} currentId={`case_${id}`} />
                  )}
                </div>
              </motion.div>
            )}

            {/* Extracted Identifiers & Forensic Details */}
            {analysis.entities && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden border border-cardBorder shadow-sm p-5"
              >
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Extracted Forensic IOCs</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(analysis.entities).map(([key, vals]) => {
                    if (!vals?.length) return null
                    const labels = {
                      upi_ids: '💳 UPI Handles', phone_numbers: '📞 Phone Numbers', urls: '🌐 URLs',
                      social_handles: '📱 Social Channels', org_names: '🏢 Claimed Entities', person_names: '👤 Named Persons',
                      sebi_reg_numbers: '📋 SEBI Numbers',
                    }
                    return (
                      <div key={key} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="text-[11px] text-stone-500 font-semibold mb-1">{labels[key] || key}</div>
                        <div className="flex flex-wrap gap-1">
                          {vals.map((v, i) => (
                            <span key={i} className="text-xs bg-white text-stone-900 border border-stone-300 px-2 py-0.5 rounded font-mono font-medium">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Investigator Cryptographic Metadata */}
            {investigatorMeta && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-50/50 rounded-2xl p-5 border border-purple-200 shadow-xs"
              >
                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-purple-700" />
                  Cryptographic Provenance Record
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-stone-500 font-medium">Content SHA-256 Hash</span>
                    <div className="font-mono text-stone-800 mt-0.5 break-all">{investigatorMeta.content_hash || 'SHA256-4b9...081'}</div>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Extraction Engine</span>
                    <div className="font-mono text-stone-800 mt-0.5">{investigatorMeta.extraction_method || 'Rakshak Regex + LLM Core'}</div>
                  </div>
                </div>
                {investigatorMeta.regulatory_statutes_cited && (
                  <div className="mt-3 pt-3 border-t border-purple-200/60">
                    <span className="text-[10px] text-stone-500 font-bold uppercase">Statutes Cited:</span>
                    <div className="text-[11px] text-stone-700 mt-1 font-mono">
                      {investigatorMeta.regulatory_statutes_cited.join(' · ')}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        )}

        {/* ═══════════════ ASK RAKSHAK (COMMON TO BOTH) ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-cardBorder shadow-sm overflow-hidden"
        >
          <button
            onClick={() => setShowAsk(a => !a)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-left">
                <span className="font-bold text-sm text-stone-900 block">Ask Rakshak in Simple Words</span>
                <span className="text-[11px] text-stone-500 block">Ask questions like "Is this company real?" or "Should I click the link?"</span>
              </div>
            </div>
            {showAsk ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </button>
          
          <AnimatePresence>
            {showAsk && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-cardBorder">
                <div className="p-4 sm:p-5 bg-white space-y-3">
                  <div className="flex gap-2">
                    <input
                      value={askQuestion}
                      onChange={e => setAskQuestion(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAskRakshak()}
                      placeholder="e.g. Why is this dangerous? Did you check with SEBI?"
                      className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                    <button
                      onClick={handleAskRakshak}
                      disabled={askLoading || !askQuestion.trim()}
                      className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                    >
                      {askLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>

                  {askAnswer && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 text-sm">
                      <p className="font-semibold text-stone-900 leading-relaxed">{askAnswer.answer}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                        <ProvenanceBadge provenance={askAnswer.provenance} />
                        <span>Source: {askAnswer.source}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══════════════ SHARE & NEXT ACTIONS ═══════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50 transition-all cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share Result'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check this safety report on Rakshak: ${window.location.href}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>

          <Link
            to="/analyze"
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Shield className="w-3.5 h-3.5" />
            Check Another Message
          </Link>
        </div>

        {/* Bottom Disclaimer */}
        <div className="text-center text-[11px] text-stone-500 py-3 flex items-center justify-center gap-1 font-medium">
          <Lock className="w-3.5 h-3.5 text-stone-400" />
          Rakshak AI Investor Firewall · For verification and awareness · Not official investment advice
        </div>

      </div>
    </div>
  )
}
