import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Users, Send, CheckCircle2, Loader2 } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function WhisperForm() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [totalReports, setTotalReports] = useState(null)

  const submit = async () => {
    if (!content.trim() || content.length < 10) { toast.error('Please describe the suspicious message.'); return }
    setLoading(true)
    try {
      const r = await axios.post(`${API}/whisper/report`, { content: content.trim() })
      setDone(true)
      setTotalReports(r.data.total_reports)
      toast.success('Report submitted! Thank you for protecting the community.')
    } catch {
      toast.error('Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-amber-200/90 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-amber-600" />
        <span className="font-bold text-stone-900">Whisper Network</span>
        <span className="text-xs text-stone-500 ml-1 font-medium">Anonymous Community Reporting</span>
      </div>
      <p className="text-sm text-stone-600 mb-4 leading-relaxed font-normal">
        Received another suspicious investment message? Submit it anonymously. Every report enriches the Scam DNA graph and protects more investors.
      </p>

      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <div className="font-bold text-emerald-700 text-lg mb-1">Thank you!</div>
          <p className="text-stone-600 text-sm font-hindi">समुदाय की सुरक्षा में मदद के लिए धन्यवाद!</p>
          {totalReports && (
            <p className="text-xs text-stone-500 mt-2 font-medium">{totalReports} community reports total</p>
          )}
        </motion.div>
      ) : (
        <>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            placeholder="Paste or describe the suspicious message you received…"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm text-stone-900 placeholder-stone-400 resize-none focus:outline-none focus:border-brand-500"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-stone-500 font-medium">🔒 Fully anonymous · No personal data stored</p>
            <button
              onClick={submit}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-amber-700" />}
              Submit Anonymously
            </button>
          </div>
        </>
      )}
    </div>
  )
}
