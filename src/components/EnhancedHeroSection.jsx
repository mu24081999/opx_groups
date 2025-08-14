import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Parallax3DLayout, { Layer3D } from "./Parallax3DLayout";
import {
  FadeIn,
  SlideIn,
  Typewriter,
  StaggerContainer,
} from "./ScrollTriggeredAnimations";

const EnhancedHeroSection = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x: normalizedX, y: normalizedY });
  };

  const floatingElements = [
    { text: "React", delay: 0, x: 20, y: 20 },
    { text: "Three.js", delay: 0.2, x: -20, y: 40 },
    { text: "Framer Motion", delay: 0.4, x: 40, y: -20 },
    { text: "WebGL", delay: 0.6, x: -40, y: -40 },
    { text: "Creative", delay: 0.8, x: 60, y: 60 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * 10}px, ${
              mousePosition.y * 10
            }px)`,
          }}
        />
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-white/20 text-sm font-mono"
          style={{
            left: `${50 + element.x}%`,
            top: `${50 + element.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {element.text}
        </motion.div>
      ))}

      {/* Main Content */}
      <Parallax3DLayout
        className="relative z-10 h-full flex items-center justify-center"
        depth={500}
        perspective={1200}
        mouseSensitivity={0.3}
      >
        <Layer3D depth={0}>
          <motion.div
            className="text-center space-y-8"
            style={{ y, opacity, scale }}
          >
            {/* Main Title */}
            <FadeIn delay={0.2} duration={1}>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
                <Typewriter
                  text="OPX GROUPS"
                  speed={100}
                  className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                />
              </h1>
            </FadeIn>

            {/* Subtitle */}
            <SlideIn delay={0.5} direction="up" duration={1}>
              <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
                Crafting Digital Experiences with Cutting-Edge Technology
              </p>
            </SlideIn>

            {/* Description */}
            <FadeIn delay={0.8} duration={1}>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto px-4">
                We specialize in creating immersive web applications with
                advanced animations, 3D graphics, and interactive experiences
                that push the boundaries of modern web development.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <StaggerContainer staggerDelay={0.1}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Our Work
                </motion.button>

                <motion.button
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get In Touch
                </motion.button>
              </div>
            </StaggerContainer>
          </motion.div>
        </Layer3D>

        {/* Background 3D Elements */}
        <Layer3D depth={-200}>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-96 h-96 border border-white/10 rounded-full" />
          </motion.div>
        </Layer3D>

        <Layer3D depth={-400}>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-64 h-64 border border-purple-500/20 rounded-full" />
          </motion.div>
        </Layer3D>
      </Parallax3DLayout>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedHeroSection;
