import { useRef } from 'react'

export default function Card3DTilt({
  children,
  className = '',
  maxTilt = 4,
  scale = 1.005,
  onClick,
}) {
  const cardRef = useRef(null)
  const glareRef = useRef(null)
  const rafId = useRef(null)

  const handleMouseMove = (e) => {
    if (rafId.current) return

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -maxTilt
      const rotateY = ((x - centerX) / centerX) * maxTilt

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) scale3d(${scale}, ${scale}, ${scale})`
      
      if (glareRef.current) {
        const gx = (x / rect.width) * 100
        const gy = (y / rect.height) * 100
        glareRef.current.style.opacity = '0.08'
        glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(234, 88, 12, 0.2) 0%, transparent 60%)`
      }
    })
  }

  const handleMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
    const card = cardRef.current
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      }}
    >
      {/* Specular Glare */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute -inset-full transition-opacity duration-300 opacity-0"
      />
      {children}
    </div>
  )
}
