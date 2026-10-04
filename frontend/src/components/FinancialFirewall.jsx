import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, CheckCircle2, AlertTriangle, ArrowDown,
  MessageCircle, Send, Globe, Smartphone,
  Search, Eye, Database, Network, Activity, FileCheck
} from 'lucide-react'

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
    </svg>
  )
}

const INCOMING_CHANNELS = [
  { name: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Telegram', icon: Send, color: 'text-sky-600', bg: 'bg-sky-50' },
  { name: 'Instagram', icon: InstagramIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
  { name: 'YouTube', icon: YoutubeIcon, color: 'text-red-600', bg: 'bg-red-50' },
  { name: 'Fake Site', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'SMS / OCR', icon: Smartphone, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const FIREWALL_ENGINES = [
  {
    id: 'entity',
    title: 'Entity Extraction',
    desc: 'Traces UPI IDs, phone numbers, domain registrars, IFSC codes',
    icon: Search,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    id: 'claim',
    title: 'Claim Analysis',
    desc: 'Evaluates guarantees, impossible yields, and fake statutory promises',
    icon: Eye,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 'evidence',
    title: 'Authoritative Evidence',
    desc: 'Direct cross-check against official SEBI and cyber records',
    icon: Database,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    id: 'dna',
    title: 'Scam DNA Match',
    desc: 'Correlates behavioral signatures with known fraud syndicates',
    icon: Network,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    id: 'behaviour',
    title: 'Behaviour Signal',
    desc: 'Identifies urgency, authority impersonation, and pressure tactics',
    icon: Activity,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
]

export default function FinancialFirewall() {
  const [activeEngine, setActiveEngine] = useState('evidence')

  return (
    <section className="px-4 sm:px-6 py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold mb-3 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-orange-600" />
            <span>Layered Investor Defense</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            How the Rakshak AI Financial Firewall Protects You
          </h2>
          <p className="text-stone-600 text-sm max-w-xl mx-auto mt-2 leading-relaxed">
            Suspicious messages and screenshot claims pass through multi-vector verification before you act on any financial advice.
          </p>
        </div>

        {/* 3D Layered Firewall System */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#e5dfd5] shadow-xl shadow-stone-900/5 overflow-hidden">
          {/* Subtle background circuit pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Layer 1: Incoming Content */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                Layer 1 · Incoming Unverified Signals
              </span>
              <span className="text-[11px] font-semibold text-stone-500">Public & Social Channels</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {INCOMING_CHANNELS.map((ch, idx) => {
                const Icon = ch.icon
                return (
                  <motion.div
                    key={ch.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#faf8f5] border border-stone-200/80 hover:border-orange-300 transition-all shadow-2xs group cursor-default"
                  >
                    <div className={`w-8 h-8 rounded-lg ${ch.bg} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-4 h-4 ${ch.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-stone-700">{ch.name}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex items-center justify-center my-4">
            <div className="flex flex-col items-center">
              <div className="h-4 w-0.5 bg-gradient-to-b from-stone-300 to-orange-500" />
              <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div className="h-4 w-0.5 bg-gradient-to-b from-orange-500 to-amber-500" />
            </div>
          </div>

          {/* Layer 2: Rakshak AI Security Core */}
          <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-orange-50/70 via-amber-50/40 to-white border-2 border-orange-300/80 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                    Layer 2 · Rakshak AI Firewall & Verification Engine
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Continuous cross-check against authoritative repositories
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE · 5 NODES
              </span>
            </div>

            {/* 5 Deep Analysis Nodes */}
            <div className="grid sm:grid-cols-5 gap-2.5">
              {FIREWALL_ENGINES.map((eng) => {
                const Icon = eng.icon
                const isSelected = activeEngine === eng.id

                return (
                  <div
                    key={eng.id}
                    onClick={() => setActiveEngine(eng.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-white border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                        : 'bg-white/80 border-stone-200/90 hover:border-orange-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-6 h-6 rounded-md ${eng.bg} flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${eng.color}`} />
                      </div>
                      <span className="text-xs font-bold text-stone-800 leading-tight">
                        {eng.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-normal line-clamp-2">
                      {eng.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex items-center justify-center my-4">
            <div className="flex flex-col items-center">
              <div className="h-4 w-0.5 bg-gradient-to-b from-amber-500 to-emerald-500" />
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div className="h-4 w-0.5 bg-gradient-to-b from-emerald-500 to-stone-300" />
            </div>
          </div>

          {/* Layer 3: Trust Passport Outcome */}
          <div className="rounded-2xl p-5 bg-[#faf8f5] border border-stone-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-xs text-stone-800">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-stone-400 uppercase tracking-widest">
                    Layer 3 · Decision Layer
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    Cryptographic Trust Passport with Clear Actions
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Evidence Verified</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Pause & Verify</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
