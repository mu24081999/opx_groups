import React from "react";
import "./parallax.css"; // We'll put the @layer parallax CSS here

const sections = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  img: `https://unsplash.it/1920/1920/?v=${i + 1}`,
  title: `Parallax ${i + 1}`,
}));

export default function ParallaxScroll() {
  return (
    <div className="snap-y absolute inset-0 overflow-y-scroll scroll-smooth sepia-20 contrast-[1.15] [font-family:Halisa_VF] tracking-tighter [--parallax:parallax_linear]">
      {sections.map((sec, index) => (
        <div
          key={sec.id}
          className={`w-full h-screen relative overflow-hidden [view-timeline-name:--section${
            sec.id
          }] [view-timeline-axis:block] ${
            index === 0 ? "" : "snap-end"
          } grid place-content-center`}
        >
          <img
            src={sec.img}
            alt={sec.title}
            className="w-full h-full object-cover -z-10 absolute animate-[var(--parallax)] [animation-timeline:--section${sec.id}] [animation-range:entry_exit]"
          />
          <h2 className="text-[10vw] text-white mix-blend-exclusion">
            {sec.title}
          </h2>
        </div>
      ))}
    </div>
  );
}
