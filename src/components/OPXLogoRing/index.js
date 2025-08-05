import { useState, useEffect, useRef } from 'react'
import './index.scss'

export default function OPXLogoRing() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const ringRef = useRef(null)
  const particlesRef = useRef([])

  // Initialize particles with enhanced properties
  useEffect(() => {
    const particleCount = 80
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        originalX: Math.random() * 100,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 3 + 0.8,
        opacity: Math.random() * 0.9 + 0.3,
        color: ['#ff4500', '#ff6b35', '#ffa500', '#ffcc00', '#ff1744', '#9c27b0', '#3f51b5'][Math.floor(Math.random() * 7)],
        magneticForce: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
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

  // Animate particles with magnetic attraction to ring
  useEffect(() => {
    const animateParticles = () => {
      const time = Date.now() * 0.001
      const centerX = 50
      const centerY = 50

      particlesRef.current = particlesRef.current.map(particle => {
        // Calculate distance to center for magnetic effect
        const distanceToCenter = Math.sqrt(
          Math.pow(particle.x - centerX, 2) + Math.pow(particle.y - centerY, 2)
        )

        // Magnetic attraction to ring
        const magneticX = (centerX - particle.x) * particle.magneticForce
        const magneticY = (centerY - particle.y) * particle.magneticForce * 0.3

        // Orbital motion around ring
        const orbitalX = Math.sin(time + particle.phase) * 0.2
        const orbitalY = Math.cos(time + particle.phase) * 0.1

        // Normal upward movement
        const newY = particle.y - particle.speed * 0.08
        const newX = particle.x + magneticX + orbitalX + Math.sin(time + particle.id) * 0.15

        return {
          ...particle,
          x: newX,
          y: newY,
          opacity: Math.max(0.2, Math.min(0.9, particle.opacity + Math.sin(time + particle.id) * 0.02))
        }
      })

      // Reset particles that go off screen
      particlesRef.current.forEach(particle => {
        if (particle.y < -10) {
          particle.y = 110
          particle.x = particle.originalX + (Math.random() - 0.5) * 20
          particle.phase = Math.random() * Math.PI * 2
        }
      })
    }

    const interval = setInterval(animateParticles, 16) // 60fps
    return () => clearInterval(interval)
  }, [])

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
      {/* Particles Background */}
      <div className="particles-container">
        {particlesRef.current.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`
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
              className="logo-item"
              style={{
                transform: logo.transform,
                animationDelay: `${logo.delay}s`
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
