import React, { useState, useRef, useEffect } from "react";

import Preloader from "./components/PreLoader";
// import ParticleRingBackground from "./components/ParticleRingBackground";
// import ScrollCube from "./components/ScrollCube";
import Parallax3DLayout from "./components/Parallax3DLayout";
import FloatingNavBar from "./components/Navbar";
import LogoScroll from "./components/LogoParticleAnimation";
import ReverseLogoScroll from "./components/ReverseLogoScroll";

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
  const [showReverseScroll, setShowReverseScroll] = useState(false);

  // Scroll detection for component transition with throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const logoAnimationHeight = windowHeight * 4; // 400vh from LogoScroll
          const parallaxSectionHeight = windowHeight * 3 * 4; // 4 sections * 3vh each
          const reverseScrollStartPosition =
            logoAnimationHeight + parallaxSectionHeight;

          setLogoScrollY(scrollTop);

          // Show parallax layout after logo animation starts finishing (70% complete)
          if (scrollTop >= logoAnimationHeight * 0.7) {
            setShowParallax(true);
          } else {
            setShowParallax(false);
          }

          // Show reverse scroll when we start the reverse section (improved timing)
          if (scrollTop >= reverseScrollStartPosition - windowHeight * 0.5) {
            setShowReverseScroll(true);
          } else {
            setShowReverseScroll(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Initialize on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Calculate total document height for sequential flow
  const logoSectionHeight =
    typeof window !== "undefined" ? window.innerHeight * 4 : 4000; // 400vh
  const parallaxSectionHeight =
    typeof window !== "undefined" ? window.innerHeight * 3 * 4 : 12000; // 4 sections * 3vh each
  const reverseLogoSectionHeight =
    typeof window !== "undefined" ? window.innerHeight * 4 : 4000; // 400vh - Match main logo
  const totalHeight =
    logoSectionHeight + parallaxSectionHeight + reverseLogoSectionHeight;
  const isLogoComplete = logoScrollY >= logoSectionHeight * 0.8;

  // Main site with responsive design
  return (
    <div
      style={{ height: totalHeight + "px" }}
      className="relative bg-gradient-to-br from-black via-gray-900 to-indigo-900"
    >
      {/* <ParticleRingBackground /> */}

      {/* Responsive Floating Navigation */}
      <FloatingNavBar />

      {/* Debug scroll indicator */}
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-3 py-2 text-xs rounded backdrop-blur">
        <div>Scroll: {Math.round(logoScrollY)}</div>
        <div>Logo Height: {logoSectionHeight}</div>
        <div>Logo Complete: {isLogoComplete ? "YES" : "NO"}</div>
      </div>

      {/* Logo Animation Section - Fixed positioning during animation */}
      {!isLogoComplete && (
        <div className="fixed inset-0 z-20">
          <LogoScroll />
        </div>
      )}

      {/* Spacer for logo section scroll */}
      <div
        style={{ height: logoSectionHeight + "px" }}
        className="relative z-10"
      />

      {/* Parallax Layout Section - Starts after logo completes */}
      <div className="relative z-30 min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900">
        <Parallax3DLayout />
      </div>

      {/* Reverse Logo Scroll Section - Only at the very end */}
      {showReverseScroll && (
        <div className="fixed inset-0 z-50">
          <ReverseLogoScroll />
        </div>
      )}

      {/* Spacer for reverse scroll section */}
      <div
        style={{ height: reverseLogoSectionHeight + "px" }}
        className="relative z-10"
      />
    </div>
  );
};

export default App;
