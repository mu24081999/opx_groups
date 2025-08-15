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

  // Main site
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-indigo-900">
      {/* <ParticleRingBackground /> */}
      <FloatingNavBar />
      <LogoScroll />
      <div>
        <Parallax3DLayout />
      </div>
    </div>
  );
};

export default App;
