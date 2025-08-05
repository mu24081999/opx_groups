import { useState, useEffect, useRef } from 'react'
import './index.scss'

export default function OPXLogoRing() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [heartbeat, setHeartbeat] = useState({
    isActive: false,
    wave: 0,
    intensity: 0,
    colorIndex: 0
  })
  const ringRef = useRef(null)
  const particlesRef = useRef([])

  // Initialize square particles spread across full screen
  useEffect(() => {
    const particleCount = 100
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      particles.push({
        id: i,
        x: x,
        y: y,
        originalX: x,
        originalY: y,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 0.5 + 0.2,
        opacity: 0.1,
        baseOpacity: Math.random() * 0.3 + 0.1,
        color: '#666666',
        blinkSpeed: Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        floatDirection: Math.random() * Math.PI * 2,
        distanceFromCenter: Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2))
      })
    }

    particlesRef.current = particles
  }, [])

  // Handle scroll for coin rotation effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      setScrollY(currentScrollY)
    }

    // Set initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Handle mouse movement for lighting effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Simple heartbeat pulse system
  useEffect(() => {
    const colors = [
      '#00ff41', '#ff073a', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ff6b00'
    ]

    let colorIndex = 0
    let heartbeatTimer

    const triggerHeartbeat = () => {
      setHeartbeat({
        isActive: true,
        wave: 0,
        intensity: 0.8 + Math.random() * 0.4, // Random intensity between 0.8-1.2
        colorIndex: colorIndex
      })

      colorIndex = (colorIndex + 1) % colors.length

      // Heartbeat interval (2-4 seconds)
      const nextInterval = 2000 + Math.random() * 2000
      heartbeatTimer = setTimeout(triggerHeartbeat, nextInterval)
    }

    heartbeatTimer = setTimeout(triggerHeartbeat, 1000)

    return () => {
      if (heartbeatTimer) clearTimeout(heartbeatTimer)
    }
  }, [])

  // Heartbeat wave animation
  useEffect(() => {
    if (!heartbeat.isActive) return

    const startTime = Date.now()
    const duration = 1500 // 1.5 seconds for wave to complete

    const animateWave = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress >= 1) {
        setHeartbeat(prev => ({ ...prev, isActive: false }))
        return
      }

      // Wave spreads from center outward
      const maxRadius = 80 // Max distance to cover screen
      const currentWave = progress * maxRadius

      setHeartbeat(prev => ({ ...prev, wave: currentWave }))

      requestAnimationFrame(animateWave)
    }

    requestAnimationFrame(animateWave)
  }, [heartbeat.isActive])

  // Animate particles with heartbeat effects
  useEffect(() => {
    const animateParticles = () => {
      const time = Date.now() * 0.001

      const colors = [
        '#00ff41', '#ff073a', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ffb000'
      ]

      particlesRef.current = particlesRef.current.map(particle => {
        // Floating movement
        const newX = particle.originalX + Math.sin(time * 0.3 + particle.phase) * 3
        const newY = particle.originalY + Math.cos(time * 0.2 + particle.phase) * 2 + particle.speed * time * 2

        // Heartbeat effect - particles pulse when wave passes through
        let heartbeatBoost = 0
        if (heartbeat.isActive) {
          const distanceFromWave = Math.abs(particle.distanceFromCenter - heartbeat.wave)
          if (distanceFromWave < 10) { // Wave thickness
            const waveIntensity = 1 - (distanceFromWave / 10)
            heartbeatBoost = waveIntensity * heartbeat.intensity
          }
        }

        // Base color animation
        const colorIndex = Math.floor((time + particle.id) * 0.2) % colors.length
        let targetColor = colors[colorIndex]

        // Enhanced color during heartbeat
        if (heartbeatBoost > 0.1) {
          targetColor = colors[heartbeat.colorIndex]
        }

        // Opacity with heartbeat boost
        const blinkFactor = 0.4 + 0.6 * Math.abs(Math.sin(time * particle.blinkSpeed + particle.phase))
        const baseOpacity = particle.baseOpacity * blinkFactor * (0.3 + 0.7 * Math.sin(time * 0.5))
        const finalOpacity = Math.max(baseOpacity, baseOpacity + heartbeatBoost)

        // Reset particles that go off screen
        let finalX = newX
        let finalY = newY

        if (finalY > 105) {
          finalY = -5
          finalX = Math.random() * 100
          particle.originalX = finalX
          particle.originalY = finalY
          particle.distanceFromCenter = Math.sqrt(Math.pow(finalX - 50, 2) + Math.pow(finalY - 50, 2))
        }

        return {
          ...particle,
          x: Math.max(0, Math.min(100, finalX)),
          y: Math.max(-5, Math.min(105, finalY)),
          opacity: Math.max(0.1, Math.min(1, finalOpacity)),
          color: targetColor
        }
      })
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [scrollY, heartbeat])

  // Calculate coin-like rotation based on scroll (enhanced responsiveness)
  const scrollProgress = scrollY * 0.1 // Scroll progress multiplier
  const rotationX = (scrollProgress * 2) % 360 // Horizontal coin flip
  const rotationY = (scrollProgress * 3) % 360 // Vertical coin flip
  const rotationZ = Math.sin(scrollProgress * 0.1) * 30 // Wobble effect
  const scale = 1 + Math.sin(scrollProgress * 0.05) * 0.25
  const tilt = Math.sin(scrollProgress * 0.08) * 20 // Additional tilt for realism

  // Create OPX logos in ring formation
  const logoCount = 8
  const logos = Array.from({ length: logoCount }, (_, index) => {
    const angle = (index / logoCount) * 360
    const radius = 120
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const z = Math.sin((angle * Math.PI) / 180) * radius

    return {
      id: index,
      transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg)`,
      delay: index * 0.1
    }
  })

  return (
    <div className="opx-logo-ring-container">
      {/* Background Video with Color Fade */}
      <div className="background-video">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="bg-video"
        >
          <source src="https://videos.pexels.com/video-files/8533458/8533458-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay fade-overlay"></div>
        <div className="color-overlay"></div>
      </div>

      {/* Square Particles with Blink */}
      <div className="particles-container">
        {particlesRef.current.map(particle => (
          <div
            key={particle.id}
            className="particle square-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              border: `1px solid ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* Dynamic Lighting */}
      <div
        className="dynamic-light"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 69, 0, 0.15), transparent 70%)`,
        }}
      />

      {/* Lightning Center Source */}
      <div className={`lightning-center ${lightningState.isActive ? 'active' : ''}`}>
        <div className="lightning-core" style={{
          '--lightning-color': lightningState.colors?.[0] || '#00f5ff',
          '--lightning-intensity': lightningState.intensity || 1
        }} />
        <div className="lightning-rings">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="lightning-ring"
              style={{
                '--delay': `${i * 0.1}s`,
                '--size': `${100 + i * 50}px`
              }}
            />
          ))}
        </div>
      </div>

      {/* Lightning Wave */}
      {lightningState.isActive && (
        <div
          className="lightning-wave"
          style={{
            '--wave-size': `${lightningState.wave * 20}px`,
            '--wave-color': lightningState.colors?.[1] || '#0066ff',
            '--wave-intensity': lightningState.intensity || 1
          }}
        />
      )}

      {/* Main Ring Container */}
      <div
        className="ring-wrapper"
        ref={ringRef}
        style={{
          transform: `
            perspective(1200px)
            rotateX(${rotationX + tilt}deg)
            rotateY(${rotationY}deg)
            rotateZ(${rotationZ}deg)
            scale(${scale})
          `,
        }}
      >
        <div className="logo-ring">
          {logos.map(logo => (
            <div
              key={logo.id}
              className="logo-item scroll-only"
              style={{
                transform: logo.transform
              }}
            >
              <div className="logo-face front">
                <span className="opx-text">OPX</span>
              </div>
              <div className="logo-face back">
                <span className="opx-text">OPX</span>
              </div>
            </div>
          ))}
        </div>

        {/* Center Glow Effect */}
        <div className="center-glow" />

        {/* Ring Inner Light */}
        <div className="ring-light" />
      </div>

      {/* Scroll Indicator with Debug Info */}
      <div className="scroll-indicator">
        <div className="scroll-text">Scroll to rotate</div>
        <div className="scroll-debug">Y: {Math.round(scrollY)}</div>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  )
}
