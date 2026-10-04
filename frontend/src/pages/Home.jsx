import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Upload, Type, ImageIcon, ChevronRight, Lock, Search, FileText, Eye, Network, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import ProtectionShield3D from '../components/3DProtectionShield'
import FinancialFirewall from '../components/FinancialFirewall'
import Card3DTilt from '../components/Card3DTilt'

const DEMO_CASES = [
  {
    id: 'demo-scam',
    label: 'Suspicious Investment',
    provenance: 'DEMO',
    text: `SEBI approved opportunity!\nInvest ₹10,000 and get ₹25,000 guaranteed in 30 days.\nOnly 20 slots remaining. Join our Telegram group:\n@ABCInvestOfficial\nUPI: abcinvest@xyz\nWebsite: abc-invest.com\nSEBI Reg: INH000FAKE1`,
    indicators: ['Guaranteed return', 'Urgency', 'SEBI impersonation', 'UPI redirection'],
    theme: 'danger',
  },
  {
    id: 'demo-legit',
    label: 'Legitimate Communication',
    provenance: 'DEMO',
    text: `Dear Investor, your Zerodha account statement for Q2 FY2026 is ready.\nView at kite.zerodha.com/reports\nFor support: support@zerodha.com or call 080-47181888.\nZerodha Broking Ltd. SEBI Reg: INZ000031633`,
    indicators: ['Official domain', 'Verified registration', 'No UPI request'],
    theme: 'safe',
  },
  {
    id: 'demo-ambiguous',
    label: 'Ambiguous Claim',
    provenance: 'DEMO',
    text: `Join our FREE stock market webinar!\nLearn from experts with 15+ years experience.\nRegister: +91 98765 43210\nWebsite: stockguru-india.com\nLimited seats - Register today!`,
    indicators: ['Mild urgency', 'Unverified expert claim', 'No SEBI reg mentioned'],
    theme: 'warning',
  },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Home() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [activeTab, setActiveTab] = useState('text')

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      setActiveTab('image')
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }, [])

  const handleFileSelect = (file) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const goToAnalyze = (prefill) => {
    navigate('/analyze', { state: { prefillText: prefill } })
  }

  const goToAnalyzeWithImage = () => {
    if (imageFile) {
      navigate('/analyze', { state: { prefillImage: imageFile } })
    }
  }

  const submitDirect = () => {
    if (activeTab === 'text' && text.trim()) {
      navigate('/analyze', { state: { prefillText: text.trim() } })
    } else if (activeTab === 'image' && imageFile) {
      navigate('/analyze', { state: { prefillImage: imageFile } })
    }
  }

  // Heuristic sensor for live input feedback
  const getLiveSensors = (val) => {
    if (!val || !val.trim()) return []
    const sensors = []
    if (/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/.test(val)) {
      sensors.push({ label: 'UPI Handle Detected', icon: '💳', color: 'bg-red-50 text-red-700 border-red-200' })
    }
    if (/(?:guarantee|100%|profit|double|jackpot|bonus|25,000|slots remaining|hurry|urgent)/i.test(val)) {
      sensors.push({ label: 'High Urgency / Profit Promise', icon: '⚡', color: 'bg-amber-50 text-amber-700 border-amber-200' })
    }
    if (/(?:sebi|reg|approved|certified|inh\d+)/i.test(val)) {
      sensors.push({ label: 'Regulatory / SEBI Claim', icon: '🏛️', color: 'bg-orange-50 text-orange-700 border-orange-200' })
    }
    if (/(?:https?:\/\/|t\.me\/|telegram|join group|wa\.me)/i.test(val)) {
      sensors.push({ label: 'Redirect Link / Channel', icon: '🔗', color: 'bg-blue-50 text-blue-700 border-blue-200' })
    }
    if (/^(hello|hi|hey|good morning|namaste|kaise ho)/i.test(val.trim())) {
      sensors.push({ label: 'Non-Financial / Casual Chat', icon: '💬', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' })
    }
    return sensors
  }

  const liveSensors = getLiveSensors(text)

  return (
    <div className="min-h-screen text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-8 px-4 sm:px-6">
        {/* Softer atmospheric background lights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-orange-200/35 rounded-full blur-[120px]" />
          <div className="absolute top-48 left-1/4 w-[300px] h-[250px] bg-amber-200/25 rounded-full blur-[100px]" />
          <div className="absolute top-48 right-1/4 w-[300px] h-[250px] bg-red-100/30 rounded-full blur-[100px]" />
        </div>

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
        >
          {/* Top Live Defense Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold mb-6 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <Shield className="w-3.5 h-3.5 text-orange-600" />
            <span>{t('hero_badge')}</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.08] mb-5 tracking-tight text-slate-900">
            <span className="drop-shadow-xs">{t('hero_title_1')}</span>
            <br />
            <span className="gradient-text drop-shadow-[0_4px_24px_rgba(249,115,22,0.2)]">{t('hero_title_2')}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-5 leading-relaxed font-normal">
            {t('hero_desc')}
          </motion.p>

          {/* Interactive 3D Financial Protection Core */}
          <motion.div variants={fadeUp} className="my-2 flex justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[320px] h-[320px] bg-orange-300/20 rounded-full blur-[70px]" />
            </div>
            <ProtectionShield3D />
          </motion.div>

          {/* Live Protection Capabilities Strip */}
          <motion.div variants={fadeUp} className="mt-6 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm backdrop-blur-xl hover:border-orange-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                SEBI Registry
              </div>
              <div className="text-sm font-black text-slate-900 mt-1">Real-Time Sync</div>
              <div className="text-[11px] text-slate-500">Statutory intermediary verification</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm backdrop-blur-xl hover:border-red-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Scam DNA Graph
              </div>
              <div className="text-sm font-black text-slate-900 mt-1">15+ Syndicates</div>
              <div className="text-[11px] text-slate-500">Cross-case identifier linkages</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm backdrop-blur-xl hover:border-sky-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Golden Hour
              </div>
              <div className="text-sm font-black text-slate-900 mt-1">Helpline 1930</div>
              <div className="text-[11px] text-slate-500">Direct MHA cyber helpline trigger</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm backdrop-blur-xl hover:border-emerald-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Voice Readout
              </div>
              <div className="text-sm font-black text-slate-900 mt-1">Hindi & English</div>
              <div className="text-[11px] text-slate-500">Full accessibility for all citizens</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Upload Area — The Primary Cyber Scanner */}
      <section className="px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <Card3DTilt
            maxTilt={2}
            scale={1.003}
            className="cyber-bracket relative bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden backdrop-blur-2xl"
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {/* Drag overlay */}
            <AnimatePresence>
              {dragging && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-orange-500/20 border-2 border-dashed border-orange-500 rounded-3xl flex items-center justify-center backdrop-blur-md"
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-orange-600 mx-auto mb-2 animate-bounce" />
                    <p className="text-orange-700 font-bold text-lg">Drop suspicious screenshot here</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab bar */}
            <div className="flex border-b border-slate-200 bg-slate-50/90 p-2 gap-2">
              {[
                ['text', Type, t('tab_text')],
                ['image', ImageIcon, t('tab_image')],
              ].map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === key
                      ? 'bg-white text-orange-600 shadow-xs border border-orange-200 font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 bg-white">
              <AnimatePresence mode="wait">
                {activeTab === 'text' ? (
                  <motion.div key="text-input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="relative">
                      <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={t('placeholder_text')}
                        rows={6}
                        className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm leading-relaxed transition-all shadow-inner font-sans focus:bg-white"
                      />
                      {text && (
                        <button
                          onClick={() => setText('')}
                          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                          title="Clear text"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Live Threat Sensor Strip */}
                    {liveSensors.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-2"
                      >
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Eye className="w-3 h-3 text-orange-600" />
                          Live Threat Sensor:
                        </span>
                        {liveSensors.map((s, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 shadow-xs ${s.color}`}
                          >
                            <span>{s.icon}</span>
                            <span>{s.label}</span>
                          </span>
                        ))}
                      </motion.div>
                    )}

                    {/* Quick test chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                      <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Test:</span>
                      <button
                        type="button"
                        onClick={() => setText(DEMO_CASES[0].text)}
                        className="text-[11px] px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        ⚠️ Telegram Scam
                      </button>
                      <button
                        type="button"
                        onClick={() => setText(DEMO_CASES[1].text)}
                        className="text-[11px] px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        🛡️ Zerodha Notice
                      </button>
                      <button
                        type="button"
                        onClick={() => setText(DEMO_CASES[2].text)}
                        className="text-[11px] px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        ⚖️ Stock Webinar
                      </button>
                      <button
                        type="button"
                        onClick={() => setText("Hello! Hope you have a wonderful day.")}
                        className="text-[11px] px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        💬 Hello (Casual Chat)
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="image-input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {!imagePreview ? (
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="py-12 text-center cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/40 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
                          <Upload className="w-6 h-6 text-orange-600" />
                        </div>
                        <p className="text-slate-800 font-bold text-sm">{t('drop_title')}</p>
                        <p className="text-slate-500 text-xs mt-1">{t('drop_sub')}</p>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                          onChange={e => e.target.files[0] && handleFileSelect(e.target.files[0])} />
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                        <img src={imagePreview} alt="Screenshot preview" className="w-full max-h-56 object-contain rounded-xl" />
                        <button
                          onClick={() => { setImageFile(null); setImagePreview(null) }}
                          className="absolute top-4 right-4 p-1.5 bg-white/90 hover:bg-red-600 hover:text-white text-slate-700 rounded-lg transition-colors shadow-sm cursor-pointer border border-slate-200"
                          title="Remove screenshot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs text-slate-500 font-medium">100% Private · Zero OTP or Personal Data Stored</span>
                </div>
                <button
                  onClick={submitDirect}
                  disabled={activeTab === 'text' ? !text.trim() : !imageFile}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] border border-orange-500/30 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('btn_scan_now')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card3DTilt>

          {/* Feature trust badges below card */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="py-2 px-1 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-700">🏛️ SEBI Verified Checks</span>
            </div>
            <div className="py-2 px-1 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-orange-700">🧬 Scam DNA Patterns</span>
            </div>
            <div className="py-2 px-1 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-sky-700">🛡️ Plain-Language Advice</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works — 4 Cyber Defense Nodes */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">How Rakshak Protects You in 4 Steps</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: FileText, label: '1. Paste / Upload', desc: 'Message, QR or screenshot' },
              { icon: Search, label: '2. Check SEBI', desc: 'Official government registries' },
              { icon: Eye, label: '3. Scan Tactics', desc: 'Detect fake promises & urgency' },
              { icon: Shield, label: '4. Clear Advice', desc: 'Safe or Danger in plain words' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center py-4 px-3 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <step.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-0.5">{step.label}</div>
                <div className="text-[11px] text-slate-500">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Firewall Layered Architecture Section */}
      <FinancialFirewall />

      {/* Demo Cases Dossiers */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">Threat Intelligence Case Dossiers</h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore how Rakshak analyses different vectors in real-time</p>
            </div>
            <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-orange-700 font-bold uppercase tracking-wider">
              Live Reference Cases
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {DEMO_CASES.map((demo, i) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card3DTilt
                  onClick={() => goToAnalyze(demo.text)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all group cursor-pointer shadow-xs flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                        demo.theme === 'danger' ? 'bg-red-50 text-red-700 border-red-200 shadow-xs' :
                        demo.theme === 'safe' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs' :
                        'bg-amber-50 text-amber-700 border-amber-200 shadow-xs'
                      }`}>
                        {demo.theme === 'danger' ? '⚠️ ' : demo.theme === 'safe' ? '🛡️ ' : '⚖️ '}
                        {demo.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{demo.provenance}</span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed mb-3.5 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {demo.text.slice(0, 110)}…
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {demo.indicators.map((ind, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                    <span>Analyse this case</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card3DTilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-slate-500 text-xs bg-white">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy-first · No investment advice · Zero OTP collection</span>
        </div>
        <p className="text-slate-500">Rakshak · SANGYAN 2026 · AI Cyber Financial Defense & Citizen Security Engine</p>
      </footer>
    </div>
  )
}
