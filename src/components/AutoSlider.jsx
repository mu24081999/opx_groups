import React, { useState, useEffect, useRef } from "react";

const AutoSlider = ({ slides, interval = 4000 }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goToSlide = (index) => {
    resetTimeout(); // Stop auto-slide immediately
    setCurrent(index);
    // Restart auto-slide after interval
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, interval);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, interval);

    return () => resetTimeout();
  }, [current, slides.length, interval]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg ">
      {/* Slides */}
      <div className="relative h-64">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col justify-center items-center text-center px-6 transition-opacity duration-700 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
              {slide.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base drop-shadow">
              {slide.description}
            </p>
          </div>
        ))}
      </div>

      {/* Title Navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={` text-xs md:text-sm transition ${
              index === current
                ? " text-white border-white/50"
                : " text-white/70 border-white/20 hover:bg-white/20"
            }`}
          >
            {slide.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
