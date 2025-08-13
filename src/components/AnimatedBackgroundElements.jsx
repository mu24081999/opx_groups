import React from "react";
import { motion } from "framer-motion";

const AnimatedBackgroundElements = ({ className = "" }) => {
  const elements = [
    {
      id: 1,
      size: 60,
      color: "rgba(59, 130, 246, 0.1)",
      delay: 0,
      duration: 8,
    },
    {
      id: 2,
      size: 80,
      color: "rgba(139, 92, 246, 0.1)",
      delay: 1,
      duration: 10,
    },
    {
      id: 3,
      size: 40,
      color: "rgba(236, 72, 153, 0.1)",
      delay: 2,
      duration: 6,
    },
    {
      id: 4,
      size: 70,
      color: "rgba(16, 185, 129, 0.1)",
      delay: 3,
      duration: 12,
    },
    {
      id: 5,
      size: 50,
      color: "rgba(245, 158, 11, 0.1)",
      delay: 4,
      duration: 9,
    },
    { id: 6, size: 90, color: "rgba(239, 68, 68, 0.1)", delay: 5, duration: 7 },
  ];

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full blur-xl"
          style={{
            width: element.size,
            height: element.size,
            backgroundColor: element.color,
            left: `${20 + ((element.id * 15) % 60)}%`,
            top: `${30 + ((element.id * 20) % 40)}%`,
          }}
          initial={{
            scale: 0,
            opacity: 0,
            x: -100,
            y: -100,
          }}
          animate={{
            scale: [0, 1, 0.8, 1.2, 1],
            opacity: [0, 0.3, 0.5, 0.3, 0.1],
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 60, -20, 0],
            rotate: [0, 180, 360, 540, 720],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute w-32 h-32 border border-white/10 rounded-full"
        style={{ left: "10%", top: "20%" }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute w-24 h-24 border border-purple-500/20 rounded-full"
        style={{ right: "15%", bottom: "30%" }}
        animate={{
          rotate: [360, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute w-16 h-16 border border-blue-500/20 rounded-full"
        style={{ left: "50%", top: "60%" }}
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Particle effects */}
      {Array.from({ length: 20 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackgroundElements;
