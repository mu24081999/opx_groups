import React, { useEffect, useRef } from "react";
import ParticleRing from "./ParticleRing";
import Layer2 from "./Layer2";

const cardData = [
  {
    title: "OPX AI CALLS",
    desc: "Automated calling powered by AI.",
    align: "left",
  },
  { title: "OPX AI CHAT", desc: "Natural AI chat interfaces.", align: "right" },
  {
    title: "OPX Stat Analysis",
    desc: "Predictive and real-time data analysis.",
    align: "left",
  },
  {
    title: "OPX Software Development",
    desc: "Enterprise-grade custom software.",
    align: "right",
  },
];

const RippleSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ripples = [];

    function drawRipples() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(136, 136, 136, ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        r.radius += 1.2;
        r.alpha -= 0.008;
        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          i--;
        }
      }
      requestAnimationFrame(drawRipples);
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        alpha: 0.3,
      });
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    drawRipples();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-[#888888] flex flex-col justify-center items-center px-10 py-24 overflow-hidden">
      {/* Ripple Canvas on foreground */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
      />

      {/* Cards */}
      <div className="relative z-10 w-full flex flex-col items-center gap-12">
        <ParticleRing />
        <Layer2 />
        {/* {cardData.map((card, index) => (
          <div
            key={index}
            className={`w-full max-w-6xl flex ${
              card.align === "left" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="backdrop-blur-md bg-white/5 border border-[#88888866] rounded-xl p-10 w-[50%]">
              <h2 className="text-[56px] font-bold font-[Montserrat] leading-tight text-[#888888]">
                {card.title}
              </h2>
              <p className="text-[24px] mt-2 font-[Montserrat] text-[#888888]">
                {card.desc}
              </p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default RippleSection;
