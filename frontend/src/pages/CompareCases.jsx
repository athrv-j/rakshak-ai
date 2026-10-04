import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitCompare, Shield, CheckCircle2, XCircle, AlertTriangle,
  Loader2, ChevronRight, Info, ArrowRight, Network
} from 'lucide-react'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function CompareCases() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleCompare = async () => {
    if (textA.trim().length < 5 || textB.trim().length < 5) {
      toast.error('Both messages must contain at least 5 characters.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await axios.post(`${API}/analyze/compare`, {
        text_a: textA.trim(),
        text_b: textB.trim()
      })
      setResult(res.data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Comparison failed.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-8 pb-24 bg-transparent text-slate-900">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-xs">
              <GitCompare className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Compare Cases</h1>
          </div>
          <p className="text-slate-600 text-sm mb-6 font-normal">
            Paste two suspicious messages to identify shared identifiers, behavioural patterns and operational overlaps.
          </p>
        </motion.div>

        {/* Quick test sample button */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Messages</span>
          <button
            type="button"
            onClick={() => {
              setTextA(`SEBI approved guaranteed return! Invest ₹15,000 for ₹40,000 in 15 days.\nTelegram: @VIPWealthGuru\nUPI: fastwealth@axisbank\nSEBI Reg: INH000FAKE99`)
              setTextB(`URGENT: Premium Stock Options alert! Guaranteed 200% return this week.\nContact VIP Wealth on Telegram: @VIPWealthGuru\nPay registration to UPI: fastwealth@axisbank`)
            }}
            className="text-xs text-orange-700 hover:text-orange-800 font-bold flex items-center gap-1.5 cursor-pointer bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 shadow-xs hover:bg-orange-100 transition-colors"
          >
            ⚡ Load Linked Syndicate Sample
          </button>
        </div>

        {/* Input area */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            ['Message A', textA, setTextA],
            ['Message B', textB, setTextB],
          ].map(([label, value, setter], idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="cyber-bracket"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                {value && (
                  <button
                    onClick={() => setter('')}
                    className="text-[11px] text-slate-400 hover:text-slate-700 font-medium cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder={`Paste suspicious message ${idx + 1} here...`}
                rows={6}
                className="w-full bg-white rounded-2xl p-4 text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm leading-relaxed border border-slate-200 shadow-xs transition-all"
              />
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || textA.trim().length < 5 || textB.trim().length < 5}
          className="w-full py-3.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-40 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 border border-orange-500/30 cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitCompare className="w-5 h-5" />}
          <span>{loading ? 'Comparing Cases…' : 'Compare Cases for Overlaps'}</span>
        </button>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              {/* Correlation Summary */}
              <div className={`cyber-bracket rounded-2xl p-6 border shadow-xs ${
                result.is_syndicate_link
                  ? 'border-red-300 bg-red-50 text-red-900 shadow-red-500/5'
                  : 'border-amber-300 bg-amber-50 text-amber-900 shadow-amber-500/5'
              }`}>
                <div className="flex items-start gap-3">
                  {result.is_syndicate_link
                    ? <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    : <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  }
                  <div>
                    <div className={`text-sm font-bold ${result.is_syndicate_link ? 'text-red-800' : 'text-amber-800'}`}>
                      {result.is_syndicate_link ? 'Shared Identifiers Detected (Syndicate Overlap)' : 'Behavioural Similarity Only'}
                    </div>
                    <p className="text-sm text-slate-800 mt-1 leading-relaxed font-medium">{result.correlation_summary}</p>
                    <p className="text-xs text-slate-600 mt-2 font-normal">{result.cautious_conclusion}</p>
                  </div>
                </div>
              </div>

              {/* Shared DNA */}
              {result.shared_dna && (
                <div className="cyber-bracket bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Network className="w-4 h-4 text-purple-600" />
                    Shared DNA
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      result.shared_dna.provenance === 'VERIFIED_EXTRACTION_MATCH'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-purple-50 text-purple-800 border-purple-200'
                    }`}>
                      {result.shared_dna.provenance}
                    </span>
                  </h3>

                  <div className="space-y-2">
                    {result.shared_dna.shared_upis?.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-700">Same UPI: <span className="font-mono text-red-600 font-bold">{u}</span></span>
                      </div>
                    ))}
                    {result.shared_dna.shared_phones?.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-700">Same Phone: <span className="font-mono text-red-600 font-bold">{p}</span></span>
                      </div>
                    ))}
                    {result.shared_dna.shared_urls?.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-700">Same URL: <span className="font-mono text-red-600 font-bold">{u}</span></span>
                      </div>
                    ))}
                    {result.shared_dna.shared_behaviors?.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-slate-700">{b}</span>
                      </div>
                    ))}
                    {!result.shared_dna.shared_upis?.length &&
                     !result.shared_dna.shared_phones?.length &&
                     !result.shared_dna.shared_urls?.length &&
                     !result.shared_dna.shared_behaviors?.length && (
                      <p className="text-sm text-slate-500">No shared identifiers or behavioural patterns detected.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Differences */}
              {result.differences?.length > 0 && (
                <div className="cyber-bracket bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Differences</h3>
                  <div className="space-y-3">
                    {result.differences.map((diff, i) => (
                      <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{diff.attribute}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-[10px] text-slate-500 mb-1 font-medium">Message A</div>
                            <div className="text-xs font-mono text-slate-800 font-medium">
                              {Array.isArray(diff.message_a) ? diff.message_a.join(', ') || '—' : diff.message_a || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 mb-1 font-medium">Message B</div>
                            <div className="text-xs font-mono text-slate-800 font-medium">
                              {Array.isArray(diff.message_b) ? diff.message_b.join(', ') || '—' : diff.message_b || '—'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
