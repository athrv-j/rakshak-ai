import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { Shield, Smartphone, CreditCard, Globe, Send, Award, FileCheck2, Share2 } from 'lucide-react'

const ORBITAL_NODES = [
  { id: 'upi', label: 'UPI ID', icon: CreditCard, angle: 0, radius: 155, speed: 0.007, color: 'text-rose-600', bg: 'bg-rose-50/90', border: 'border-rose-200' },
  { id: 'phone', label: 'PHONE', icon: Smartphone, angle: 0.9, radius: 175, speed: 0.005, color: 'text-purple-600', bg: 'bg-purple-50/90', border: 'border-purple-200' },
  { id: 'sebi', label: 'SEBI ID', icon: Award, angle: 1.8, radius: 145, speed: 0.006, color: 'text-emerald-700', bg: 'bg-emerald-50/90', border: 'border-emerald-200' },
  { id: 'website', label: 'WEBSITE', icon: Globe, angle: 2.7, radius: 165, speed: 0.008, color: 'text-sky-600', bg: 'bg-sky-50/90', border: 'border-sky-200' },
  { id: 'telegram', label: 'TELEGRAM', icon: Send, angle: 3.6, radius: 150, speed: 0.006, color: 'text-blue-600', bg: 'bg-blue-50/90', border: 'border-blue-200' },
  { id: 'claim', label: 'CLAIM', icon: FileCheck2, angle: 4.5, radius: 170, speed: 0.007, color: 'text-amber-700', bg: 'bg-amber-50/90', border: 'border-amber-200' },
  { id: 'social', label: 'SOCIAL', icon: Share2, angle: 5.4, radius: 160, speed: 0.005, color: 'text-emerald-600', bg: 'bg-emerald-50/90', border: 'border-emerald-200' },
]

export default function ProtectionShield3D() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [nodePositions, setNodePositions] = useState(
    ORBITAL_NODES.map(n => ({ ...n, x: 0, y: 0, z: 0, scale: 1, opacity: 1 }))
  )
  const [activeNode, setActiveNode] = useState(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const width = container.clientWidth || 380
    const height = container.clientHeight || 380

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2)
    scene.add(ambientLight)

    const orangeKeyLight = new THREE.DirectionalLight(0xea580c, 3.5)
    orangeKeyLight.position.set(5, 5, 5)
    scene.add(orangeKeyLight)

    const amberFillLight = new THREE.PointLight(0xf59e0b, 2.8, 12)
    amberFillLight.position.set(-4, -2, 3)
    scene.add(amberFillLight)

    const softBackLight = new THREE.PointLight(0xffedd5, 1.5, 10)
    softBackLight.position.set(0, 0, -4)
    scene.add(softBackLight)

    // 3. Shield Geometry
    const shieldShape = new THREE.Shape()
    // Top flat with subtle peak
    shieldShape.moveTo(-1.3, 1.3)
    shieldShape.lineTo(0, 1.55)
    shieldShape.lineTo(1.3, 1.3)
    // Upper curves
    shieldShape.bezierCurveTo(1.4, 0.6, 1.3, -0.4, 0.8, -1.2)
    // Bottom tip
    shieldShape.lineTo(0, -1.95)
    shieldShape.lineTo(-0.8, -1.2)
    shieldShape.bezierCurveTo(-1.3, -0.4, -1.4, 0.6, -1.3, 1.3)

    const extrudeSettings = {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.08,
    }

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings)
    shieldGeo.center()

    // Glass-like material
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.65,
      opacity: 0.95,
      transparent: true,
      roughness: 0.12,
      metalness: 0.1,
      ior: 1.52,
      reflectivity: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      attenuationColor: new THREE.Color(0xffedd5),
      attenuationDistance: 2.0,
    })

    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat)
    scene.add(shieldMesh)

    // Radiant orange glowing wireframe edges
    const edgesGeo = new THREE.EdgesGeometry(shieldGeo, 24)
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xea580c,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    })
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat)
    shieldMesh.add(edgesMesh)

    // Inner Core Holographic Icon
    const innerCoreShape = new THREE.Shape()
    innerCoreShape.moveTo(-0.65, 0.65)
    innerCoreShape.lineTo(0, 0.8)
    innerCoreShape.lineTo(0.65, 0.65)
    innerCoreShape.bezierCurveTo(0.7, 0.3, 0.65, -0.2, 0.4, -0.6)
    innerCoreShape.lineTo(0, -0.95)
    innerCoreShape.lineTo(-0.4, -0.6)
    innerCoreShape.bezierCurveTo(-0.65, -0.2, -0.7, 0.3, -0.65, 0.65)

    const innerGeo = new THREE.ShapeGeometry(innerCoreShape)
    innerGeo.center()
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    innerMesh.position.z = 0.16
    shieldMesh.add(innerMesh)

    // 4. Subtle Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.012, 16, 100)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.35,
    })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    ring1.rotation.x = Math.PI * 0.45
    scene.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(2.6, 0.008, 16, 100)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.2,
    })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.rotation.x = Math.PI * 0.55
    ring2.rotation.y = Math.PI * 0.15
    scene.add(ring2)

    // 5. Orbiting Quantum Particles around the shield
    const particleCount = 40
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeeds = []

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.1 + Math.random() * 0.8
      const angle = Math.random() * Math.PI * 2
      const elevation = (Math.random() - 0.5) * 1.5

      particlePositions[i * 3] = Math.cos(angle) * radius
      particlePositions[i * 3 + 1] = elevation
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius

      particleSpeeds.push({
        radius,
        angle,
        speed: (0.004 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
        y: elevation,
        vy: (Math.random() - 0.5) * 0.002,
      })
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xea580c,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // 6. Interactive Mouse Movement & Rotation
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouseRef.current.targetX = x * 0.38
      mouseRef.current.targetY = y * 0.32
    }

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0
      mouseRef.current.targetY = 0
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // 7. Animation Loop
    let animationFrameId
    let clock = new THREE.Clock()
    const nodesState = [...ORBITAL_NODES]

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      const elapsed = clock.getElapsedTime()

      // Smooth lerp mouse rotation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06

      // Float & rotate shield
      shieldMesh.rotation.y = Math.sin(elapsed * 0.7) * 0.12 + mouseRef.current.x
      shieldMesh.rotation.x = Math.cos(elapsed * 0.6) * 0.08 - mouseRef.current.y
      shieldMesh.position.y = Math.sin(elapsed * 1.2) * 0.08

      // Rotate subtle rings
      ring1.rotation.z += 0.003
      ring2.rotation.z -= 0.002

      // Orbit particles
      const posAttr = particleGeo.attributes.position
      for (let i = 0; i < particleCount; i++) {
        const p = particleSpeeds[i]
        p.angle += p.speed
        p.y += p.vy
        if (p.y > 1.2 || p.y < -1.2) p.vy *= -1

        posAttr.setXYZ(
          i,
          Math.cos(p.angle) * p.radius,
          p.y + Math.sin(elapsed + i) * 0.03,
          Math.sin(p.angle) * p.radius
        )
      }
      posAttr.needsUpdate = true

      // Update 2D orbital badges projection
      const updatedNodes = nodesState.map((node) => {
        node.angle += node.speed
        const x3d = Math.cos(node.angle) * (node.radius / 70)
        const z3d = Math.sin(node.angle) * (node.radius / 70)
        const y3d = Math.sin(node.angle * 2 + elapsed) * 0.35

        // Project 3D coordinate to screen space
        const v = new THREE.Vector3(x3d, y3d, z3d)
        v.project(camera)

        const screenX = (v.x * 0.5 + 0.5) * width
        const screenY = (-(v.y * 0.5) + 0.5) * height
        // Scale and opacity according to depth z
        const scale = THREE.MathUtils.lerp(0.85, 1.05, (v.z + 1) * 0.5)
        const opacity = THREE.MathUtils.lerp(0.55, 1.0, (v.z + 1) * 0.5)
        const isBehind = v.z > 0.88

        return {
          ...node,
          x: screenX,
          y: screenY,
          scale,
          opacity: isBehind ? 0.35 : opacity,
          zIndex: Math.round((1 - v.z) * 100),
        }
      })

      setNodePositions(updatedNodes)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return
      const w = container.clientWidth || 380
      const h = container.clientHeight || 380
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      shieldGeo.dispose()
      shieldMat.dispose()
      edgesGeo.dispose()
      edgesMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      ringGeo1.dispose()
      ringMat1.dispose()
      ringGeo2.dispose()
      ringMat2.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[420px] h-[360px] sm:h-[400px] mx-auto select-none flex items-center justify-center"
      style={{ perspective: 1000 }}
    >
      {/* Three.js 3D Shield Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Radiant ambient glow behind shield */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-transparent blur-3xl -z-10 animate-pulse-slow" />
      </div>

      {/* Floating 3D Data Nodes */}
      {nodePositions.map((node) => {
        const Icon = node.icon
        const isActive = activeNode === node.id

        return (
          <div
            key={node.id}
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
            className={`absolute transition-transform duration-75 flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md cursor-pointer ${node.bg} ${node.border} ${node.color} ${
              isActive ? 'scale-110 shadow-md ring-2 ring-orange-500/30' : ''
            }`}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: `translate(-50%, -50%) scale(${node.scale})`,
              opacity: node.opacity,
              zIndex: node.zIndex,
              willChange: 'transform, opacity',
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
