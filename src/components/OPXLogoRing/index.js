import { useState, useEffect, useRef } from 'react'
import './index.scss'

export default function OPXLogoRing() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const ringRef = useRef(null)
  const particlesRef = useRef([])

  // Initialize square particles for coding theme
  useEffect(() => {
    const particleCount = 60
    const particles = []

    // Coding-style colors: matrix green, terminal amber, error red, info blue
    const codingColors = ['#00ff41', '#ffb000', '#ff073a', '#0ea5e9', '#8b5cf6', '#f59e0b']

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        originalX: Math.random() * 100,
        size: Math.random() * 8 + 4, // Larger squares
        speed: 0, // Static particles, only move with ring
        opacity: Math.random() * 0.7 + 0.3,
        baseOpacity: Math.random() * 0.7 + 0.3,
        color: codingColors[Math.floor(Math.random() * codingColors.length)],
        blinkSpeed: Math.random() * 2 + 1, // Individual blink rates
        phase: Math.random() * Math.PI * 2,
        ringRadius: Math.random() * 150 + 100, // Distance from ring center
        angle: Math.random() * Math.PI * 2 // Position around ring
      })
    }

    particlesRef.current = particles
  }, [])

  // Handle scroll for coin rotation effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  // Animate particles with slow blink and ring attachment
  useEffect(() => {
    const animateParticles = () => {
      const time = Date.now() * 0.001
      const centerX = 50
      const centerY = 50

      particlesRef.current = particlesRef.current.map(particle => {
        // Position particles around the ring
        const currentAngle = particle.angle + (scrollY * 0.001) // Slight rotation with scroll
        const x = centerX + Math.cos(currentAngle) * (particle.ringRadius / 10)
        const y = centerY + Math.sin(currentAngle) * (particle.ringRadius / 15)

        // Slow blink animation
        const blinkOpacity = particle.baseOpacity * (0.3 + 0.7 * Math.abs(Math.sin(time * particle.blinkSpeed)))

        return {
          ...particle,
          x: Math.max(5, Math.min(95, x)), // Keep within bounds
          y: Math.max(5, Math.min(95, y)),
          opacity: blinkOpacity
        }
      })
    }

    const interval = setInterval(animateParticles, 32) // 30fps for smoother blink
    return () => clearInterval(interval)
  }, [scrollY])

  // Calculate coin-like rotation based on scroll
  const rotationX = (scrollY * 0.3) % 360 // Horizontal coin flip
  const rotationY = (scrollY * 0.8) % 360 // Vertical coin flip
  const rotationZ = Math.sin(scrollY * 0.005) * 10 // Wobble effect
  const scale = 1 + Math.sin(scrollY * 0.01) * 0.15
  const tilt = Math.sin(scrollY * 0.003) * 15 // Additional tilt for realism

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
      {/* Background Video */}
      <div className="background-video">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="bg-video"
        >
          <source src="https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
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

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-text">Scroll to rotate</div>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  )
}
