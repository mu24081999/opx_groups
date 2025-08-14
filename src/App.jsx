import React, { useState, useRef } from "react";
import LogoScroll from "./components/LogoScroll";
import RippleSection from "./components/RippleSection";
import FloatingNavBar from "./components/Navbar";
import ParticleRing from "./components/ParticleRing";
import ParallaxLayout from "./Layout/ParallaxLayout";
import AnimatedBackgroundElements from "./components/AnimatedBackgroundElements";
import EnhancedHeroSection from "./components/EnhancedHeroSection";
import SlidingHeroSection from "./components/SlidingHeroSection";
import SmoothScrollNav from "./components/SmoothScrollNav";
import FloatingNav from "./components/FloatingNav";
import ModalWrapper from "./components/ModalWrapper";
import ContactModal from "./components/ContactModal";
import AboutUsModal from "./components/AboutModal";
import Preloader from "./components/PreLoader";

const App = () => {
  const orbRef = useRef(null);
  const buttonRefs = {
    en: useRef(null),
    ar: useRef(null),
  };

  const [language, setLanguage] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const workRef = useRef(null);
  const homeRef = useRef(null);

  const handleCloseModals = () => {
    setShowContact(false);
    setShowAbout(false);
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

  // Show preloader until loading is finished
  if (!loadingFinished) {
    return <Preloader onFinish={() => setLoadingFinished(true)} />;
  }

  // Language selection screen
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
        <div
          ref={orbRef}
          className="absolute w-6 h-6 rounded-full animate-orb-bounce z-0"
        ></div>
      </div>
    );
  }

  // Main site
  return (
    <ParallaxLayout>
      <SmoothScrollNav />

      {/* Enhanced Hero Section */}
      <section id="hero" className="min-h-screen">
        <EnhancedHeroSection />
        <AnimatedBackgroundElements />
      </section>

      {/* Additional Content Sections */}
      <section id="about" className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            About OPX Groups
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We are a cutting-edge technology company specializing in immersive digital experiences.
            Our team combines creativity with technical expertise to deliver innovative solutions
            that push the boundaries of web development.
          </p>
        </div>
      </section>

      <section id="services" className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">3D Web Experiences</h3>
              <p className="text-gray-300">Creating immersive 3D environments and interactive experiences for the web.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">Advanced Animations</h3>
              <p className="text-gray-300">Sophisticated motion design and animations that enhance user engagement.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-4">Custom Development</h3>
              <p className="text-gray-300">Tailored solutions built with cutting-edge technologies and frameworks.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Ready to bring your vision to life? Let's create something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Start a Project
            </button>
            <button className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
              View Portfolio
            </button>
          </div>
        </div>
      </section>
    </ParallaxLayout>
  );
};

export default App;
