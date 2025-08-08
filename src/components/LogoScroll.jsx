import React, { useEffect, useState } from 'react'
import O from '../assets/O.png'
import P from '../assets/P.png'
import X from '../assets/X.png'

const LogoScroll = () => {
  const [scrollStep, setScrollStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY < 200) setScrollStep(0)
      else if (scrollY < 600) setScrollStep(1)
      else if (scrollY < 1000) setScrollStep(2)
      else setScrollStep(3) // start moving up
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`h-[400vh] bg-black text-white relative`}>
      {/* OPX Logo container */}
      <div
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 transition-all duration-700 z-20
          ${scrollStep === 3 ? 'top-10 scale-75' : '-translate-y-1/2'}
        `}
      >
        <div className="relative flex items-center justify-center space-x-2">
          {scrollStep >= 0 && (
            <img
              src={O}
              alt="O"
              className={`w-32 transition-all duration-700 ${
                scrollStep >= 1 ? 'translate-x-[-70px]' : 'translate-x-0'
              }`}
            />
          )}
          {scrollStep >= 1 && (
            <img
              src={P}
              alt="P"
              className={`w-32 transition-all duration-700 ${
                scrollStep >= 2 ? 'translate-x-0' : 'translate-x-[70px]'
              }`}
            />
          )}
          {scrollStep >= 2 && (
            <img
              src={X}
              alt="X"
              className="w-32 transition-all duration-700"
            />
          )}
        </div>

        {/* Particle burst */}
        <div className="absolute inset-0 -z-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * -100}px`,
                left: `${Math.random() * 100}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LogoScroll
