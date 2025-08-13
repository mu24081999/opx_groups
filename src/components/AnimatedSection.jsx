import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  yOffset = 100,
  scale = 1,
  opacity = 1,
  parallax = false,
  parallaxSpeed = 0.5,
  stagger = 0.1,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax
      ? [yOffset * parallaxSpeed, -yOffset * parallaxSpeed]
      : [yOffset, 0]
  );
  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, opacity, opacity, 0]
  );
  const scaleTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.8, scale, 0.8]
  );

  const variants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: opacity,
      y: 0,
      scale: scale,
      rotateX: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: stagger,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={
        parallax ? { y, opacity: opacityTransform, scale: scaleTransform } : {}
      }
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
