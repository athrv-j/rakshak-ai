import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Network, Home, GitCompare, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const loc = useLocation()
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const active = (path) =>
    loc.pathname === path
      ? 'text-orange-600 font-bold bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 shadow-xs'
      : 'text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all font-medium'

  const navLinks = [
    { to: '/', icon: Home, label: t('nav_home') },
    { to: '/analyze', icon: Shield, label: t('nav_check') },
    { to: '/graph', icon: Network, label: t('nav_graph') },
    { to: '/compare', icon: GitCompare, label: 'Compare' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-xs">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 leading-none">
                <span className="gradient-text">Rakshak</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Cyber Financial Defense</span>
            </div>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SEBI DB Live
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={`flex items-center gap-1.5 transition-all ${active(to)}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}

          {/* Emergency 1930 Hotline Badge */}
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all shadow-xs hover:scale-105 ml-1"
            title="National Cybercrime Reporting Portal - Golden Hour Rapid Action"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            <span>1930 Helpline</span>
          </a>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          <LanguageSelector variant="navbar" />

          <Link
            to="/analyze"
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-orange-500/20 border border-orange-500/30"
          >
            {t('nav_check_btn')}
          </Link>
        </div>

        {/* Mobile: language + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="tel:1930"
            className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold"
          >
            1930
          </a>
          <LanguageSelector variant="navbar" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-2xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    loc.pathname === to
                      ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
              <Link
                to="/analyze"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 mt-2 w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-orange-600/20"
              >
                <Shield className="w-4 h-4" />
                {t('nav_check_btn')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

