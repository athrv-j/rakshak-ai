import { useRef, useEffect, useState, useCallback } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { ZoomIn, ZoomOut, RefreshCw, X, Shield, ExternalLink, Info } from 'lucide-react'

const NODE_COLORS = {
  case:         '#ea580c',
  current_case: '#e11d48',
  central:      '#e11d48',
  upi:          '#dc2626',
  phone:        '#7c3aed',
  domain:       '#0284c7',
  social:       '#059669',
  claim:        '#d97706',
  unknown:      '#78716c',
}

const TYPE_NAMES = {
  case: 'Documented Case',
  current_case: 'Your Analysis',
  central: 'Your Analysis',
  upi: 'Payment UPI',
  phone: 'Phone Contact',
  domain: 'Website / Domain',
  social: 'Social / Channel',
  claim: 'Financial Claim',
  unknown: 'Entity',
}

export default function ScamDNAGraph({ graphData, currentId, height = 440 }) {
  const fgRef = useRef(null)
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ w: 600, h: height })
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.offsetWidth, h: height })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [height])

  // Configure physics forces so nodes spread out and don't clump
  useEffect(() => {
    if (fgRef.current) {
      // Repulsion between nodes
      const charge = fgRef.current.d3Force('charge')
      if (charge) charge.strength(-240)
      
      // Distance between connected nodes
      const link = fgRef.current.d3Force('link')
      if (link) link.distance(65)
    }
  }, [graphData])

  // Center and fit when data loads or physics finishes
  const handleEngineStop = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 35)
    }
  }, [])

  if (!graphData?.nodes?.length) return (
    <div className="p-8 text-center text-stone-500 text-sm">
      No graph data available.
    </div>
  )

  // Highlight nodes connected to current case or selected node
  const focusId = selectedNode?.id || currentId
  const connectedIds = new Set(focusId ? [focusId] : [])
  if (focusId) {
    graphData.links?.forEach(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target
      if (srcId === focusId) connectedIds.add(tgtId)
      if (tgtId === focusId) connectedIds.add(srcId)
    })
  }

  const handleZoomIn = () => {
    if (fgRef.current) fgRef.current.zoom(fgRef.current.zoom() * 1.35, 300)
  }

  const handleZoomOut = () => {
    if (fgRef.current) fgRef.current.zoom(fgRef.current.zoom() / 1.35, 300)
  }

  const handleReset = () => {
    if (fgRef.current) {
      setSelectedNode(null)
      fgRef.current.zoomToFit(500, 35)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full bg-[#faf8f5] overflow-hidden rounded-2xl border border-stone-200" style={{ height: dims.h }}>
      
      {/* Zoom / Reset Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-sm">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors cursor-pointer"
          title="Reset View"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 text-[11px] font-semibold text-stone-700 shadow-xs pointer-events-none">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" /> Case</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" /> UPI</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" /> Phone</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> Domain</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Social</span>
      </div>

      {/* Interactive 2D Graph */}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dims.w}
        height={dims.h}
        backgroundColor="#faf8f5"
        onEngineStop={handleEngineStop}
        cooldownTicks={120}
        warmupTicks={40}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        
        // Link Rendering
        linkColor={l => {
          const srcId = typeof l.source === 'object' ? l.source.id : l.source
          const tgtId = typeof l.target === 'object' ? l.target.id : l.target
          if (focusId && (srcId === focusId || tgtId === focusId)) return 'rgba(234, 88, 12, 0.9)'
          return 'rgba(200, 190, 175, 0.55)'
        }}
        linkWidth={l => {
          const srcId = typeof l.source === 'object' ? l.source.id : l.source
          const tgtId = typeof l.target === 'object' ? l.target.id : l.target
          if (focusId && (srcId === focusId || tgtId === focusId)) return 2.5
          return 1.2
        }}
        linkDirectionalParticles={l => {
          const srcId = typeof l.source === 'object' ? l.source.id : l.source
          const tgtId = typeof l.target === 'object' ? l.target.id : l.target
          return (focusId && (srcId === focusId || tgtId === focusId)) ? 3 : 0
        }}
        linkDirectionalParticleWidth={1.8}
        linkDirectionalParticleColor={() => '#ea580c'}

        // Node Canvas Rendering: Clean, Crisp, Never Cluttered
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return

          const isFocus = node.id === focusId
          const isHover = node.id === hoveredNode?.id
          const isConnected = connectedIds.has(node.id)
          const isCase = node.type === 'case' || node.type === 'current_case' || node.type === 'central'
          
          // Radii
          const r = isFocus ? 9 : isCase ? 7.5 : (isHover ? 6 : 4.5)
          const color = node.id === currentId ? '#e11d48' : (NODE_COLORS[node.type] || '#78716c')

          // Halo glow for focused or connected nodes
          if (isFocus || isHover || (focusId && isConnected)) {
            ctx.beginPath()
            ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI)
            ctx.fillStyle = isFocus ? 'rgba(234, 88, 12, 0.35)' : 'rgba(234, 88, 12, 0.15)'
            ctx.fill()
          }

          // Node Circle
          ctx.beginPath()
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
          ctx.fillStyle = color
          ctx.fill()
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.5
          ctx.stroke()

          // SMART LABEL RENDERING:
          // 1. Primary Hubs (Cases) ALWAYS display their title pill cleanly
          // 2. Focused / Clicked node ALWAYS displays its label
          // 3. Hovered node displays its label
          // 4. Peripheral nodes only display if zoomed in deeply (globalScale > 2.4)
          // This prevents overlapping black clutter while keeping everything accessible!
          const showLabel = isCase || isFocus || isHover || (globalScale >= 2.4)

          if (showLabel) {
            const rawLabel = node.label || node.id || ''
            const label = isCase ? rawLabel.slice(0, 22) : rawLabel.slice(0, 20)
            const fontSize = isCase ? 11 : 9.5

            ctx.font = `${isCase || isFocus ? '700' : '600'} ${fontSize}px Inter, sans-serif`
            const textWidth = ctx.measureText(label).width
            const padX = 6
            const padY = 3
            const bgWidth = textWidth + padX * 2
            const bgHeight = fontSize + padY * 2
            const posY = node.y + r + 4

            // Clean background pill
            ctx.beginPath()
            ctx.roundRect(node.x - bgWidth / 2, posY, bgWidth, bgHeight, 4)
            ctx.fillStyle = isFocus
              ? 'rgba(234, 88, 12, 0.95)'
              : isCase
              ? 'rgba(30, 27, 25, 0.88)'
              : 'rgba(255, 255, 255, 0.94)'
            ctx.fill()

            if (!isFocus && !isCase) {
              ctx.strokeStyle = 'rgba(210, 200, 190, 0.8)'
              ctx.lineWidth = 0.5
              ctx.stroke()
            }

            ctx.fillStyle = (isFocus || isCase) ? '#ffffff' : '#1c1917'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(label, node.x, posY + bgHeight / 2)
          }
        }}

        // Exact Hitbox for Hover & Click
        nodePointerAreaPaint={(node, color, ctx) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return
          const r = node.type === 'case' ? 14 : 10
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
          ctx.fill()
        }}

        onNodeClick={node => {
          setSelectedNode(node)
          if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 400)
          }
        }}
        onNodeHover={node => setHoveredNode(node)}
      />

      {/* Floating Hover Tooltip (When mouse hovers over ANY entity) */}
      {hoveredNode && !selectedNode && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-stone-900/90 text-white px-3 py-1.5 rounded-xl shadow-lg text-xs pointer-events-none flex items-center gap-2 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: NODE_COLORS[hoveredNode.type] || '#fff' }} />
          <span className="text-stone-300 font-medium">{TYPE_NAMES[hoveredNode.type] || hoveredNode.type}:</span>
          <span className="font-bold">{hoveredNode.label || hoveredNode.id}</span>
        </div>
      )}

      {/* Node Inspection Drawer (When node is clicked) */}
      {selectedNode && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-xl text-xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                {TYPE_NAMES[selectedNode.type] || selectedNode.type}
              </span>
              <h4 className="text-sm font-bold text-stone-900 mt-1 break-all">
                {selectedNode.label || selectedNode.id}
              </h4>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedNode.description && (
            <p className="text-stone-600 mb-2 leading-relaxed">
              {selectedNode.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>Connections: <strong>{connectedIds.size - 1}</strong></span>
            {selectedNode.reported_count > 0 && (
              <span className="text-red-600 font-bold">
                ⚠️ {selectedNode.reported_count} reports
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
