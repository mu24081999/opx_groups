import React, { useEffect, useRef } from "react";
import ParticleRing from "./ParticleRing";
import DynamicContentSection from "./DynamicContentSection";

const cardData = [
  {
    title: "Creative Digital Experiences",
    desc: (
      <div>
        <p>Founded in 2012</p>
        <p>
          We blend story, art & technology as an in‑house team of passionate
          makers
        </p>
        <p>
          Our industry‑leading web toolset consistently delivers award‑winning
          work through quality & performance"
        </p>
      </div>
    ),
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
        {cardData.map((card, i) => (
          <DynamicContentSection
            key={i}
            title={card.title}
            desc={card.desc}
            align={card.align}
          />
        ))}
      </div>
    </div>
  );
};

export default RippleSection;
