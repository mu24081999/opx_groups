import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import BackgroundLayout from "../components/BackgroundLayout";
import "./cinematic.css";

const ParallaxLayout = ({ children }) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mouse tracking for parallax effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations for mouse movement
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Transform values based on scroll (with device-specific optimizations)
  const isMobile = dimensions.width < 768;
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -200 : -400]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -100 : -200]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 0.6, 0.75, 0.9]);

  // Cinematic effects
  const cinematicGradient = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)",
      "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)",
      "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.9) 100%)"
    ]
  );

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Throttled mouse movement for better performance
    let throttleTimeout;
    const handleMouseMove = (e) => {
      if (!containerRef.current || throttleTimeout) return;

      throttleTimeout = setTimeout(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const normalizedX = (e.clientX - centerX) / (rect.width / 2);
        const normalizedY = (e.clientY - centerY) / (rect.height / 2);

        setMousePosition({ x: normalizedX, y: normalizedY });
        mouseX.set(normalizedX * (dimensions.width < 768 ? 10 : 20));
        mouseY.set(normalizedY * (dimensions.width < 768 ? 10 : 20));

        throttleTimeout = null;
      }, 16); // ~60fps throttling
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateDimensions);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [mouseX, mouseY, dimensions.width]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black cinematic-container"
    >
      {/* Animated Background Particles */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <BackgroundLayout />
      </motion.div>

      {/* Animated Grid Background */}
      <motion.div
        className="fixed inset-0 z-10 opacity-20"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,100,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,100,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      {/* Floating Geometric Elements */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const shapes = ['circle', 'square', 'triangle', 'diamond'];
          const colors = ['purple-500/15', 'blue-500/15', 'pink-500/10', 'cyan-500/10'];
          const sizes = [16, 20, 24, 28, 32];

          return (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.05, 0.2, 0.05],
                scale: [0.8, 1.1, 0.8],
                rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                x: [0, Math.sin(i * 0.5) * 60, 0],
                y: [0, Math.cos(i * 0.5) * 40, 0],
              }}
              transition={{
                duration: 18 + i * 4,
                repeat: Infinity,
                delay: i * 2.5,
                ease: "easeInOut",
              }}
              style={{
                left: `${15 + (i % 4) * 22}%`,
                top: `${15 + Math.floor(i / 4) * 35}%`,
                x: springX,
                y: springY,
              }}
            >
              <div
                className={`w-${sizes[i % sizes.length]} h-${sizes[i % sizes.length]} border border-${colors[i % colors.length]} ${
                  shapes[i % shapes.length] === 'circle' ? 'rounded-full' :
                  shapes[i % shapes.length] === 'diamond' ? 'rotate-45' :
                  shapes[i % shapes.length] === 'triangle' ? 'clip-triangle' : ''
                }`}
                style={{
                  boxShadow: `0 0 ${10 + i * 2}px rgba(${i % 2 === 0 ? '168, 85, 247' : '59, 130, 246'}, 0.1)`,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Cinematic Overlay */}
      <motion.div
        className="fixed inset-0 z-30 pointer-events-none"
        style={{
          background: cinematicGradient,
          opacity: overlayOpacity,
        }}
      />

      {/* Additional Dark Vignette */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.8) 100%)`,
          }}
        />
      </div>

      {/* Content Layer */}
      <motion.div
        className="relative z-50"
        style={{ y: foregroundY }}
      >
        {children}
      </motion.div>

      {/* Animated Light Rays */}
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"
            style={{
              width: "2px",
              height: "200vh",
              left: `${25 + i * 25}%`,
              top: "-50vh",
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Cinematic Effects Overlay */}
      <div className="cinematic-overlay">
        {/* Film Grain */}
        <div className="film-grain" />

        {/* Dark Vignette */}
        <div className="dark-vignette" />

        {/* Scanlines */}
        <div className="scanlines" />

        {/* Light Beams */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="light-beam"
            style={{
              left: `${30 + i * 20}%`,
              animationDelay: `${i * 5}s`,
            }}
          />
        ))}

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Scrolling Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
};

export default ParallaxLayout;
