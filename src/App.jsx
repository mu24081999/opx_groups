import React, { useState, useRef, useEffect } from "react";

import Preloader from "./components/PreLoader";
// import ParticleRingBackground from "./components/ParticleRingBackground";
// import ScrollCube from "./components/ScrollCube";
import Parallax3DLayout from "./components/Parallax3DLayout";
import FloatingNavBar from "./components/Navbar";
import LogoScroll from "./components/LogoParticleAnimation";

const App = () => {
  const orbRef = useRef(null);
  const buttonRefs = {
    en: useRef(null),
    ar: useRef(null),
  };

  const [language, setLanguage] = useState(null);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [showParallax, setShowParallax] = useState(false);
  const [logoScrollY, setLogoScrollY] = useState(0);

  // Scroll detection for component transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const logoAnimationHeight = windowHeight * 4; // 400vh from LogoScroll

      setLogoScrollY(scrollTop);

      // Show parallax layout after logo animation starts finishing (70% complete)
      if (scrollTop >= logoAnimationHeight * 0.7) {
        setShowParallax(true);
      } else {
        setShowParallax(false);
      }
    };

    // Initialize on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // // Language selection screen
  // if (!language) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-black relative overflow-hidden">
  //       <div className="flex">
  //         <button
  //           ref={buttonRefs.en}
  //           onClick={() => handleLanguageSelect("en")}
  //           className="lang-btn group"
  //         >
  //           English
  //         </button>
  //         <button
  //           ref={buttonRefs.ar}
  //           onClick={() => handleLanguageSelect("ar")}
  //           className="lang-btn group"
  //         >
  //           العربية
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // Main site with responsive design
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900">
      {/* <ParticleRingBackground /> */}

      {/* Responsive Floating Navigation */}
      <FloatingNavBar />

      {/* Debug scroll indicator */}
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-3 py-2 text-xs rounded backdrop-blur">
        <div>Scroll: {Math.round(logoScrollY)}</div>
        <div>Threshold: {Math.round(window.innerHeight * 4 * 0.7)}</div>
        <div>Show Parallax: {showParallax ? 'YES' : 'NO'}</div>
      </div>

      {/* Logo Animation Section */}
      <div className="relative">
        <LogoScroll />
      </div>

      {/* Parallax Layout Section - Shows after logo animation starts completing */}
      <div
        className={`relative min-h-screen transition-all duration-1000 ease-in-out ${
          showParallax ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{
          backgroundColor: showParallax ? 'transparent' : 'rgba(0,0,0,0.1)',
        }}
      >
        {/* Debug indicator */}
        {showParallax && (
          <div className="fixed top-4 left-4 z-50 bg-green-500 text-black px-2 py-1 text-xs rounded">
            Parallax Active
          </div>
        )}
        <Parallax3DLayout />
      </div>
    </div>
  );
};

export default App;
