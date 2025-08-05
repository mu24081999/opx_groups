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

  // Initialize particles in structured cosmic patterns
  useEffect(() => {
    const particles = []

    // Create particle clusters like in the image
    const createCluster = (centerX, centerY, count, spread, sizeRange) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
        const distance = Math.random() * spread
        const x = Math.max(5, Math.min(95, centerX + Math.cos(angle) * distance))
        const y = Math.max(5, Math.min(95, centerY + Math.sin(angle) * distance))

        particles.push({
          id: particles.length,
          x: x,
          y: y,
          originalX: x,
          originalY: y,
          size: Math.random() * sizeRange[1] + sizeRange[0],
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.4 + 0.2,
          baseOpacity: Math.random() * 0.4 + 0.2,
          color: '#4a90e2',
          blinkSpeed: Math.random() * 1.0 + 0.3,
          phase: Math.random() * Math.PI * 2,
          floatDirection: angle,
          distanceFromCenter: Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2)),
          clusterType: 'main'
        })
      }
    }

    // Create scattered background particles
    const createScattered = (count) => {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 90 + 5 // Keep within bounds
        const y = Math.random() * 90 + 5

        particles.push({
          id: particles.length,
          x: x,
          y: y,
          originalX: x,
          originalY: y,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.2 + 0.05,
          opacity: Math.random() * 0.3 + 0.1,
          baseOpacity: Math.random() * 0.3 + 0.1,
          color: '#64b5f6',
          blinkSpeed: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI * 2,
          floatDirection: Math.random() * Math.PI * 2,
          distanceFromCenter: Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2)),
          clusterType: 'background'
        })
      }
    }

    // Create clusters like in the reference image
    createCluster(25, 25, 15, 8, [2, 4])    // Top-left cluster
    createCluster(75, 25, 12, 6, [1, 3])    // Top-right cluster
    createCluster(25, 75, 14, 7, [2, 5])    // Bottom-left cluster
    createCluster(75, 75, 13, 8, [1, 4])    // Bottom-right cluster
    createCluster(50, 20, 10, 5, [1, 3])    // Top center
    createCluster(50, 80, 11, 6, [2, 4])    // Bottom center
    createCluster(15, 50, 8, 4, [1, 2])     // Left center
    createCluster(85, 50, 9, 5, [1, 3])     // Right center

    // Add scattered background particles
    createScattered(25)

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

  // Smooth flowing heartbeat animation
  useEffect(() => {
    if (!heartbeat.isActive) return

    const startTime = Date.now()
    const duration = 2500 // 2.5 seconds for smooth flow

    const animateFlow = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress >= 1) {
        setHeartbeat(prev => ({ ...prev, isActive: false }))
        return
      }

      // Smooth wave that spreads from center to edges
      const maxRadius = 85 // Max distance to cover screen corners
      const currentWave = progress * maxRadius

      setHeartbeat(prev => ({ ...prev, wave: currentWave, progress }))

      requestAnimationFrame(animateFlow)
    }

    requestAnimationFrame(animateFlow)
  }, [heartbeat.isActive])

  // Animate particles with smooth flowing heartbeat like blood in veins
  useEffect(() => {
    const animateParticles = () => {
      const time = Date.now() * 0.001

      const colors = [
        '#00ff41', '#ff073a', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ffb000'
      ]

      particlesRef.current = particlesRef.current.map(particle => {
        // Subtle floating movement that keeps particles in their cosmic clusters
        const floatRange = particle.clusterType === 'main' ? 2 : 1
        const newX = particle.originalX + Math.sin(time * 0.2 + particle.phase) * floatRange
        const newY = particle.originalY + Math.cos(time * 0.15 + particle.phase) * floatRange

        // Smooth flowing heartbeat effect like blood in veins
        let heartbeatBoost = 0
        let flowColor = colors[Math.floor((time + particle.id) * 0.2) % colors.length]

        if (heartbeat.isActive) {
          const distanceFromCenter = particle.distanceFromCenter
          const currentWave = heartbeat.wave

          // Sequential activation: particles light up as wave reaches their distance
          if (distanceFromCenter <= currentWave) {
            // How long ago did the wave reach this particle?
            const waveReachedAt = distanceFromCenter / 85 // normalized distance (0-1)
            const currentProgress = heartbeat.progress || 0
            const timeSinceReached = currentProgress - waveReachedAt

            if (timeSinceReached >= 0) {
              // Smooth fade-in when wave reaches particle
              const fadeInDuration = 0.15 // 15% of total animation for fade-in
              const fadeOutStart = 0.4 // Start fading out after 40% of animation
              const fadeOutDuration = 0.6 // 60% for fade-out

              if (timeSinceReached <= fadeInDuration) {
                // Fade in smoothly
                const fadeInProgress = timeSinceReached / fadeInDuration
                heartbeatBoost = Math.sin(fadeInProgress * Math.PI * 0.5) * heartbeat.intensity
              } else if (timeSinceReached <= fadeOutStart) {
                // Full intensity
                heartbeatBoost = heartbeat.intensity
              } else {
                // Fade out smoothly
                const fadeOutProgress = (timeSinceReached - fadeOutStart) / fadeOutDuration
                const fadeOutFactor = Math.cos(fadeOutProgress * Math.PI * 0.5)
                heartbeatBoost = Math.max(0, fadeOutFactor * heartbeat.intensity)
              }

              // Use heartbeat color when active
              flowColor = colors[heartbeat.colorIndex]

              // Add some organic variation to the flow
              const organicVariation = 0.1 + 0.1 * Math.sin(time * 2 + particle.id * 0.1)
              heartbeatBoost *= (1 + organicVariation)
            }
          }
        }

        // Store the heartbeat boost for trailing effect
        if (!particle.heartbeatHistory) particle.heartbeatHistory = []
        particle.heartbeatHistory.push(heartbeatBoost)
        if (particle.heartbeatHistory.length > 10) particle.heartbeatHistory.shift()

        // Calculate trailing effect
        const averageBoost = particle.heartbeatHistory.reduce((a, b) => a + b, 0) / particle.heartbeatHistory.length
        const smoothBoost = heartbeatBoost * 0.7 + averageBoost * 0.3

        // Base opacity with smooth heartbeat boost
        const blinkFactor = 0.4 + 0.6 * Math.abs(Math.sin(time * particle.blinkSpeed + particle.phase))
        const baseOpacity = particle.baseOpacity * blinkFactor * (0.3 + 0.7 * Math.sin(time * 0.5))
        const finalOpacity = Math.max(baseOpacity, baseOpacity + smoothBoost * 0.8)

        // Reset particles that go off screen
        let finalX = newX
        let finalY = newY

        if (finalY > 105) {
          finalY = -5
          finalX = Math.random() * 100
          particle.originalX = finalX
          particle.originalY = finalY
          particle.distanceFromCenter = Math.sqrt(Math.pow(finalX - 50, 2) + Math.pow(finalY - 50, 2))
          particle.heartbeatHistory = [] // Reset history for new particle position
        }

        return {
          ...particle,
          x: Math.max(0, Math.min(100, finalX)),
          y: Math.max(-5, Math.min(105, finalY)),
          opacity: Math.max(0.1, Math.min(1, finalOpacity)),
          color: flowColor
        }
      })
    }

    const interval = setInterval(animateParticles, 33) // ~30fps for smoother animation
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
