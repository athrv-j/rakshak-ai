import React, { useState, useRef, useEffect } from 'react'
import { Globe2, ChevronDown, Check } from 'lucide-react'
import { useLanguage, LANGUAGES } from '../context/LanguageContext'

export default function LanguageSelector({ variant = 'navbar' }) {
  const { lang, setLang, currentLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 sm:gap-2 rounded-xl transition-all font-medium border text-xs sm:text-sm cursor-pointer shadow-xs ${
          variant === 'pill'
            ? 'px-3 py-1.5 bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100'
            : 'px-3 py-1.5 bg-white/90 border-cardBorder text-stone-700 hover:border-brand-400 hover:bg-stone-50'
        }`}
        title="Change Language / भाषा बदलें"
      >
        <span className="text-base leading-none">{currentLanguage.flag}</span>
        <Globe2 className="w-3.5 h-3.5 text-brand-600" />
        <span className="font-semibold text-stone-800">{currentLanguage.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-cardBorder shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3.5 py-1.5 border-b border-stone-100 text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
            <span>Regional Languages</span>
            <span className="text-brand-600 font-mono">8 Languages</span>
          </div>
          <div className="max-h-80 overflow-y-auto py-1 divide-y divide-stone-100">
            {LANGUAGES.map((l) => {
              const isSelected = l.code === lang
              return (
                <button
                  type="button"
                  key={l.code}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setLang(l.code)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{l.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm">{l.native}</span>
                        <span className="text-[11px] text-stone-400 font-normal">({l.name})</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{l.region}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
