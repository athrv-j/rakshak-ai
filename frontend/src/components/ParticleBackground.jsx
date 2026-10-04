import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Particle pool
    const particleCount = Math.min(width < 768 ? 25 : 45, 60)
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.25 + 0.12,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI,
      })
    }

    let mouse = { x: -1000, y: -1000, active: false }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      // Draw connection lines between close particles
      const maxDistance = width < 768 ? 100 : 140
      const mouseDistance = 120

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        // Update position
        p1.x += p1.vx
        p1.y += p1.vy

        // Wrap around edges with soft buffer
        if (p1.x < -10) p1.x = width + 10
        if (p1.x > width + 10) p1.x = -10
        if (p1.y < -10) p1.y = height + 10
        if (p1.y > height + 10) p1.y = -10

        p1.pulseVal += p1.pulseSpeed
        const alpha = p1.baseAlpha + Math.sin(p1.pulseVal) * 0.08

        // Draw particle
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 88, 12, ${alpha})`
        ctx.fill()

        // Connect to mouse if close
        if (mouse.active) {
          const dxMouse = p1.x - mouse.x
          const dyMouse = p1.y - mouse.y
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
          if (distMouse < mouseDistance) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(mouse.x, mouse.y)
            const mAlpha = (1 - distMouse / mouseDistance) * 0.18
            ctx.strokeStyle = `rgba(234, 88, 12, ${mAlpha})`
            ctx.lineWidth = 0.75
            ctx.stroke()
          }
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const lineAlpha = (1 - dist / maxDistance) * 0.12
            ctx.strokeStyle = `rgba(217, 119, 6, ${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ willChange: 'transform' }}
    />
  )
}
