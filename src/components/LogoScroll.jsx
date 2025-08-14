import React, { useEffect, useState, useRef } from "react";
import O from "../assets/O.png";
import P from "../assets/P.png";
import X from "../assets/X.png";

const LogoScroll = () => {
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (animationFrameId) return;

      animationFrameId = requestAnimationFrame(() => {
        const totalScroll = document.body.scrollHeight - window.innerHeight;
        const scrollY = window.scrollY;
        const ratio = Math.min(scrollY / totalScroll, 1);
        setScrollRatio(ratio);
        animationFrameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Smooth step transitions based on scroll
  const getStep1Progress = () => {
    if (scrollRatio < 0.03) return 0;
    if (scrollRatio >= 0.08) return 1;
    return (scrollRatio - 0.03) / (0.08 - 0.03);
  };

  const getStep2Progress = () => {
    if (scrollRatio < 0.08) return 0;
    if (scrollRatio >= 0.12) return 1;
    return (scrollRatio - 0.08) / (0.12 - 0.08);
  };

  const getStep3Progress = () => {
    if (scrollRatio < 0.12) return 0;
    if (scrollRatio >= 0.2) return 1;
    return (scrollRatio - 0.12) / (0.2 - 0.12);
  };

  const getStep4Progress = () => {
    if (scrollRatio < 0.2) return 0;
    return (scrollRatio - 0.2) / (1 - 0.2);
  };

  // Calculate smooth transforms based on scroll
  const step1Progress = getStep1Progress();
  const step2Progress = getStep2Progress();
  const step3Progress = getStep3Progress();
  const step4Progress = getStep4Progress();

  // Smooth easing function for more natural movement
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Apply easing to progress values
  const easedStep1 = easeInOutCubic(step1Progress);
  const easedStep2 = easeInOutCubic(step2Progress);
  const easedStep3 = easeInOutCubic(step3Progress);
  const easedStep4 = easeInOutCubic(step4Progress);

  // Define the phases of animation
  const fullLogoComplete = scrollRatio > 0.3; // When full OPX logo is complete
  const hidePXStart = scrollRatio > 0.4; // When to start hiding P and X
  const hidePXComplete = scrollRatio > 0.5; // When P and X are completely hidden

  // Calculate transforms with smooth transitions
  const oTranslateX = fullLogoComplete
    ? // After full logo, move O back to center smoothly
      easedStep1 * -80 * (1 - Math.min((scrollRatio - 0.3) / 0.2, 1))
    : // Normal movement during logo formation
      easedStep1 * -80;

  const oRotation = fullLogoComplete
    ? // Continue rotation after logo is complete
      (scrollRatio - 0.3) * 720 // More rotation after completion
    : easedStep4 * 360;

  const oScale = fullLogoComplete
    ? // Scale during center rotation phase
      1 + (scrollRatio - 0.3) * 2
    : // Normal scaling during logo formation
      1 + easedStep4 * 1.5;

  const pTranslateX = 80 - easedStep2 * 80;
  const pOpacity = hidePXStart
    ? Math.max(0, easedStep2 * (1 - (scrollRatio - 0.4) / 0.1))
    : easedStep2;

  const xOpacity = hidePXStart
    ? Math.max(0, easedStep3 * (1 - (scrollRatio - 0.4) / 0.1))
    : easedStep3;

  return (
    <div className="h-[150vh] bg-black text-white relative scroll-smooth">
      <div
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          z-20
        "
      >
        {/* 3D container */}
        <div
          className="relative flex items-center justify-center space-x-2"
          style={{ perspective: 800 }}
        >
          {/* Letter O */}
          <img
            src={O}
            alt="O"
            className="w-32"
            style={{
              transform: `
                translateX(${oTranslateX}px)
                rotateY(${oRotation}deg)
                scale(${oScale})
              `,
              transformStyle: "preserve-3d",
            }}
          />

          {/* Letter P */}
          {step1Progress > 0 && !hidePXComplete && (
            <img
              src={P}
              alt="P"
              className="w-32"
              style={{
                transform: `translateX(${pTranslateX}px)`,
                opacity: pOpacity,
              }}
            />
          )}

          {/* Letter X */}
          {step2Progress > 0 && !hidePXComplete && (
            <img
              src={X}
              alt="X"
              className="w-32"
              style={{
                opacity: xOpacity,
              }}
            />
          )}
        </div>

        {/* Particle burst */}
        <div className="absolute inset-0 -z-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * -100}px`,
                left: `${Math.random() * 100}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoScroll;
