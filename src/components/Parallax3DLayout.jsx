// import React, { useState, useEffect, useRef } from "react";

// // Example custom slider component
// const MySlider = () => {
//   return (
//     <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg text-white">
//       <p>🔹 This is the slider placeholder</p>
//     </div>
//   );
// };

// const Parallax3DLayout = () => {
//   const [scrollY, setScrollY] = useState(0);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const onScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const sections = [
//     {
//       title: "Welcome to the Future",
//       subtitle: "Experience seamless 3D parallax",
//       bg: "from-gray-900 via-gray-900 to-indigo-900",
//       hasSlider: false,
//     },
//     {
//       title: "Innovative Design",
//       subtitle: "Smooth animations that captivate",
//       bg: "from-gray-900 via-gray-900 to-indigo-900",
//       hasSlider: true, // only in this section
//     },
//     {
//       title: "Cutting Edge Technology",
//       subtitle: "Performance meets aesthetics",
//       bg: "from-gray-900 via-gray-900 to-indigo-900",
//       hasSlider: false,
//     },
//   ];

//   const sectionHeight = window.innerHeight * 2.5;
//   const totalHeight = sections.length * sectionHeight;

//   const getProgress = (index) => {
//     const start = index * sectionHeight;
//     const pos = scrollY - start;
//     return Math.min(Math.max(pos / sectionHeight, 0), 1);
//   };

//   const isSectionActive = (index) => {
//     const start = index * sectionHeight;
//     const end = start + sectionHeight;
//     const center = scrollY + window.innerHeight / 2;
//     return center >= start && center < end;
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full"
//       style={{ height: totalHeight }}
//     >
//       {/* Navigation */}
//       <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3">
//         {sections.map((sec, index) => {
//           const isActive = isSectionActive(index);
//           return (
//             <a
//               className="flex items-center space-x-2 cursor-pointer"
//               key={index}
//               href={`#section-${index}`}
//             >
//               <button
//                 className={`w-2 h-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
//                   isActive
//                     ? "scale-110 bg-white/30 shadow-lg"
//                     : "bg-white/10 hover:bg-white/20"
//                 }`}
//               />
//               <span
//                 className="text-xs font-medium text-white/50"
//                 style={{ opacity: isActive ? 1 : 0.6 }}
//               >
//                 {sec.title}
//               </span>
//             </a>
//           );
//         })}
//       </div>

//       {/* Sections */}
//       {sections.map((sec, i) => {
//         const progress = getProgress(i);
//         const titleOpacity = Math.min(progress / 0.25, 1);
//         const subtitleOpacity =
//           progress > 0.25 ? Math.min((progress - 0.25) / 0.25, 1) : 0;
//         const sliderOpacity =
//           progress > 0.5 ? Math.min((progress - 0.5) / 0.25, 1) : 0;

//         return (
//           <div
//             key={i}
//             className="absolute inset-0 top-auto"
//             style={{ top: i * sectionHeight }}
//             id={`section-${i}`}
//           >
//             <div
//               className={`sticky top-0 h-screen flex flex-col items-center justify-center bg-gradient-to-br ${sec.bg}`}
//               style={{
//                 clipPath:
//                   i % 2 === 0
//                     ? "polygon(0 50px, 100% 0, 100% 100%, 0% 100%)"
//                     : "polygon(0 0, 100% 50px, 100% 100%, 0% 100%)",
//               }}
//             >
//               {/* Title */}
//               <h1
//                 style={{
//                   opacity: titleOpacity,
//                   transform: `translateY(${(1 - titleOpacity) * 40}px)`,
//                 }}
//                 className="text-white text-6xl md:text-8xl font-bold mb-4 transition-all duration-500"
//               >
//                 {sec.title}
//               </h1>

//               {/* Subtitle */}
//               <p
//                 style={{
//                   opacity: subtitleOpacity,
//                   transform: `translateY(${(1 - subtitleOpacity) * 40}px)`,
//                 }}
//                 className="text-white text-xl md:text-2xl transition-all duration-500 delay-100"
//               >
//                 {sec.subtitle}
//               </p>

//               {/* Extra Component */}
//               {sec.hasSlider && (
//                 <div
//                   style={{
//                     opacity: sliderOpacity,
//                     transform: `translateY(${(1 - sliderOpacity) * 40}px)`,
//                   }}
//                   className="mt-6 transition-all duration-500 delay-200"
//                 >
//                   <MySlider />
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Parallax3DLayout;
import React, { useState, useEffect, useRef } from "react";
import AutoSlider from "./AutoSlider"; // Import the custom slider component
// Example custom slider component
const MySlider = () => {
  const slidesData = [
    {
      title: "Slide One",
      description: "This is the first slide's description.",
    },
    {
      title: "Slide Two",
      description: "This is the second slide's description.",
    },
    {
      title: "Slide Three",
      description: "This is the third slide's description.",
    },
  ];
  return (
    <div>
      <AutoSlider slides={slidesData} interval={5000} />
    </div>
  );
};

const Parallax3DLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = [
    {
      title: "Welcome to the Future",
      subtitle: "Experience seamless 3D parallax",
      bg: "from-gray-900 via-gray-900 to-indigo-900",
      hasSlider: false,
      position: "right",
    },
    {
      title: "Innovative Design",
      subtitle: "Smooth animations that captivate",
      bg: "from-gray-900 via-gray-900 to-indigo-900",
      hasSlider: true,
      position: "right",
    },
    {
      title: "Cutting Edge Technology",
      subtitle: "Performance meets aesthetics",
      bg: "from-gray-900 via-gray-900 to-indigo-900",
      hasSlider: false,
      position: "right",
    },
  ];

  const sectionHeight = window.innerHeight * 2.5;
  const totalHeight = sections.length * sectionHeight;

  const getProgress = (index) => {
    const start = index * sectionHeight;
    const pos = scrollY - start;
    return Math.min(Math.max(pos / sectionHeight, 0), 1);
  };

  const isSectionActive = (index) => {
    const start = index * sectionHeight;
    const end = start + sectionHeight;
    const center = scrollY + window.innerHeight / 2;
    return center >= start && center < end;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: totalHeight }}
    >
      {/* Navigation */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3">
        {sections.map((sec, index) => {
          const isActive = isSectionActive(index);
          return (
            <a
              className="flex items-center space-x-2 cursor-pointer"
              key={index}
              href={`#section-${index}`}
            >
              <button
                className={`w-2 h-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
                  isActive
                    ? "scale-110 bg-white/30 shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              />
              <span
                className="text-xs font-medium text-white/50"
                style={{ opacity: isActive ? 1 : 0.6 }}
              >
                {sec.title}
              </span>
            </a>
          );
        })}
      </div>

      {/* Sections */}
      {sections.map((sec, i) => {
        const progress = getProgress(i);
        const titleOpacity = Math.min(progress / 0.25, 1);
        const subtitleOpacity =
          progress > 0.25 ? Math.min((progress - 0.25) / 0.25, 1) : 0;
        const sliderOpacity =
          progress > 0.5 ? Math.min((progress - 0.5) / 0.25, 1) : 0;

        return (
          <div
            key={i}
            className="absolute inset-0 top-auto"
            style={{ top: i * sectionHeight }}
            id={`section-${i}`}
          >
            <div
              className={`sticky top-0 h-screen flex items-center bg-gradient-to-br ${sec.bg}`}
              style={{
                clipPath:
                  i % 2 === 0
                    ? "polygon(0 50px, 100% 0, 100% 100%, 0% 100%)"
                    : "polygon(0 0, 100% 50px, 100% 100%, 0% 100%)",
              }}
            >
              {/* Position handling */}
              <div
                className={`flex flex-col items-${
                  sec.position === "left" ? "start" : "center"
                } justify-center w-full lg:pl-42`}
              >
                {/* Title */}
                <h1
                  style={{
                    opacity: titleOpacity,
                    transform: `translateY(${(1 - titleOpacity) * 40}px)`,
                  }}
                  className="text-white text-6xl md:text-6xl font-bold mb-4 transition-all duration-500"
                >
                  {sec.title}
                </h1>

                {/* Subtitle */}
                <p
                  style={{
                    opacity: subtitleOpacity,
                    transform: `translateY(${(1 - subtitleOpacity) * 40}px)`,
                  }}
                  className="text-white text-xl md:text-2xl transition-all duration-500 delay-100 max-w-lg"
                >
                  {sec.subtitle}
                </p>

                {/* Extra Component */}
                {sec.hasSlider && (
                  <div
                    style={{
                      opacity: sliderOpacity,
                      transform: `translateY(${(1 - sliderOpacity) * 40}px)`,
                    }}
                    className="mt-6 lg:w-1/2 transition-all duration-500 delay-200"
                  >
                    <MySlider />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Parallax3DLayout;
