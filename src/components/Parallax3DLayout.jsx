import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Parallax3DLayout = ({
  children,
  className = "",
  depth = 1000,
  perspective = 1000,
  mouseSensitivity = 0.5,
  scrollSensitivity = 0.5,
  ...props
}) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring animations
  const springConfig = { damping: 20, stiffness: 100 };
  const mouseX = useSpring(mousePosition.x, springConfig);
  const mouseY = useSpring(mousePosition.y, springConfig);
  const scrollY = useSpring(scrollYProgress, springConfig);

  // Transform calculations
  const rotateX = useTransform(mouseY, [-1, 1], [15, -15]);
  const rotateY = useTransform(mouseX, [-1, 1], [-15, 15]);
  const translateZ = useTransform(
    scrollY,
    [0, 1],
    [0, -depth * scrollSensitivity]
  );

  const handleMouseMove = (e) => {
    if (!isHovered) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({
      x: normalizedX * mouseSensitivity,
      y: normalizedY * mouseSensitivity,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: `${perspective}px` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          translateZ: translateZ,
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// 3D Layer component for creating depth
export const Layer3D = ({ children, depth = 0, className = "", ...props }) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        transformStyle: "preserve-3d",
        translateZ: depth,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Parallax3DLayout;
