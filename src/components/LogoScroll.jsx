import React, { useEffect, useState } from "react";
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

  // Steps
  const step1 = scrollRatio >= 0.03; // move O left
  const step2 = scrollRatio >= 0.08; // show P
  const step3 = scrollRatio >= 0.12; // show X
  const step4 = scrollRatio >= 0.2; // coin spin

  // Coin rotation for "O" (still matches scroll)
  const coinRotation = step4 ? scrollRatio * 720 : 0;

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
                rotateY(${coinRotation}deg)
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
