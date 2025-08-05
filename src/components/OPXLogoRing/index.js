import { useState, useEffect, useRef } from 'react'
import './index.scss'

export default function OPXLogoRing() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const ringRef = useRef(null)
  const particlesRef = useRef([])
  
  // Initialize particles
  useEffect(() => {
    const particleCount = 50
    const particles = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        color: ['#ff4500', '#ff6b35', '#ffa500', '#ffcc00'][Math.floor(Math.random() * 4)]
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
  
  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      particlesRef.current = particlesRef.current.map(particle => ({
        ...particle,
        y: particle.y - particle.speed * 0.1,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1
      }))
      
      // Reset particles that go off screen
      particlesRef.current.forEach(particle => {
        if (particle.y < -5) {
          particle.y = 105
          particle.x = Math.random() * 100
        }
      })
    }
    
    const interval = setInterval(animateParticles, 16) // 60fps
    return () => clearInterval(interval)
  }, [])
  
  // Calculate rotation based on scroll
  const rotationX = (scrollY * 0.5) % 360
  const rotationY = (scrollY * 0.3) % 360
  const scale = 1 + Math.sin(scrollY * 0.01) * 0.1
  
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
            perspective(1000px) 
            rotateX(${rotationX}deg) 
            rotateY(${rotationY}deg) 
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
