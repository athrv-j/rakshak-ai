import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Network, X, Info, Shield, CheckCircle2, AlertTriangle,
  Play, Sparkles, RefreshCw, ZoomIn, ZoomOut, Layers, ExternalLink
} from 'lucide-react'

const TYPE_COLORS_3D = {
  case: 0xea580c,         // Orange
  current_case: 0xe11d48, // Crimson Red (pulse)
  central: 0xe11d48,
  upi: 0xdc2626,          // Red
  phone: 0x9333ea,        // Purple
  domain: 0x0284c7,       // Blue
  social: 0x059669,       // Green
  claim: 0xd97706,        // Amber
  unknown: 0x78716c,
}

const TYPE_NAMES = {
  case: 'Documented Case',
  current_case: 'Your Submission',
  central: 'Your Submission',
  upi: 'Payment UPI ID',
  phone: 'Phone Contact',
  domain: 'Website / Domain',
  social: 'Social / Channel',
  claim: 'Deceptive Claim',
  unknown: 'Entity',
}

// Fallback demo graph if no graph data is passed
const DEFAULT_NODES = [
  { id: 'curr', label: 'Current Suspicious Case', type: 'central', evidence: 'Your Input', reason: 'Analyzing submitted message', confidence: 'High Risk' },
  { id: 'upi1', label: 'UPI: abcinvest@xyz', type: 'upi', evidence: 'User-Reported', reason: 'Direct payment target in message', confidence: 'High' },
  { id: 'phone1', label: 'Phone: +91 98765 43210', type: 'phone', evidence: 'Verified Extraction', reason: 'Sender phone in SMS header', confidence: 'Verified' },
  { id: 'tg1', label: 'Telegram: @ABCInvestOfficial', type: 'social', evidence: 'User-Reported', reason: 'Channel invite link', confidence: 'High' },
  { id: 'web1', label: 'Domain: abc-invest.com', type: 'domain', evidence: 'Whois / Domain Record', reason: 'Freshly registered domain (4 days)', confidence: 'Verified' },
  { id: 'case17', label: 'Linked Case #017 (Mumbai Cyber)', type: 'case', evidence: 'Cross-Case Linked', reason: 'Shares exact UPI ID: abcinvest@xyz', confidence: 'Deterministic Match', description: 'Fake institutional trading syndicate targeting senior citizens' },
  { id: 'sebi_fake', label: 'Fake SEBI Reg: INH000FAKE1', type: 'claim', evidence: 'SEBI Intermediary Registry', reason: 'Registration number nonexistent on SEBI', confidence: 'Verified Fraud' },
]

const DEFAULT_LINKS = [
  { source: 'curr', target: 'upi1', type: 'verified' },
  { source: 'curr', target: 'phone1', type: 'verified' },
  { source: 'curr', target: 'tg1', type: 'user' },
  { source: 'curr', target: 'web1', type: 'verified' },
  { source: 'curr', target: 'sebi_fake', type: 'ai' },
  { source: 'upi1', target: 'case17', type: 'verified' },
]

// 3D Organic Cluster Layout Generator
function layoutGraph3D(rawNodes, rawLinks) {
  if (!rawNodes || rawNodes.length === 0) return { nodes: [], links: [] }

  const nodes = rawNodes.map(n => ({ ...n }))
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  const cases = nodes.filter(n => n.type === 'case' || n.type === 'current_case' || n.type === 'central')
  const others = nodes.filter(n => n.type !== 'case' && n.type !== 'current_case' && n.type !== 'central')

  // 1. Position Case Hubs in 3D Space
  const caseRadius = cases.length > 1 ? Math.min(4.8, 2.5 + cases.length * 0.4) : 0
  cases.forEach((c, idx) => {
    if (c.type === 'current_case' || c.type === 'central' || idx === 0) {
      c.x = 0; c.y = 0; c.z = 0
    } else {
      const angle = (idx / Math.max(1, cases.length)) * Math.PI * 2
      const elevation = ((idx % 2 === 0 ? 1 : -1) * 0.8)
      c.x = Math.cos(angle) * caseRadius
      c.y = elevation
      c.z = Math.sin(angle) * caseRadius
    }
  })

  // 2. Identify Parents of each Entity Node
  const entityParents = new Map()
  rawLinks.forEach(l => {
    const sId = typeof l.source === 'object' ? l.source.id : l.source
    const tId = typeof l.target === 'object' ? l.target.id : l.target
    const sNode = nodeMap.get(sId)
    const tNode = nodeMap.get(tId)

    if (sNode && tNode) {
      if ((sNode.type === 'case' || sNode.type === 'current_case' || sNode.type === 'central') && tNode.type !== 'case') {
        if (!entityParents.has(tId)) entityParents.set(tId, [])
        entityParents.get(tId).push(sNode)
      } else if ((tNode.type === 'case' || tNode.type === 'current_case' || tNode.type === 'central') && sNode.type !== 'case') {
        if (!entityParents.has(sId)) entityParents.set(sId, [])
        entityParents.get(sId).push(tNode)
      }
    }
  })

  // 3. Orbit Entities around parents, placing shared entities between clusters
  others.forEach((ent, idx) => {
    const parents = entityParents.get(ent.id) || []
    if (parents.length === 1) {
      const p = parents[0]
      const subAngle = (idx * 1.35) % (Math.PI * 2)
      const phi = (idx * 0.75) % Math.PI
      const dist = 1.5 + (idx % 3) * 0.35
      ent.x = p.x + Math.sin(phi) * Math.cos(subAngle) * dist
      ent.y = p.y + Math.cos(phi) * dist * 0.65
      ent.z = p.z + Math.sin(phi) * Math.sin(subAngle) * dist
    } else if (parents.length > 1) {
      // Shared entity (bridge)
      let avgX = 0, avgY = 0, avgZ = 0
      parents.forEach(p => { avgX += p.x; avgY += p.y; avgZ += p.z })
      ent.x = avgX / parents.length
      ent.y = (avgY / parents.length) + 0.35
      ent.z = (avgZ / parents.length) + 0.55
    } else {
      // Unlinked
      const angle = (idx / Math.max(1, others.length)) * Math.PI * 2
      ent.x = Math.cos(angle) * 3.8
      ent.y = (idx % 2 === 0 ? 1 : -1) * 1.2
      ent.z = Math.sin(angle) * 3.8
    }
  })

  return { nodes, links: rawLinks }
}

export default function ScamDNAGraph3D({ graphData = null, currentId = null, height = 480, title = 'Interactive 3D Scam DNA Network' }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [liveSimActive, setLiveSimActive] = useState(false)
  const [simStep, setSimStep] = useState('')
  const [screenLabels, setScreenLabels] = useState([])
  
  const cameraRef = useRef(null)
  const controlsRef = useRef({ isDown: false, prevX: 0, prevY: 0, rotX: 0.25, rotY: 0.45, dist: 9.5 })

  // Prepare & position 3D nodes
  const layoutedData = useMemo(() => {
    const rawNodes = graphData?.nodes?.length ? graphData.nodes : DEFAULT_NODES
    const rawLinks = graphData?.links?.length ? graphData.links : DEFAULT_LINKS
    return layoutGraph3D(rawNodes, rawLinks)
  }, [graphData])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let width = container.clientWidth || 700
    let h = height || 480

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xfaf8f5)

    const camera = new THREE.PerspectiveCamera(50, width / h, 0.1, 1000)
    camera.position.set(0, 2, 9.5)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 2. Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambLight)

    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.0)
    dirLight.position.set(6, 12, 8)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xea580c, 2.2, 20)
    pointLight.position.set(0, 0, 4)
    scene.add(pointLight)

    // 3. Node Meshes
    const nodeMeshes = []
    const nodeMap = new Map()
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24)

    layoutedData.nodes.forEach((n) => {
      const isCurrent = n.id === currentId || n.type === 'current_case' || n.type === 'central'
      const isCase = n.type === 'case'
      const colorHex = isCurrent ? TYPE_COLORS_3D.current_case : (TYPE_COLORS_3D[n.type] || TYPE_COLORS_3D.unknown)
      
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.25,
        metalness: 0.25,
      })

      const mesh = new THREE.Mesh(sphereGeo, mat)
      const scale = isCurrent ? 0.5 : isCase ? 0.42 : 0.28
      mesh.scale.setScalar(scale)
      mesh.position.set(n.x, n.y, n.z)
      mesh.userData = n
      scene.add(mesh)

      nodeMeshes.push(mesh)
      nodeMap.set(n.id, mesh)

      // Outer glowing halo ring for primary hubs
      if (isCurrent || isCase) {
        const ringGeo = new THREE.RingGeometry(scale * 1.3, scale * 1.6, 32)
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: isCurrent ? 0.6 : 0.35,
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        mesh.add(ring)
      }
    })

    // 4. Connection Lines
    const lineObjects = []
    layoutedData.links.forEach((l) => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source
      const tId = typeof l.target === 'object' ? l.target.id : l.target
      const sMesh = nodeMap.get(sId)
      const tMesh = nodeMap.get(tId)
      if (!sMesh || !tMesh) return

      const points = [sMesh.position.clone(), tMesh.position.clone()]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)

      let lineMat
      if (l.type === 'verified') {
        lineMat = new THREE.LineBasicMaterial({ color: 0x059669, linewidth: 2, transparent: true, opacity: 0.85 })
      } else if (l.type === 'user') {
        lineMat = new THREE.LineDashedMaterial({ color: 0x9333ea, dashSize: 0.25, gapSize: 0.15, transparent: true, opacity: 0.7 })
      } else {
        lineMat = new THREE.LineBasicMaterial({ color: 0xea580c, linewidth: 2, transparent: true, opacity: 0.85 })
      }

      const line = new THREE.Line(lineGeo, lineMat)
      if (l.type === 'user') line.computeLineDistances()
      scene.add(line)
      lineObjects.push({ line, sMesh, tMesh, type: l.type })
    })

    // 5. Data Flow Packets (Glowing Particles Moving Along Lines)
    const packetGeo = new THREE.SphereGeometry(0.06, 12, 12)
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xf97316 })
    const packets = lineObjects.map((lo) => {
      const p = new THREE.Mesh(packetGeo, packetMat)
      scene.add(p)
      return { mesh: p, lineObj: lo, progress: Math.random() }
    })

    // 6. Raycaster for Mouse Hover & Selection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const getRaycastIntersects = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      raycaster.setFromCamera(mouse, camera)
      return raycaster.intersectObjects(nodeMeshes)
    }

    const handleClick = (e) => {
      const intersects = getRaycastIntersects(e)
      if (intersects.length > 0) {
        const clicked = intersects[0].object.userData
        setSelectedNode(clicked)
      } else {
        setSelectedNode(null)
      }
    }

    // 7. Mouse Orbit Drag Controls
    const handleMouseDown = (e) => {
      controlsRef.current.isDown = true
      controlsRef.current.prevX = e.clientX
      controlsRef.current.prevY = e.clientY
    }

    const handleMouseMove = (e) => {
      if (!controlsRef.current.isDown) {
        // Detect hover
        const intersects = getRaycastIntersects(e)
        if (intersects.length > 0) {
          canvas.style.cursor = 'pointer'
          setHoveredNode(intersects[0].object.userData)
        } else {
          canvas.style.cursor = 'grab'
          setHoveredNode(null)
        }
        return
      }

      canvas.style.cursor = 'grabbing'
      const dx = e.clientX - controlsRef.current.prevX
      const dy = e.clientY - controlsRef.current.prevY
      controlsRef.current.prevX = e.clientX
      controlsRef.current.prevY = e.clientY

      controlsRef.current.rotY += dx * 0.007
      controlsRef.current.rotX = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35, controlsRef.current.rotX + dy * 0.007))
    }

    const handleMouseUp = () => {
      controlsRef.current.isDown = false
      canvas.style.cursor = 'grab'
    }

    const handleWheel = (e) => {
      e.preventDefault()
      controlsRef.current.dist = Math.max(4.0, Math.min(18.0, controlsRef.current.dist + e.deltaY * 0.008))
    }

    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel, { passive: false })

    // 8. Animation Loop with 2D Screen Projection for Labels
    let animationFrameId
    let clock = new THREE.Clock()
    const tempVec = new THREE.Vector3()

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      const elapsed = clock.getElapsedTime()

      // Orbital Camera
      const dist = controlsRef.current.dist
      const rotX = controlsRef.current.rotX
      const rotY = controlsRef.current.rotY + (controlsRef.current.isDown ? 0 : 0.0018) // gentle idle rotate
      controlsRef.current.rotY = rotY

      camera.position.x = dist * Math.sin(rotY) * Math.cos(rotX)
      camera.position.y = dist * Math.sin(rotX)
      camera.position.z = dist * Math.cos(rotY) * Math.cos(rotX)
      camera.lookAt(0, 0, 0)

      // Move data flow packets
      packets.forEach((pkt) => {
        pkt.progress = (pkt.progress + 0.008) % 1
        const s = pkt.lineObj.sMesh.position
        const t = pkt.lineObj.tMesh.position
        pkt.mesh.position.lerpVectors(s, t, pkt.progress)
      })

      // Project key node positions to 2D screen coordinates for badges
      const labels = []
      layoutedData.nodes.forEach((n) => {
        // Show labels for cases or selected/hovered nodes
        const isCase = n.type === 'case' || n.type === 'current_case' || n.type === 'central'
        if (isCase || n.id === selectedNode?.id || n.id === hoveredNode?.id) {
          tempVec.set(n.x, n.y, n.z)
          tempVec.project(camera)

          // Only if in front of camera
          if (tempVec.z < 1) {
            const x = (tempVec.x * 0.5 + 0.5) * width
            const y = (-(tempVec.y * 0.5) + 0.5) * h
            labels.push({
              id: n.id,
              label: n.label || n.id,
              type: n.type,
              x,
              y,
              isCase,
              isSelected: n.id === selectedNode?.id,
            })
          }
        }
      })
      setScreenLabels(labels)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!container || !renderer) return
      width = container.clientWidth || 700
      h = height || 480
      camera.aspect = width / h
      camera.updateProjectionMatrix()
      renderer.setSize(width, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('wheel', handleWheel)
      renderer.dispose()
    }
  }, [layoutedData, currentId, height, selectedNode, hoveredNode])

  // Live Connection Simulation
  const runLiveSimulation = () => {
    if (liveSimActive) return
    setLiveSimActive(true)

    setSimStep('1. Querying Central Identifier: UPI abcinvest@xyz...')
    setTimeout(() => {
      setSimStep('2. Searching SEBI & Cybercrime Syndicate databases...')
      setTimeout(() => {
        setSimStep('3. Cross-Case Match Found! Linked with Mumbai Case #017')
        setTimeout(() => {
          setLiveSimActive(false)
          setSimStep('')
          // Auto select Case #017
          const match = layoutedData.nodes.find(n => n.id === 'case17' || n.type === 'case')
          if (match) setSelectedNode(match)
        }, 2200)
      }, 1800)
    }, 1500)
  }

  const handleZoom = (delta) => {
    controlsRef.current.dist = Math.max(4.0, Math.min(18.0, controlsRef.current.dist + delta))
  }

  const handleResetCamera = () => {
    controlsRef.current.rotX = 0.25
    controlsRef.current.rotY = 0.45
    controlsRef.current.dist = 9.5
  }

  return (
    <div ref={containerRef} className="relative w-full bg-[#faf8f5] rounded-2xl overflow-hidden border border-stone-200" style={{ height }}>
      
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Floating 2D Screen Projected Badges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {screenLabels.map((lbl) => (
          <div
            key={lbl.id}
            style={{
              position: 'absolute',
              left: `${lbl.x}px`,
              top: `${lbl.y}px`,
              transform: 'translate(-50%, -135%)',
            }}
            className={`transition-all duration-75 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-xs ${
              lbl.isSelected
                ? 'bg-orange-600 text-white ring-2 ring-orange-400'
                : lbl.isCase
                ? 'bg-stone-900/90 text-white backdrop-blur-xs'
                : 'bg-white/95 text-stone-800 border border-stone-300'
            }`}
          >
            {lbl.label.slice(0, 20)}
          </div>
        ))}
      </div>

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Status / Live Match Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={runLiveSimulation}
            disabled={liveSimActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
              liveSimActive
                ? 'bg-orange-500 text-white border-orange-600 animate-pulse'
                : 'bg-white/95 text-stone-800 border-stone-300 hover:border-orange-500 hover:bg-orange-50/50'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
            <span>{liveSimActive ? 'Scanning Syndicates…' : 'Simulate Live Match'}</span>
          </button>
        </div>

        {/* Camera Controls */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-xs pointer-events-auto">
          <button
            onClick={() => handleZoom(-1.5)}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.5)}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors cursor-pointer"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Simulation Status Pill */}
      <AnimatePresence>
        {simStep && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 pointer-events-none z-30"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{simStep}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend at bottom left */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 text-[11px] font-semibold text-stone-700 shadow-xs pointer-events-none">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" /> Case</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" /> UPI</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#9333ea]" /> Phone</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> Domain</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Social</span>
      </div>

      {/* Click-to-Focus Node Inspection Drawer */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-3 right-3 max-w-sm w-[90%] sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-300 shadow-2xl p-4 text-xs z-30 pointer-events-auto"
          >
            <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                  {TYPE_NAMES[selectedNode.type] || selectedNode.type}
                </span>
                <h4 className="font-bold text-sm text-stone-900 mt-1 break-all">
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

            <div className="space-y-1.5 text-stone-600">
              {selectedNode.description && (
                <p className="text-stone-700 leading-relaxed font-normal">
                  {selectedNode.description}
                </p>
              )}
              {selectedNode.evidence && (
                <div>
                  <span className="text-stone-500 font-semibold">Evidence: </span>
                  <span className="text-stone-800">{selectedNode.evidence}</span>
                </div>
              )}
              {selectedNode.reason && (
                <div>
                  <span className="text-stone-500 font-semibold">Reason: </span>
                  <span className="text-stone-800">{selectedNode.reason}</span>
                </div>
              )}
              {selectedNode.confidence && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-stone-500 font-semibold">Strength:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedNode.confidence}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
