import { useState, useEffect, useRef } from 'react'
import './index.scss'

export default function OPXLogoRing() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [lightningState, setLightningState] = useState({
    isActive: false,
    wave: 0,
    type: 'electric',
    intensity: 1
  })
  const ringRef = useRef(null)
  const particlesRef = useRef([])
  const lightningRef = useRef(null)

  // Initialize square particles spread across full screen
  useEffect(() => {
    const particleCount = 100
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      particles.push({
        id: i,
        x: x, // Full screen width (0-100%)
        y: y, // Full screen height (0-100%)
        originalX: x,
        originalY: y,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 0.5 + 0.2,
        opacity: 0.1, // Start with low opacity (gray effect)
        baseOpacity: Math.random() * 0.3 + 0.1,
        color: '#666666', // Start gray
        targetColor: '#666666',
        blinkSpeed: Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        floatDirection: Math.random() * Math.PI * 2,
        // Lightning effect properties
        distanceFromCenter: Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2)),
        lightningOpacity: 0,
        lightningSize: 1,
        lightningColor: '#666666',
        lastHitTime: 0
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

  // Lightning heartbeat system
  useEffect(() => {
    const lightningTypes = [
      {
        type: 'electric',
        colors: ['#00f5ff', '#0066ff', '#ffffff'],
        speed: 60,
        intensity: 1.5,
        duration: 800
      },
      {
        type: 'plasma',
        colors: ['#ff00ff', '#8b00ff', '#ffffff'],
        speed: 45,
        intensity: 1.8,
        duration: 1000
      },
      {
        type: 'energy',
        colors: ['#00ff41', '#00ffaa', '#ffffff'],
        speed: 70,
        intensity: 1.2,
        duration: 600
      },
      {
        type: 'fire',
        colors: ['#ff4500', '#ff6b00', '#ffff00'],
        speed: 55,
        intensity: 1.6,
        duration: 900
      },
      {
        type: 'cosmic',
        colors: ['#9d4edd', '#c77dff', '#ffffff'],
        speed: 40,
        intensity: 2.0,
        duration: 1200
      }
    ]

    let currentTypeIndex = 0
    let lightningTimer

    const triggerLightning = () => {
      const currentType = lightningTypes[currentTypeIndex]

      setLightningState({
        isActive: true,
        wave: 0,
        type: currentType.type,
        intensity: currentType.intensity,
        colors: currentType.colors,
        speed: currentType.speed,
        duration: currentType.duration
      })

      // Move to next lightning type
      currentTypeIndex = (currentTypeIndex + 1) % lightningTypes.length

      // Schedule next lightning (heartbeat interval with some variation)
      const nextInterval = 2000 + Math.random() * 1500 // 2-3.5 seconds
      lightningTimer = setTimeout(triggerLightning, nextInterval)
    }

    // Start first lightning after a short delay
    lightningTimer = setTimeout(triggerLightning, 1000)

    return () => {
      if (lightningTimer) clearTimeout(lightningTimer)
    }
  }, [])

  // Animate particles with color sampling from video
  useEffect(() => {
    const animateParticles = () => {
      const time = Date.now() * 0.001

      // Color transitions based on time (simulating video colors)
      const videoColors = [
        '#00ff41', // Matrix green
        '#ff073a', // Error red
        '#0ea5e9', // Info blue
        '#8b5cf6', // Purple
        '#f59e0b', // Amber
        '#ffb000'  // Gold
      ]

      particlesRef.current = particlesRef.current.map(particle => {
        // Slow floating movement
        const newX = particle.originalX + Math.sin(time * 0.3 + particle.phase) * 3
        const newY = particle.originalY + Math.cos(time * 0.2 + particle.phase) * 2 + particle.speed * time * 2

        // Color transition from gray to video colors
        const colorIndex = Math.floor((time + particle.id) * 0.2) % videoColors.length
        const targetColor = videoColors[colorIndex]

        // Slow blink animation with color fade
        const blinkFactor = 0.4 + 0.6 * Math.abs(Math.sin(time * particle.blinkSpeed + particle.phase))
        const opacity = particle.baseOpacity * blinkFactor * (0.3 + 0.7 * Math.sin(time * 0.5))

        // Reset particles that go off screen
        let finalX = newX
        let finalY = newY

        if (finalY > 105) {
          finalY = -5
          finalX = Math.random() * 100
          particle.originalX = finalX
          particle.originalY = finalY
        }

        return {
          ...particle,
          x: Math.max(0, Math.min(100, finalX)),
          y: Math.max(-5, Math.min(105, finalY)),
          opacity: Math.max(0.1, Math.min(0.8, opacity)),
          color: targetColor
        }
      })
    }

    const interval = setInterval(animateParticles, 50) // 20fps
    return () => clearInterval(interval)
  }, [scrollY])

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
