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
    <>
      {/* Floating Navigation */}
      <FloatingNav
        onContactOpen={() => setShowContact(true)}
        onAboutOpen={() => setShowAbout(true)}
      />

      {/* Main Content with Sliding Hero */}
      <ParallaxLayout>
        {/* Sliding Hero Section */}
        <section id="hero" className="min-h-screen">
          <SlidingHeroSection />
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              About OPX Groups
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We are pioneers in AI agent technology, creating intelligent solutions that understand,
              learn, and adapt to transform how businesses operate. Our cutting-edge AI agents provide
              seamless automation and intelligent decision-making capabilities.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart AI</h3>
                <p className="text-gray-400 text-sm">Advanced machine learning algorithms</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast Processing</h3>
                <p className="text-gray-400 text-sm">Real-time data analysis and responses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
                <p className="text-gray-400 text-sm">Enterprise-grade security standards</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">🌐</div>
                <h3 className="text-lg font-semibold text-white mb-2">Scalable</h3>
                <p className="text-gray-400 text-sm">Grows with your business needs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              AI Agent Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 hover:border-blue-400/30 transition-colors duration-300">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Intelligent Automation</h3>
                <p className="text-gray-300">AI agents that automate complex workflows and decision-making processes with human-like intelligence.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 hover:border-purple-400/30 transition-colors duration-300">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Conversational AI</h3>
                <p className="text-gray-300">Natural language processing agents for customer service, support, and interactive experiences.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Data Analytics</h3>
                <p className="text-gray-300">AI-powered data analysis and insights generation for informed business decisions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Transform your business with our AI agents. Let's discuss how we can help you automate,
              optimize, and innovate with intelligent technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowContact(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </button>
              <button
                onClick={() => setShowAbout(true)}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
      </ParallaxLayout>

      {/* Modals */}
      <ModalWrapper isOpen={showContact} onClose={handleCloseModals} title="Contact Us">
        <ContactModal onClose={handleCloseModals} />
      </ModalWrapper>

      <ModalWrapper isOpen={showAbout} onClose={handleCloseModals} title="About Us">
        <AboutUsModal onClose={handleCloseModals} />
      </ModalWrapper>
    </>
  );
};

export default App;
