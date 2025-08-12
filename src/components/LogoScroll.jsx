import React, { useEffect, useState, useRef } from "react";
import O from "../assets/O.png";
import P from "../assets/P.png";
import X from "../assets/X.png";
import ParticleRing from "./ParticleRing";

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

  // Calculate transforms
  const oTranslateX = easedStep1 * -80;
  const oRotation = easedStep4 * 360;
  const oScale = 1 + (easedStep4 * 1.5); // Scale from 1 to 2.5 (w-32 to w-80 equivalent)

  const pTranslateX = 80 - (easedStep2 * 80);
  const pOpacity = easedStep2;

  const xOpacity = easedStep3;

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
            className={`w-32 ${
              step4 && " w-80"
            } transition-all duration-700 ease-in-out`}
            style={{
              transform: `
                translateX(${step1 ? "-80px" : "0px"}) 
                rotateY(${smoothCoinRotation}deg)
              `,
              transformStyle: "preserve-3d",
            }}
          />

          {/* Letter P */}
          {step1 && !step4 && (
            <img
              src={P}
              alt="P"
              className={`
                w-32 transition-all duration-700 ease-in-out
                ${
                  step2
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[80px] opacity-0"
                }
              `}
            />
          )}

          {/* Letter X */}
          {step2 && !step4 && (
            <img
              src={X}
              alt="X"
              className={`
                w-32 transition-all duration-700 ease-in-out
                ${step3 ? "opacity-100" : "opacity-0"}
              `}
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
