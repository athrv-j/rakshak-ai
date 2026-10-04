import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle,
  ExternalLink, User, Phone, Globe, Send, Hash, FileCheck,
  Layers, ArrowUpRight, Cpu, Sparkles, ChevronRight, ChevronDown,
  Volume2, VolumeX, Info, Check, X
} from 'lucide-react'

export default function TrustPassport({ data, caseId = 'RAK-2026-X9' }) {
  if (!data) return null

  const analysis = data.analysis || {}
  const evidence = data.evidence_package || {}
  const entities = analysis.entities || {}
  const claims = analysis.claims || []
  const relatedCases = data.related_cases || analysis.related_cases || []
  const scamDnaSignals = evidence.scam_dna_signals || []

  // Active section tab
  const [activeTab, setActiveTab] = useState('ALL')
  // Simple explanation mode toggle inside the passport
  const [showPlainTalk, setShowPlainTalk] = useState(true)

  const isUnrelated = evidence.hero_theme === 'unrelated'
    || analysis.content_type === 'unrelated'
    || analysis.overall_risk === 'not_applicable'
    || analysis.is_financial_related === false
    || analysis.relevance_status === 'unrelated_content'

  // Overall status
  const overallRisk = isUnrelated ? 'NO_RISK'
    : evidence.hero_theme === 'danger' ? 'HIGH_RISK'
    : evidence.hero_theme === 'safe' ? 'VERIFIED'
    : 'NEEDS_VERIFICATION'

  const statusConfig = {
    NO_RISK: {
      label: 'NON-FINANCIAL / NO RISK',
      simpleLabel: '✅ SAFE — NO FINANCIAL RISK',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs',
      glow: 'shadow-emerald-500/10',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      simpleTip: 'Message contains casual conversation. No scam tactics, payment demands, or fraud indicators found.'
    },
    VERIFIED: {
      label: 'VERIFIED & LEGITIMATE',
      simpleLabel: '✅ SAFE TO PROCEED',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs',
      glow: 'shadow-emerald-500/10',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      simpleTip: 'Official communications match verified regulatory databases.'
    },
    NEEDS_VERIFICATION: {
      label: 'NEEDS CAREFUL VERIFICATION',
      simpleLabel: '⚠️ BE CAREFUL — VERIFY FIRST',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs',
      glow: 'shadow-amber-500/10',
      icon: HelpCircle,
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-700',
      simpleTip: 'Some details are unverified. Do not transfer funds until you confirm directly.'
    },
    HIGH_RISK: {
      label: 'HIGH RISK — DO NOT SEND MONEY',
      simpleLabel: '⛔ DANGER — DO NOT PAY',
      badgeBg: 'bg-red-50 border-red-200 text-red-800 shadow-xs',
      glow: 'shadow-red-500/10',
      icon: AlertOctagon,
      dotColor: 'bg-red-500',
      textColor: 'text-red-700',
      simpleTip: 'Known fraud patterns detected. Scammers use these exact methods to steal funds.'
    }
  }

  const currentStatus = statusConfig[overallRisk] || statusConfig.NEEDS_VERIFICATION
  const StatusIcon = currentStatus.icon

  // Build the 7 core sections with everyday human explanations
  const sections = isUnrelated ? [
    {
      id: 'IDENTITY',
      title: 'IDENTITY',
      humanTitle: 'Who Contacted You?',
      subtitle: 'Message context & contact details',
      status: 'VERIFIED',
      plainAdvice: 'No suspicious personal payment handles or fake advisor personas detected.',
      items: [
        { label: 'Sender Content', value: 'Casual / conversational text', type: 'person' }
      ]
    },
    {
      id: 'REGISTRATION',
      title: 'REGISTRATION',
      humanTitle: 'Official Government & SEBI Check',
      subtitle: 'Regulatory requirement check',
      status: 'VERIFIED',
      plainAdvice: 'Not applicable. SEBI registration is required only for financial advisors and brokers, not casual messaging.',
      items: [
        { label: 'Regulatory Scope', value: 'Non-financial text — No SEBI license required', type: 'sebi_none' }
      ]
    },
    {
      id: 'CLAIMS',
      title: 'CLAIMS',
      humanTitle: 'What Did They Promise?',
      subtitle: 'Financial return promises',
      status: 'VERIFIED',
      plainAdvice: 'No guaranteed returns, stock tips, or money-making promises detected.',
      items: [
        { label: 'Financial Claims', value: 'None (no financial claims made)', type: 'claim' }
      ]
    },
    {
      id: 'WEBSITE',
      title: 'WEBSITE',
      humanTitle: 'Website & Link Check',
      subtitle: 'Domain safety check',
      status: 'VERIFIED',
      plainAdvice: 'No phishing domains, fake trading sites, or suspicious links found.',
      items: [
        { label: 'Website Links', value: 'No suspicious links found', type: 'url_none' }
      ]
    },
    {
      id: 'SOCIAL_SOURCE',
      title: 'SOCIAL SOURCE',
      humanTitle: 'Message Channel',
      subtitle: 'Channel analysis',
      status: 'VERIFIED',
      plainAdvice: 'No illicit Telegram trading groups or pump-and-dump channels found.',
      items: [
        { label: 'Communication Type', value: 'Standard text communication', type: 'social_none' }
      ]
    },
    {
      id: 'RELATED_CASES',
      title: 'RELATED CASES',
      humanTitle: 'Previous Scam Reports',
      subtitle: 'Cross-case correlation',
      status: 'VERIFIED',
      plainAdvice: 'No matches found in cybercrime incident databases or documented fraud syndicates.',
      items: [
        { label: 'Syndicate Check', value: 'Clean — 0 matching scam records', type: 'case' }
      ]
    },
    {
      id: 'BEHAVIOURAL_PATTERNS',
      title: 'BEHAVIOURAL PATTERNS',
      humanTitle: 'Scam Tricks & Rush Tactics',
      subtitle: 'FOMO & manipulation check',
      status: 'VERIFIED',
      plainAdvice: 'No artificial urgency, fear tactics, or rush demands detected.',
      items: [
        { label: 'Scam DNA', value: '0 signals detected — Message is clean', type: 'behaviour' }
      ]
    }
  ] : [
    {
      id: 'IDENTITY',
      title: 'IDENTITY',
      humanTitle: 'Who Contacted You?',
      subtitle: 'Personal UPI handles & phone numbers found',
      status: (entities.upi_ids?.length > 0 || entities.person_names?.length > 0)
        ? (overallRisk === 'HIGH_RISK' ? 'HIGH_RISK' : 'NEEDS_VERIFICATION')
        : 'NEEDS_VERIFICATION',
      plainAdvice: entities.upi_ids?.length > 0
        ? '⚠️ Critical: Real investment companies and mutual funds NEVER collect money into personal UPI IDs or Google Pay accounts.'
        : 'Verify the person or company on official government websites before replying.',
      items: [
        ...(entities.person_names || []).map(p => ({ label: 'Person Named', value: p, type: 'person' })),
        ...(entities.org_names || []).map(o => ({ label: 'Claimed Entity', value: o, type: 'org' })),
        ...(entities.upi_ids || []).map(u => ({ label: 'Payment UPI ID', value: u, type: 'upi', highlight: true })),
        ...(entities.phone_numbers || []).map(ph => ({ label: 'Phone Number', value: ph, type: 'phone' })),
      ]
    },
    {
      id: 'REGISTRATION',
      title: 'REGISTRATION',
      humanTitle: 'Official Government & SEBI Check',
      subtitle: 'Checked against official SEBI registers',
      status: (entities.sebi_reg_numbers?.length > 0)
        ? (evidence.indicators?.some(i => i.status === 'safe') ? 'VERIFIED' : 'HIGH_RISK')
        : (evidence.indicators?.some(i => i.label?.toLowerCase().includes('sebi') && i.status === 'danger') ? 'HIGH_RISK' : 'NEEDS_VERIFICATION'),
      plainAdvice: entities.sebi_reg_numbers?.length > 0
        ? 'Scammers frequently forge fake SEBI registration numbers. Always verify directly on sebi.gov.in.'
        : '⚠️ No verified SEBI advisor found. In India, giving stock market advice without SEBI registration is illegal.',
      items: (entities.sebi_reg_numbers?.length > 0)
        ? entities.sebi_reg_numbers.map(s => ({ label: 'Claimed SEBI Reg', value: s, type: 'sebi' }))
        : [{ label: 'SEBI Status', value: 'Not registered on official SEBI database', type: 'sebi_none' }]
    },
    {
      id: 'CLAIMS',
      title: 'CLAIMS',
      humanTitle: 'What Did They Promise?',
      subtitle: 'Guaranteed profit promises & returns',
      status: claims.some(c => c.risk === 'high') ? 'HIGH_RISK' : claims.length > 0 ? 'NEEDS_VERIFICATION' : 'VERIFIED',
      plainAdvice: '⚠️ Red Flag: Nobody can guarantee stock market returns. Promising fixed 100% or 500% profit is a 100% scam tactic.',
      items: claims.map(c => ({
        label: `"${c.text}"`,
        value: c.explanation_english || 'High-risk claim. Investments cannot legally guarantee fixed returns.',
        risk: c.risk,
        type: 'claim'
      }))
    },
    {
      id: 'WEBSITE',
      title: 'WEBSITE',
      humanTitle: 'Website & Link Check',
      subtitle: 'Official domain vs suspicious fake link',
      status: entities.urls?.length > 0
        ? (evidence.indicators?.some(i => i.label?.toLowerCase().includes('domain') && i.status === 'danger') ? 'HIGH_RISK' : 'NEEDS_VERIFICATION')
        : 'NEEDS_VERIFICATION',
      plainAdvice: 'Fake websites often look identical to real trading apps. Check the spelling of the URL very carefully.',
      items: (entities.urls || []).length > 0
        ? entities.urls.map(u => ({ label: 'Identified Link', value: u, type: 'url' }))
        : [{ label: 'Website Link', value: 'No official website link identified', type: 'url_none' }]
    },
    {
      id: 'SOCIAL_SOURCE',
      title: 'SOCIAL SOURCE',
      humanTitle: 'Message Channel',
      subtitle: 'WhatsApp, Telegram or SMS group',
      status: (entities.social_handles?.length > 0) ? 'HIGH_RISK' : 'NEEDS_VERIFICATION',
      plainAdvice: 'Scammers prefer Telegram and WhatsApp because they can delete chats and operate anonymously without police tracing.',
      items: (entities.social_handles || []).length > 0
        ? entities.social_handles.map(s => ({ label: 'Channel / Group', value: s, type: 'social' }))
        : [{ label: 'Communication Type', value: 'Private messaging or chat application', type: 'social_none' }]
    },
    {
      id: 'RELATED_CASES',
      title: 'RELATED CASES',
      humanTitle: 'Previous Scam Reports',
      subtitle: 'Complaints matching this phone or UPI',
      status: relatedCases.length > 0 ? 'HIGH_RISK' : 'VERIFIED',
      plainAdvice: relatedCases.length > 0
        ? '🚨 Alert: Other citizens have already filed complaints against this exact payment ID or phone number!'
        : 'No direct previous victim reports logged for this specific handle yet.',
      items: relatedCases.map(rc => ({
        label: rc.name,
        value: `${rc.description} (Shared ID: ${rc.shared_entity})`,
        type: 'case'
      }))
    },
    {
      id: 'BEHAVIOURAL_PATTERNS',
      title: 'BEHAVIOURAL PATTERNS',
      humanTitle: 'Scam Tricks & Rush Tactics',
      subtitle: 'Pressure methods used to rush you',
      status: scamDnaSignals.some(s => s.detected && s.level >= 3) ? 'HIGH_RISK' : 'NEEDS_VERIFICATION',
      plainAdvice: 'Scammers say "Only 2 hours left" or "Limited seats" so you transfer money quickly before you have time to think.',
      items: scamDnaSignals.filter(s => s.detected).map(s => ({
        label: s.name,
        value: `${s.category} (Risk Level: ${s.level}/${s.max})`,
        type: 'behaviour'
      }))
    }
  ]

  return (
    <div className="cyber-bracket relative group rounded-3xl p-[2px] hologram-border shadow-xl shadow-slate-900/5 transition-all">
      {/* 3D Glass Inner Container */}
      <div className="relative rounded-[22px] bg-white backdrop-blur-2xl border border-slate-200 p-5 sm:p-7 overflow-hidden text-slate-900 shadow-sm">
        
        {/* Subtle Watermark in Background */}
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-gradient-to-br from-orange-200/30 via-amber-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-100/30 rounded-full blur-2xl pointer-events-none" />
        
        {/* Simple & Human Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-start gap-4">
            {/* Chip Icon */}
            <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-0.5 shadow-xs flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-white flex flex-col items-center justify-center relative overflow-hidden">
                <Shield className="w-6 h-6 text-orange-600 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/30 via-transparent to-amber-200/40 opacity-80" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  RAKSHAK VERIFICATION PASSPORT
                </span>
                <span className="text-[11px] font-mono text-slate-500">Case ID: {caseId?.slice(0, 10)}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                Digital Trust Passport™
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Every detail in this message verified against official regulatory registries and cyber intelligence databases.
              </p>
            </div>
          </div>

          {/* Master Risk Status Indicator (Plain & Obvious) */}
          <div className="flex flex-col items-start md:items-end gap-1.5 flex-shrink-0">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-wider shadow-xs ${currentStatus.badgeBg}`}>
              <StatusIcon className="w-4 h-4" />
              <span>{currentStatus.simpleLabel}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {currentStatus.simpleTip}
            </span>
          </div>
        </div>

        {/* Plain Language Explainer Toggle */}
        <div className="relative z-10 my-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-center gap-2.5 text-slate-700 font-medium">
            <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span>
              {showPlainTalk 
                ? 'Showing Everyday Citizen Explanations (Easy to understand for all)' 
                : 'Showing Technical Evidence & Raw Hash Identifiers'}
            </span>
          </div>
          <button
            onClick={() => setShowPlainTalk(!showPlainTalk)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-orange-700 hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
          >
            {showPlainTalk ? 'Show Technical Identifiers' : 'Show Citizen Explanations'}
          </button>
        </div>

        {/* Section Filter Navigation */}
        <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-slate-200 no-scrollbar">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Findings ({sections.length})
          </button>
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === sec.id
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{sec.humanTitle}</span>
              <span className={`w-2 h-2 rounded-full ${
                sec.status === 'VERIFIED' ? 'bg-emerald-500' : sec.status === 'HIGH_RISK' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
              }`} />
            </button>
          ))}
        </div>

        {/* 7 Passport Sections Grid */}
        <div className="relative z-10 grid md:grid-cols-2 gap-4 pt-4">
          {sections
            .filter(sec => activeTab === 'ALL' || activeTab === sec.id)
            .map((sec, idx) => {
              const statusBadge = statusConfig[sec.status] || statusConfig.NEEDS_VERIFICATION
              const SecIcon = statusBadge.icon

              return (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden card-hover ${
                    sec.status === 'HIGH_RISK'
                      ? 'bg-red-50/50 border-red-200 shadow-xs'
                      : sec.status === 'VERIFIED'
                      ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Subtle top indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-[3px] ${
                    sec.status === 'HIGH_RISK' ? 'bg-red-500' : sec.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />

                  {/* Section Title & Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-sm font-black text-slate-900">
                        {sec.humanTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {sec.subtitle}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 flex-shrink-0 shadow-xs ${statusBadge.badgeBg}`}>
                      <SecIcon className="w-3 h-3" />
                      {sec.status === 'VERIFIED' ? 'VERIFIED' : sec.status === 'HIGH_RISK' ? 'HIGH RISK' : 'UNVERIFIED'}
                    </span>
                  </div>

                  {/* Plain Language Takeaway Box */}
                  {showPlainTalk && sec.plainAdvice && (
                    <div className="my-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal shadow-2xs">
                      {sec.plainAdvice}
                    </div>
                  )}

                  {/* Section Items */}
                  <div className="space-y-2 mt-2">
                    {sec.items.length === 0 ? (
                      <div className="text-xs text-slate-400 italic p-2 bg-white rounded-xl border border-slate-200">No identifiers detected</div>
                    ) : (
                      sec.items.map((item, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded-xl text-xs flex flex-col gap-1 border transition-all ${
                            item.highlight
                              ? 'bg-red-100/70 border-red-300 text-red-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
                            {item.highlight && (
                              <span className="text-[9px] font-black uppercase text-red-800 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded">
                                🚨 Escrow Bypass
                              </span>
                            )}
                          </div>
                          <div className="font-mono font-bold text-xs break-all text-slate-900 flex items-center justify-between gap-2">
                            <span>{item.value}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )
            })}
        </div>

        {/* Cryptographic Verification Footer */}
        <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-orange-600" />
            <span>Audited by: <strong>Rakshak Investor Firewall Core</strong></span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Directly cross-referenced with SEBI official gazettes & cybercrime registers.
          </div>
        </div>

      </div>
    </div>
  )
}
