import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SmoothScrollNav = ({ sections = [] }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Find which section is currently in view
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentSection = 0;
      sectionElements.forEach((element, index) => {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentSection = index;
        }
      });

      setActiveSection(currentSection);

      // Debounce scrolling state
      setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navItems = [
    { id: "hero", label: "Home", icon: "🏠" },
    { id: "features", label: "Features", icon: "⭐" },
    { id: "about", label: "About", icon: "ℹ️" },
    { id: "contact", label: "Contact", icon: "📧" },
  ];

  return (
    <motion.nav
      ref={containerRef}
      className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
      style={{ opacity, scale }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-2xl">
        <ul className="flex space-x-8">
          {navItems.map((item, index) => (
            <li key={item.id}>
              <motion.button
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === index
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active Indicator */}
                {activeSection === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium relative z-10">
                  {item.label}
                </span>

                {/* Progress Bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: activeSection === index ? "100%" : "0%",
                    opacity: activeSection === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full overflow-hidden"
        style={{ opacity: isScrolling ? 1 : 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </motion.div>
    </motion.nav>
  );
};

export default SmoothScrollNav;
