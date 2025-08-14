import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const SlidingHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // AI Agent related content
  const slides = [
    {
      id: 1,
      title: "AI-Powered Intelligence",
      subtitle: "Revolutionary Agent Technology",
      description: "Experience the future of intelligent automation with our advanced AI agents that understand, learn, and adapt to your business needs.",
      features: ["Natural Language Processing", "Machine Learning", "Real-time Analytics", "Autonomous Decision Making"],
      gradient: "from-blue-600 via-purple-600 to-indigo-800"
    },
    {
      id: 2,
      title: "Seamless Integration",
      subtitle: "Connect Everything",
      description: "Our AI agents seamlessly integrate with your existing systems, workflows, and processes to enhance productivity and efficiency.",
      features: ["API Integrations", "Cloud Connectivity", "Multi-platform Support", "Enterprise Security"],
      gradient: "from-purple-600 via-pink-600 to-blue-800"
    },
    {
      id: 3,
      title: "Intelligent Automation",
      subtitle: "Work Smarter, Not Harder",
      description: "Let our AI agents handle complex tasks, analyze data, and provide insights while you focus on strategic decisions.",
      features: ["Task Automation", "Data Analysis", "Predictive Insights", "Smart Recommendations"],
      gradient: "from-indigo-600 via-blue-600 to-cyan-800"
    },
    {
      id: 4,
      title: "24/7 Availability",
      subtitle: "Always On, Always Ready",
      description: "Our AI agents work around the clock, providing consistent performance and immediate responses whenever you need them.",
      features: ["Continuous Operation", "Instant Response", "Global Accessibility", "Scalable Performance"],
      gradient: "from-cyan-600 via-teal-600 to-green-800"
    }
  ];

  // Auto-advance slides with slower timing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide for slower transition

    return () => clearInterval(timer);
  }, [slides.length]);

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1.0], // Custom smooth easing
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: "blur(4px)"
    },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: delay * 0.15,
        ease: "easeOut",
      },
    }),
    exit: {
      opacity: 0,
      y: -20,
      filter: "blur(2px)",
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1 + 0.8,
        ease: "easeOut",
      },
    }),
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Fixed Background Layer */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Animated Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,149,237,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,149,237,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(100,149,237,0.4), transparent)`,
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${20 + (i % 3) * 30}%`,
              top: `${20 + Math.floor(i / 3) * 40}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Sliding Content Layer */}
      <motion.div 
        className="relative z-10 h-screen flex items-center justify-center"
        style={{ y: contentY }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimatePresence mode="wait" custom={currentSlide}>
            <motion.div
              key={currentSlide}
              custom={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center space-y-8"
            >
              {/* Background Gradient */}
              <div 
                className={`absolute inset-0 opacity-20 bg-gradient-to-r ${slides[currentSlide].gradient} blur-3xl -z-10`}
              />

              {/* Main Title */}
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={0}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200">
                  {slides[currentSlide].title}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-300 font-light">
                  {slides[currentSlide].subtitle}
                </h2>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={1}
                className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>

              {/* Features Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
              >
                {slides[currentSlide].features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    variants={featureVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={i}
                    className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:border-blue-400/30 transition-colors duration-300"
                  >
                    <span className="text-sm md:text-base text-white font-medium">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={3}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
              >
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          key={currentSlide}
        />
      </div>
    </div>
  );
};

export default SlidingHeroSection;
