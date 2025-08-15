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

      // Show parallax layout after logo animation completes
      if (scrollTop >= logoAnimationHeight * 0.9) {
        setShowParallax(true);
      } else {
        setShowParallax(false);
      }
    };

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

      {/* Logo Animation Section */}
      <div className="relative">
        <LogoScroll />
      </div>

      {/* Parallax Layout Section - Only shows after logo animation */}
      {showParallax && (
        <div
          className="relative min-h-screen"
          style={{
            transform: `translateY(${Math.max(0, logoScrollY - window.innerHeight * 3.6)}px)`,
          }}
        >
          <Parallax3DLayout />
        </div>
      )}
    </div>
  );
};

export default App;
