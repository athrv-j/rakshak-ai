import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import ForceGraph2D from 'react-force-graph-2d'
import { motion } from 'framer-motion'
import { Network, Filter, Info, Box, Layers } from 'lucide-react'
import ScamDNAGraph from '../components/ScamDNAGraph'
import ScamDNAGraph3D from '../components/ScamDNAGraph3D'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const NODE_COLORS = {
  case:         '#ea580c',
  current_case: '#d97706',
  upi:          '#dc2626',
  phone:        '#7c3aed',
  domain:       '#0284c7',
  social:       '#059669',
  unknown:      '#78716c',
}

const NODE_LABELS = {
  case: 'Case', current_case: 'Your Submission', upi: 'UPI ID',
  phone: 'Phone', domain: 'Domain', social: 'Social Handle',
}

export default function FullGraph() {
  const [graphData, setGraphData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [hovered, setHovered] = useState(null)
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [viewMode, setViewMode] = useState('3d')
  const containerRef = useRef(null)

  useEffect(() => {
    axios.get(`${API}/graph/full`)
      .then(r => { setGraphData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.offsetWidth, h: Math.max(500, window.innerHeight - 250) })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const filteredData = graphData ? {
    nodes: activeFilter === 'all'
      ? graphData.nodes
      : graphData.nodes.filter(n => n.type === activeFilter || n.type === 'case'),
    links: graphData.links,
  } : null

  return (
    <div className="min-h-screen px-4 pt-8 pb-20 bg-transparent text-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shadow-xs">
                <Network className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Scam DNA Graph</h1>
                {graphData && (
                  <span className="text-xs text-slate-500 font-medium">
                    {graphData.nodes?.length} nodes · {graphData.links?.length} cross-case connections
                  </span>
                )}
              </div>
            </div>

            {/* View Mode Toggle (3D vs 2D) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-white text-orange-600 shadow-xs border border-orange-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                3D Interactive Network
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === '2d'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                2D Force Graph
              </button>
            </div>
          </div>

          <p className="text-slate-600 text-sm">
            Every node is an extracted entity. Lines show deterministic identifier linkage. Clusters reveal syndicate modus operandi.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            ['all', '🌐 All Entities', 'text-slate-700'],
            ['case', '📁 Cases', 'node-case'],
            ['upi', '💳 UPI IDs', 'node-upi'],
            ['phone', '📞 Phones', 'node-phone'],
            ['domain', '🌐 Domains', 'node-domain'],
            ['social', '📱 Social', 'node-social'],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveFilter(val)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                activeFilter === val
                  ? 'border-orange-300 bg-orange-50 text-orange-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 3D or 2D View Container */}
        <div ref={containerRef} className="cyber-bracket w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center text-slate-500 font-medium" style={{ height: dims.h }}>
              <Network className="w-8 h-8 animate-pulse text-purple-600 mr-3" />
              Building Scam DNA Graph…
            </div>
          ) : viewMode === '3d' ? (
            <ScamDNAGraph3D graphData={filteredData} height={dims.h} />
          ) : (
            <ScamDNAGraph graphData={filteredData} height={dims.h} />
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
          <Info className="w-3.5 h-3.5 text-orange-600" />
          <span>Click any node to focus & inspect · Drag to orbit/pan · Labels are always legible</span>
        </div>
      </div>
    </div>
  )
}
