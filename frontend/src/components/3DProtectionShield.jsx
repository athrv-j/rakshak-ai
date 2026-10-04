import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { CreditCard, Smartphone, Award, Globe, Send, FileCheck2, Share2 } from 'lucide-react'

const ORBITAL_NODES = [
  { id: 'upi', label: 'UPI ID', icon: CreditCard, angle: 0, radius: 155, speed: 0.007, color: 'text-rose-600', bg: 'bg-rose-50/95', border: 'border-rose-200' },
  { id: 'phone', label: 'PHONE', icon: Smartphone, angle: 0.9, radius: 175, speed: 0.005, color: 'text-purple-600', bg: 'bg-purple-50/95', border: 'border-purple-200' },
  { id: 'sebi', label: 'SEBI ID', icon: Award, angle: 1.8, radius: 145, speed: 0.006, color: 'text-emerald-700', bg: 'bg-emerald-50/95', border: 'border-emerald-200' },
  { id: 'website', label: 'WEBSITE', icon: Globe, angle: 2.7, radius: 165, speed: 0.008, color: 'text-sky-600', bg: 'bg-sky-50/95', border: 'border-sky-200' },
  { id: 'telegram', label: 'TELEGRAM', icon: Send, angle: 3.6, radius: 150, speed: 0.006, color: 'text-blue-600', bg: 'bg-blue-50/95', border: 'border-blue-200' },
  { id: 'claim', label: 'CLAIM', icon: FileCheck2, angle: 4.5, radius: 170, speed: 0.007, color: 'text-amber-700', bg: 'bg-amber-50/95', border: 'border-amber-200' },
  { id: 'social', label: 'SOCIAL', icon: Share2, angle: 5.4, radius: 160, speed: 0.005, color: 'text-emerald-600', bg: 'bg-emerald-50/95', border: 'border-emerald-200' },
]

export default function ProtectionShield3D() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const nodeRefs = useRef({})
  const [activeNode, setActiveNode] = useState(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.05 })
    observer.observe(container)

    let width = container.clientWidth || 360
    let height = container.clientHeight || 360

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 7.5

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4)
    scene.add(ambientLight)

    const orangeKeyLight = new THREE.DirectionalLight(0xea580c, 3.0)
    orangeKeyLight.position.set(5, 5, 5)
    scene.add(orangeKeyLight)

    const amberFillLight = new THREE.PointLight(0xf59e0b, 2.2, 12)
    amberFillLight.position.set(-4, -2, 3)
    scene.add(amberFillLight)

    // 3. Shield Geometry
    const shieldShape = new THREE.Shape()
    shieldShape.moveTo(-1.3, 1.3)
    shieldShape.lineTo(0, 1.55)
    shieldShape.lineTo(1.3, 1.3)
    shieldShape.bezierCurveTo(1.4, 0.6, 1.3, -0.4, 0.8, -1.2)
    shieldShape.lineTo(0, -1.95)
    shieldShape.lineTo(-0.8, -1.2)
    shieldShape.bezierCurveTo(-1.3, -0.4, -1.4, 0.6, -1.3, 1.3)

    const extrudeSettings = {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.06,
    }

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings)
    shieldGeo.center()

    // High performance standard material
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.15,
      transparent: true,
      opacity: 0.94,
    })

    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat)
    scene.add(shieldMesh)

    // Glowing orange wireframe edges
    const edgesGeo = new THREE.EdgesGeometry(shieldGeo, 24)
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xea580c,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.8,
    })
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat)
    shieldMesh.add(edgesMesh)

    // Subtle Orbital Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    })

    const ring1 = new THREE.Mesh(new THREE.RingGeometry(2.35, 2.37, 48), ringMat)
    ring1.rotation.x = Math.PI / 2.3
    scene.add(ring1)

    // Interactive Mouse Rotation
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouseRef.current.targetX = x * 0.35
      mouseRef.current.targetY = y * 0.28
    }

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0
      mouseRef.current.targetY = 0
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    // Animation Loop without React state updates
    let animationFrameId
    let clock = new THREE.Clock()
    const nodesState = ORBITAL_NODES.map(n => ({ ...n }))

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (document.hidden || !isVisible) {
        return
      }

      const elapsed = clock.getElapsedTime()

      // Smooth lerp mouse rotation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08

      // Float & rotate shield
      shieldMesh.rotation.y = Math.sin(elapsed * 0.7) * 0.1 + mouseRef.current.x
      shieldMesh.rotation.x = Math.cos(elapsed * 0.6) * 0.06 - mouseRef.current.y
      shieldMesh.position.y = Math.sin(elapsed * 1.2) * 0.07

      // Direct DOM transformation for orbital badges (ZERO React re-renders)
      for (let i = 0; i < nodesState.length; i++) {
        const node = nodesState[i]
        node.angle += node.speed
        const x3d = Math.cos(node.angle) * (node.radius / 70)
        const z3d = Math.sin(node.angle) * (node.radius / 70)
        const y3d = Math.sin(node.angle * 2 + elapsed) * 0.35

        const v = new THREE.Vector3(x3d, y3d, z3d)
        v.project(camera)

        const screenX = (v.x * 0.5 + 0.5) * width
        const screenY = (-(v.y * 0.5) + 0.5) * height
        const scale = THREE.MathUtils.lerp(0.85, 1.05, (v.z + 1) * 0.5)
        const opacity = THREE.MathUtils.lerp(0.55, 1.0, (v.z + 1) * 0.5)
        const isBehind = v.z > 0.88

        const el = nodeRefs.current[node.id]
        if (el) {
          el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(2)})`
          el.style.opacity = isBehind ? '0.35' : opacity.toFixed(2)
          el.style.zIndex = Math.round((1 - v.z) * 100)
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return
      width = container.clientWidth || 360
      height = container.clientHeight || 360
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      shieldGeo.dispose()
      shieldMat.dispose()
      edgesGeo.dispose()
      edgesMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[420px] h-[340px] sm:h-[390px] mx-auto select-none flex items-center justify-center overflow-hidden"
    >
      {/* Three.js 3D Shield Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Radiant ambient glow behind shield */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-transparent blur-3xl -z-10" />
      </div>

      {/* Floating 3D Data Nodes rendered once and updated via direct transforms */}
      {ORBITAL_NODES.map((node) => {
        const Icon = node.icon
        const isActive = activeNode === node.id

        return (
          <div
            key={node.id}
            ref={(el) => (nodeRefs.current[node.id] = el)}
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
            className={`absolute top-0 left-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md cursor-pointer will-change-transform ${node.bg} ${node.border} ${node.color} ${
              isActive ? 'scale-110 shadow-md ring-2 ring-orange-500/30' : ''
            }`}
            style={{
              transform: 'translate3d(-1000px, -1000px, 0)',
              transition: 'box-shadow 0.15s ease',
            }}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-[10px] font-bold tracking-wider">{node.label}</span>
          </div>
        )
      })}

      {/* Status indicator bottom badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-orange-200/80 shadow-xs backdrop-blur-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-semibold text-stone-700">Financial Protection Core Active</span>
      </div>
    </div>
  )
}
