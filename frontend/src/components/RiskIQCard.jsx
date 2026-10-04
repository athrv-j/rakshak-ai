import { motion } from 'framer-motion'
import { TrendingUp, Star, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react'

const GRADE_CONFIG = {
  A: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Excellent' },
  B: { color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    label: 'Good' },
  C: { color: 'text-amber-800',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: 'Fair' },
  D: { color: 'text-orange-800',  bg: 'bg-orange-50',  border: 'border-orange-200',  label: 'Needs Work' },
  F: { color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     label: 'Keep Learning' },
}

export default function RiskIQCard({ data, hindi }) {
  if (!data) return null
  const grade = data.grade || 'C'
  const gc = GRADE_CONFIG[grade] || GRADE_CONFIG.C

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 border shadow-sm ${gc.border}`}
    >
      <div className="flex items-start gap-4">
        <div className={`${gc.bg} border ${gc.border} rounded-2xl w-16 h-16 flex flex-col items-center justify-center flex-shrink-0 shadow-xs`}>
          <div className={`text-2xl font-black ${gc.color}`}>{grade}</div>
          <div className="text-[11px] font-medium text-stone-500">{gc.label}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-stone-900">Investor Risk IQ</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`text-3xl font-black ${gc.color}`}>{data.score}</div>
            <div className="text-sm text-stone-400 font-medium">/ 100</div>
          </div>
          {/* Score bar */}
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                data.score >= 80 ? 'bg-emerald-500' :
                data.score >= 60 ? 'bg-blue-500' :
                data.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Feedback */}
      <p className={`text-sm text-stone-700 mt-4 leading-relaxed font-normal ${hindi ? 'font-hindi' : ''}`}>
        {hindi ? data.feedback_hindi : data.feedback}
      </p>

      {/* Correctly identified */}
      {data.correctly_identified?.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> You spotted
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.correctly_identified.map((f, i) => (
              <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium shadow-2xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missed flags */}
      {data.missed_flags?.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Missed
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.missed_flags.map((f, i) => (
              <span key={i} className="text-xs bg-red-50 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full font-medium shadow-2xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {data.tips?.length > 0 && (
        <div className="mt-4 space-y-2">
          {data.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-stone-600 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              {tip}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
