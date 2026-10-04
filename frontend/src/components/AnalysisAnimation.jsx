import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, CheckCircle2, Loader2, Sparkles,
  FileText, Search, Database, Activity, Network, FileCheck
} from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Reading message & OCR extraction…', detail: 'Extracting raw textual tokens and visual regions', icon: FileText, duration: 600 },
  { id: 2, title: 'Extracting digital entities…', detail: 'Locating UPI handles, phone numbers, URLs, and identities', icon: Search, duration: 700 },
  { id: 3, title: 'Checking available evidence…', detail: 'Cross-verifying claims against SEBI intermediary registry', icon: Database, duration: 800 },
  { id: 4, title: 'Analysing behavioural patterns…', detail: 'Detecting artificial urgency, guarantees & pressure tactics', icon: Activity, duration: 750 },
  { id: 5, title: 'Mapping Scam DNA signatures…', detail: 'Correlating cross-case syndicate footprints and modus operandi', icon: Network, duration: 700 },
  { id: 6, title: 'Generating Trust Passport…', detail: 'Compiling evidence-bound decision certificate', icon: FileCheck, duration: 650 },
]

export default function AnalysisAnimation({ onComplete, apiReady = true }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    let timer
    if (currentStepIndex < STEPS.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(i => i + 1)
      }, STEPS[currentStepIndex].duration)
    } else if (currentStepIndex === STEPS.length - 1) {
      timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 700)
    }
    return () => clearTimeout(timer)
  }, [currentStepIndex, onComplete])

  const currentStep = STEPS[currentStepIndex]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-transparent text-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-bracket max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl shadow-slate-300/60 relative overflow-hidden backdrop-blur-2xl"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-orange-200/40 rounded-full blur-3xl -z-10" />

        {/* 3D Holographic Scanner Core */}
        <div className="relative text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            {/* Spinning radar rings */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full border border-amber-500/20 border-b-amber-500 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shadow-xs">
              <Shield className="w-8 h-8 text-orange-600 animate-pulse" />
            </div>

            {/* Orbiting data photon */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1.5s' }}>
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
            <span>AI Cyber Defense Engine Active</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Investigating Financial Claims
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Multi-vector evidence evaluation & SEBI verification in progress
          </p>
        </div>

        {/* Dynamic 6-Step Visual Sequence */}
        <div className="space-y-2 mb-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            const isFinished = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const isWaiting = idx > currentStepIndex

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isWaiting ? 0.45 : 1,
                  x: 0,
                }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isFinished
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-2xs'
                    : isCurrent
                    ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isFinished
                    ? 'bg-emerald-100 text-emerald-700'
                    : isCurrent
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {isFinished ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold truncate ${
                    isFinished ? 'text-emerald-900' : isCurrent ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-[10px] truncate ${
                    isFinished ? 'text-emerald-700' : isCurrent ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {step.detail}
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full animate-pulse">
                    RUNNING
                  </span>
                )}
                {isFinished && (
                  <span className="text-[10px] font-mono font-bold text-emerald-700">
                    VERIFIED
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Overall Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
            <span>Overall Inspection Progress</span>
            <span className="font-mono text-orange-600 font-bold">
              {Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-full shadow-xs"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Security Engine Telemetry */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>PIPELINE: SHA-256 EXTRACTOR</span>
          <span>LATENCY: 38ms</span>
          <span className="text-emerald-700 font-semibold">STATUS: NOMINAL</span>
        </div>
      </motion.div>
    </div>
  )
}
