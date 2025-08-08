import React, { useState, useRef } from "react";
import LogoScroll from "./components/LogoScroll";
import RippleSection from "./components/RippleSection";
import { motion } from "framer-motion";
import FloatingNavBar from "./components/Navbar";
import ParticleRing from "./components/ParticleRing";

const App = () => {
  const orbRef = useRef(null);
  const buttonRefs = {
    en: useRef(null),
    ar: useRef(null),
  };

  const handleLanguageSelect = (lang) => {
    const orb = orbRef.current;
    const targetBtn = buttonRefs[lang].current;

    if (orb && targetBtn) {
      const orbRect = orb.getBoundingClientRect();
      const targetRect = targetBtn.getBoundingClientRect();

      const x = targetRect.left + targetRect.width / 2 - orbRect.left;
      const y = targetRect.top + targetRect.height / 2 - orbRect.top;

      orb.style.transition = "transform 0.4s ease";
      orb.style.transform = `translate(${x}px, ${y}px)`;

      setTimeout(() => {
        setLanguage(lang);
      }, 500);
    } else {
      setLanguage(lang);
    }
  };
  const [language, setLanguage] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const workRef = useRef(null);

  const handleScrollToWork = () => {
    workRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!language) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-[#888888] relative overflow-hidden">
        <div className="flex space-x-10 relative z-10">
          <button
            ref={buttonRefs.en}
            onClick={() => handleLanguageSelect("en")}
            className="lang-btn group"
          >
            English
          </button>
          <button
            ref={buttonRefs.ar}
            onClick={() => handleLanguageSelect("ar")}
            className="lang-btn group"
          >
            العربية
          </button>
        </div>

        {/* Light Orb */}
        <div
          ref={orbRef}
          className="absolute w-6 h-6 rounded-full animate-orb-bounce z-0"
        ></div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-black text-[#888888] ${
        showContact ? "overflow-hidden" : ""
      }`}
    >
      {/* Nav */}
      <FloatingNavBar />

      {/* Hero OPX */}
      <ParticleRing>
        <LogoScroll />
      </ParticleRing>
      {/* Ripple Heading Section with scroll ref */}
      <div ref={workRef}>
        <RippleSection />
      </div>

      {/* Footer */}
      <footer className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-lg">Made with ❤️ Inspired by Hamad</p>
        <p className="text-sm">© 2025 OPX</p>
      </footer>
    </div>
  );
};

export default App;
