import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Search, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf8f5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-cardBorder flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Search className="w-8 h-8 text-stone-400" />
        </div>
        <h1 className="text-5xl font-black text-stone-300 mb-2">404</h1>
        <h2 className="text-lg font-bold text-stone-900 mb-2">Page not found</h2>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-500/20"
          >
            <Shield className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/analyze"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cardBorder text-stone-700 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-all shadow-xs"
          >
            Check a Message
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
