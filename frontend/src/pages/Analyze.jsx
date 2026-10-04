import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Mic, MicOff, Type, ImageIcon,
  Shield, Loader2, ChevronRight, AlertCircle, X, CheckCircle2,
  Search, Eye, Network, FileText, Lock, Sparkles
} from 'lucide-react'
import { useLanguage, LANGUAGES } from '../context/LanguageContext'
import AnalysisAnimation from '../components/AnalysisAnimation'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const INVESTIGATION_STAGES = [
  { id: 1, label: 'Reading message', detail: 'Extracting text from submission', icon: FileText, duration: 800 },
  { id: 2, label: 'Extracting entities', detail: 'Identifying UPI IDs, phone numbers, URLs, names', icon: Search, duration: 1000 },
  { id: 3, label: 'Understanding claims', detail: 'Analysing investment claims and promises', icon: Eye, duration: 900 },
  { id: 4, label: 'Checking available evidence', detail: 'Verifying against SEBI intermediary registry', icon: Shield, duration: 1200 },
  { id: 5, label: 'Analysing behavioural patterns', detail: 'Matching against known scam DNA signatures', icon: Sparkles, duration: 1000 },
  { id: 6, label: 'Looking for related cases', detail: 'Searching cross-case identifier linkages', icon: Network, duration: 900 },
  { id: 7, label: 'Preparing Trust Passport', detail: 'Compiling evidence and provenance', icon: FileText, duration: 700 },
]

const DEMO_TEXT = `SEBI approved opportunity!
Invest ₹10,000 and get ₹25,000 guaranteed in 30 days.
Only 20 slots remaining. Join our Telegram group:
@ABCInvestOfficial
UPI: abcinvest@xyz
Website: abc-invest.com
SEBI Reg: INH000FAKE1`

const VOICE_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  pa: 'pa-Guru-IN',
  bn: 'bn-IN',
}

export default function Analyze() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, lang, currentLanguage } = useLanguage()
  const fileRef = useRef(null)
  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)
  const baseTextRef = useRef('')

  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [listening, setListening] = useState(false)
  const [micLang, setMicLang] = useState(lang || 'hi')
  const [loading, setLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [stageStartTime, setStageStartTime] = useState(null)
  const [apiDone, setApiDone] = useState(false)
  const [pendingResult, setPendingResult] = useState(null)

  useEffect(() => {
    if (lang) setMicLang(lang)
  }, [lang])

  // Stop voice recognition on unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
    }
  }, [])

  // Prefill from Home page navigation
  useEffect(() => {
    if (location.state?.prefillText) {
      setText(location.state.prefillText)
      setMode('text')
    }
  }, [location.state])

  // ── Voice Input (Regional Bharat Speech-to-Text) ─────────────────────────
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Voice recognition is not supported in this browser. Please use Google Chrome or Edge.')
      return
    }

    if (listening) {
      isListeningRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
      setListening(false)
      toast('Voice input stopped', { icon: '⏹️' })
      return
    }

    const activeMicCode = micLang || lang || 'hi'
    // Save current textarea content as base text so we append rather than overwrite
    baseTextRef.current = text ? text.trim() + ' ' : ''

    try {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.maxAlternatives = 1
      rec.lang = VOICE_LANG_MAP[activeMicCode] || `${activeMicCode}-IN`
      recognitionRef.current = rec
      isListeningRef.current = true

      rec.onresult = (e) => {
        let sessionFinal = ''
        let sessionInterim = ''
        for (let i = 0; i < e.results.length; i++) {
          const item = e.results[i]
          if (item.isFinal) {
            sessionFinal += item[0].transcript + ' '
          } else {
            sessionInterim += item[0].transcript
          }
        }
        const fullTranscript = (baseTextRef.current + sessionFinal + sessionInterim).trimStart()
        setText(fullTranscript)
      }

      rec.onerror = (e) => {
        // 'no-speech' is a normal silence pause, keep listening
        if (e.error === 'no-speech' || e.error === 'aborted') {
          return
        }
        if (e.error === 'language-not-supported') {
          // If Gurmukhi tag failed, try pa-IN
          if (rec.lang === 'pa-Guru-IN') {
            try {
              rec.lang = 'pa-IN'
              rec.start()
              return
            } catch {}
          }
          const langName = LANGUAGES.find(l => l.code === activeMicCode)?.name || activeMicCode
          toast.error(`Speech recognition for ${langName} is not supported in this browser version.`)
        } else if (e.error === 'not-allowed') {
          toast.error('Microphone access denied. Please grant microphone permission.')
        } else {
          toast.error(`Voice recognition error: ${e.error}`)
        }
        isListeningRef.current = false
        setListening(false)
      }

      rec.onend = () => {
        // Auto-restart if user has not explicitly clicked stop
        if (isListeningRef.current) {
          try {
            // Update base text with whatever was transcribed so far
            setText(current => {
              baseTextRef.current = current ? current.trim() + ' ' : ''
              return current
            })
            rec.start()
            return
          } catch {}
        }
        setListening(false)
        isListeningRef.current = false
      }

      rec.start()
      setListening(true)
      const targetLangObj = LANGUAGES.find(l => l.code === activeMicCode)
      toast.success(`Listening in ${targetLangObj ? targetLangObj.name : activeMicCode} (${targetLangObj ? targetLangObj.native : ''})… speak now`)
    } catch (err) {
      console.error('[Voice] Error starting recognition:', err)
      toast.error('Could not start voice recognition. Please verify microphone permissions.')
      setListening(false)
      isListeningRef.current = false
    }
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) setImageData(file)
  }, [])

  const setImageData = (file) => {
    setImageFile(file); setMode('image')
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  // ── Investigation Animation ──────────────────────────────────────────────
  useEffect(() => {
    if (!loading) return
    if (currentStage >= INVESTIGATION_STAGES.length) return

    // If API finished and we've shown at least 4 stages, fast-forward to result
    if (apiDone && currentStage >= 4) {
      // Quick finish remaining stages
      const timer = setTimeout(() => {
        if (currentStage < INVESTIGATION_STAGES.length - 1) {
          setCurrentStage(s => s + 1)
        } else if (pendingResult) {
          navigate(`/result/${pendingResult.result_id}`, { state: pendingResult })
        }
      }, 300)
      return () => clearTimeout(timer)
    }

    const stage = INVESTIGATION_STAGES[currentStage]
    const timer = setTimeout(() => {
      if (currentStage < INVESTIGATION_STAGES.length - 1) {
        setCurrentStage(s => s + 1)
      }
    }, stage.duration)
    return () => clearTimeout(timer)
  }, [loading, currentStage, apiDone, pendingResult, navigate])

  // When API is done and all stages shown, navigate
  useEffect(() => {
    if (apiDone && currentStage >= INVESTIGATION_STAGES.length - 1 && pendingResult) {
      const timer = setTimeout(() => {
        navigate(`/result/${pendingResult.result_id}`, { state: pendingResult })
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [apiDone, currentStage, pendingResult, navigate])

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (mode === 'text' && !text.trim()) { toast.error('Please enter some text.'); return }
    if (mode === 'image' && !imageFile) { toast.error('Please upload an image.'); return }

    setLoading(true)
    setCurrentStage(0)
    setApiDone(false)
    setPendingResult(null)
    setStageStartTime(Date.now())

    try {
      let res
      if (mode === 'text') {
        res = await axios.post(`${API}/analyze/text`, { text: text.trim() })
      } else {
        const form = new FormData()
        form.append('file', imageFile)
        res = await axios.post(`${API}/analyze/screenshot`, form)
      }
      setPendingResult(res.data)
      setApiDone(true)
    } catch (err) {
      setLoading(false)
      setCurrentStage(0)
      const detail = err.response?.data?.detail || 'Analysis failed. Please try again.'
      toast.error(detail)
    }
  }

  // ── Loading / Investigation Screen ──────────────────────────────────────
  if (loading) {
    return (
      <AnalysisAnimation
        apiReady={apiDone}
        onComplete={() => {
          if (pendingResult) {
            navigate(`/result/${pendingResult.result_id}`, { state: pendingResult })
          }
        }}
      />
    )
  }

  // ── Main Input Form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 sm:px-6 pt-8 pb-24 bg-transparent text-slate-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-3 shadow-xs">
              <Shield className="w-3.5 h-3.5 text-orange-600" />
              <span>Multi-Source Verification Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">{t('analyze_title')}</h1>
            <p className="text-slate-600 text-sm leading-relaxed">{t('analyze_sub')}</p>
          </div>
        </motion.div>

        {/* Mode toggle */}
        <div className="flex gap-1.5 bg-slate-100 rounded-2xl p-1.5 mb-5 border border-slate-200 shadow-inner">
          {[
            ['text', Type, t('tab_text')],
            ['image', ImageIcon, t('tab_image')]
          ].map(([m, Icon, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                mode === m
                  ? 'bg-white text-orange-600 shadow-xs font-bold border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <AnimatePresence mode="wait">
          {mode === 'text' ? (
            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="cyber-bracket relative bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden backdrop-blur-xl">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={t('placeholder_text')}
                  rows={7}
                  className="w-full bg-white p-4 text-slate-900 placeholder-slate-400 resize-none focus:outline-none text-sm leading-relaxed font-sans"
                />
                {/* Voice + demo buttons with regional language selector */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setText(DEMO_TEXT)}
                    className="text-xs text-orange-700 hover:text-orange-800 font-bold flex items-center gap-1.5 cursor-pointer bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    Use demo message
                  </button>

                  {/* Regional Voice Controls */}
                  <div className="flex items-center gap-2">
                    <select
                      value={micLang}
                      onChange={(e) => setMicLang(e.target.value)}
                      disabled={listening}
                      className="text-xs font-bold bg-white border border-slate-300 text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-2xs disabled:opacity-50"
                      title="Select regional language for speech dictation"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.native} ({l.name})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={toggleVoice}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        listening
                          ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                          : 'bg-white text-slate-800 hover:text-orange-600 hover:bg-orange-50/50 border border-slate-200 shadow-xs'
                      }`}
                    >
                      {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-orange-600" />}
                      <span>{listening ? t('btn_listening') : 'Speak (बोलें)'}</span>
                    </button>
                  </div>
                </div>
              </div>
              {listening && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  Listening in {LANGUAGES.find(l => l.code === (micLang || lang))?.name || 'Regional Voice'} ({LANGUAGES.find(l => l.code === (micLang || lang))?.native})… speak your message
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!imagePreview ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`cyber-bracket drop-zone rounded-2xl p-12 text-center cursor-pointer border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-orange-50/40 hover:border-orange-500 transition-all ${dragging ? 'active border-orange-500 bg-orange-50' : ''}`}
                >
                  <Upload className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                  <p className="text-slate-800 font-bold">{t('drop_title')}</p>
                  <p className="text-slate-500 text-xs mt-1">{t('drop_sub')}</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && setImageData(e.target.files[0])} />
                </div>
              ) : (
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-2">
                  <img src={imagePreview} alt="Screenshot" className="w-full max-h-72 object-contain rounded-xl bg-slate-50" />
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 text-slate-700 hover:text-white rounded-lg hover:bg-red-500 transition-colors shadow-md border border-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 border border-orange-500/30 disabled:opacity-50 cursor-pointer"
        >
          <Shield className="w-5 h-5 text-white" />
          <span>{t('btn_scan_now')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy-first · No OTP / credentials stored · Rakshak analysis, not investment advice</span>
        </p>
      </div>
    </div>
  )
}
