import React, { useState, useEffect, useRef } from "react";

// Enhanced Smooth Tab Slider Component
const TabSlider = ({ tabs, interval = 4000 }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Auto-advance tabs with progress tracking
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveTab((prev) => (prev + 1) % tabs.length);
          setIsTransitioning(false);
          setProgress(0);
        }, 200);
      }, interval);
    };

    startInterval();

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 100 / (interval / 50);
      });
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(progressInterval);
    };
  }, [tabs.length, interval]);

  const switchToTab = (index) => {
    if (index === activeTab || isTransitioning) return;

    setIsTransitioning(true);
    setProgress(0);

    setTimeout(() => {
      setActiveTab(index);
      setIsTransitioning(false);
    }, 200);

    // Reset intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveTab((prev) => (prev + 1) % tabs.length);
          setIsTransitioning(false);
          setProgress(0);
        }, 200);
      }, interval);
    }, 100);
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
      {/* Tab Headers */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => switchToTab(index)}
            className={`relative p-4 rounded-xl text-left transition-all duration-500 overflow-hidden ${
              index === activeTab
                ? "bg-white/15 shadow-lg border border-white/20"
                : "bg-white/5 hover:bg-white/10 border border-white/5"
            }`}
          >
            {/* Active tab progress indicator */}
            {index === activeTab && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            )}

            <h4
              className={`font-semibold text-sm transition-all duration-300 ${
                index === activeTab ? "text-white" : "text-white/70"
              }`}
            >
              {tab.title}
            </h4>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[120px]">
        <div
          className={`absolute inset-0 transition-all duration-500 ease-out ${
            isTransitioning
              ? "opacity-0 translate-y-6 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-white bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {tabs[activeTab]?.title}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm">
              {tabs[activeTab]?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {tabs.map((_, index) => (
          <button
            key={index}
            onClick={() => switchToTab(index)}
            className={`w-2 h-2 rounded-full transition-all duration-400 ${
              index === activeTab
                ? "bg-white scale-125 shadow-lg shadow-white/30"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Parallax3DLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Enhanced smooth scroll function
  const smoothScrollTo = (targetY) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Dynamic duration
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easing = 1 - Math.pow(1 - percentage, 3);

      window.scrollTo(0, startY + distance * easing);

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const sections = [
    {
      title: "Creative Digital Experiences",
      description: (
        <div className="space-y-2">
          <p>Founded in 2012</p>
          <p>
            We blend story, art & technology as an in‑house team of passionate
            makers
          </p>
          <p>
            Our industry‑leading web toolset consistently delivers award‑winning
            work through quality & performance
          </p>
        </div>
      ),
      hasSlider: true,
      tabsData: [
        {
          title: "Storytelling Through Design",
          description:
            "Crafting compelling narratives that connect with your audience on an emotional level, turning visitors into customers through powerful storytelling techniques.",
        },
        {
          title: "Cutting-Edge Technology",
          description:
            "Leveraging the latest web technologies and frameworks to create fast, responsive, and engaging digital experiences that set you apart from the competition.",
        },
        {
          title: "Award-Winning Results",
          description:
            "Our proven track record speaks for itself - consistently delivering projects that not only meet but exceed expectations, earning recognition in the industry.",
        },
        {
          title: "Performance Optimized",
          description:
            "Every project is built with performance in mind, ensuring lightning-fast load times and smooth interactions across all devices and platforms.",
        },
      ],
    },
    {
      title: "OPX AI CHAT",
      description:
        "Revolutionary natural AI chat interfaces that transform customer interactions with intelligent, context-aware conversations. Experience the future of customer engagement through AI that understands, learns, and responds like a human expert.",
      hasSlider: true,
      tabsData: [
        {
          title: "Natural Language Processing",
          description:
            "Advanced AI that understands context, emotion, and intent, providing human-like responses that feel natural and engaging to your customers.",
        },
        {
          title: "Real-Time Learning",
          description:
            "Our AI continuously learns from interactions, becoming smarter and more effective over time while maintaining consistency in your brand voice.",
        },
        {
          title: "Multi-Platform Integration",
          description:
            "Seamlessly integrate across websites, mobile apps, social media platforms, and messaging services for a unified customer experience.",
        },
        {
          title: "24/7 Intelligent Support",
          description:
            "Never miss a customer inquiry again with AI that works around the clock, handling complex queries and escalating when human intervention is needed.",
        },
      ],
    },
    {
      title: "OPX Stat Analysis",
      description:
        "Transform raw data into actionable insights with our predictive and real-time data analysis platform. Make informed decisions faster with comprehensive analytics that reveal hidden patterns and opportunities in your business data.",
      hasSlider: true,
      tabsData: [
        {
          title: "Predictive Analytics",
          description:
            "Forecast trends and anticipate market changes with advanced machine learning algorithms that help you stay ahead of the competition.",
        },
        {
          title: "Real-Time Dashboards",
          description:
            "Monitor your business metrics in real-time with intuitive dashboards that provide instant insights into performance and growth opportunities.",
        },
        {
          title: "Custom Data Models",
          description:
            "Tailored analytics solutions that fit your specific business needs, providing relevant insights that drive strategic decision-making.",
        },
        {
          title: "Automated Reporting",
          description:
            "Generate comprehensive reports automatically, saving time while ensuring stakeholders always have access to the latest performance data.",
        },
      ],
    },
    {
      title: "OPX Software Development",
      description:
        "Enterprise-grade custom software solutions designed to scale with your business. From concept to deployment, we build robust, secure, and maintainable applications that solve complex business challenges and drive operational efficiency.",
      hasSlider: true,
      tabsData: [
        {
          title: "Enterprise Architecture",
          description:
            "Scalable, secure software architecture designed to handle enterprise-level demands while maintaining flexibility for future growth and adaptation.",
        },
        {
          title: "Custom Development",
          description:
            "Bespoke software solutions tailored to your unique business requirements, built with modern technologies and industry best practices.",
        },
        {
          title: "DevOps & Deployment",
          description:
            "Streamlined deployment processes with continuous integration and monitoring, ensuring reliable, efficient software delivery and maintenance.",
        },
        {
          title: "Ongoing Support",
          description:
            "Comprehensive maintenance and support services to keep your software running smoothly, with regular updates and performance optimization.",
        },
      ],
    },
  ];

  const sectionHeight =
    typeof window !== "undefined" ? window.innerHeight * 3 : 3000;
  const totalHeight = sections.length * sectionHeight;

  const getProgress = (index) => {
    const start = index * sectionHeight;
    const pos = scrollY - start;
    return Math.min(Math.max(pos / sectionHeight, 0), 1);
  };

  const isSectionActive = (index) => {
    const start = index * sectionHeight;
    const end = start + sectionHeight;
    const center =
      scrollY + (typeof window !== "undefined" ? window.innerHeight / 2 : 400);
    return center >= start && center < end;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: totalHeight }}
    >
      {/* Navigation */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-4">
        {sections.map((sec, index) => {
          const isActive = isSectionActive(index);
          const titles = [
            "Creative Digital Experiences",
            "OPX AI Chat",
            "OPX Stat Analysis",
            "OPX Software Development",
          ];

          return (
            <a
              className="flex items-center space-x-3 cursor-pointer group"
              key={index}
              href={`#section-${index}`}
            >
              <button
                className={`w-3 h-3 rounded-full backdrop-blur-md border transition-all duration-700 ${
                  isActive
                    ? "scale-150 bg-white/60 border-white/50 shadow-lg shadow-white/30"
                    : "bg-white/15 border-white/25 hover:bg-white/30 group-hover:scale-125"
                }`}
              />
              <span
                className={`text-xs font-medium transition-all duration-500 whitespace-nowrap ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/60 group-hover:text-white/85"
                }`}
              >
                {titles[index]}
              </span>
            </a>
          );
        })}
      </div>

      {/* Sections */}
      {sections.map((sec, i) => {
        const progress = getProgress(i);
        const titleOpacity = Math.min(progress / 0.2, 1);
        const titleTransform = `translateY(${(1 - titleOpacity) * 50}px)`;

        const descriptionOpacity =
          progress > 0.2 ? Math.min((progress - 0.2) / 0.2, 1) : 0;
        const descriptionTransform = `translateY(${
          (1 - descriptionOpacity) * 50
        }px)`;

        const sliderOpacity =
          progress > 0.4 ? Math.min((progress - 0.4) / 0.3, 1) : 0;
        const sliderTransform = `translateY(${
          (1 - sliderOpacity) * 50
        }px) scale(${0.95 + sliderOpacity * 0.05})`;

        return (
          <div
            key={i}
            className="absolute inset-0 top-auto"
            style={{ top: i * sectionHeight }}
            id={`section-${i}`}
          >
            <div
              className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900"
              style={{
                clipPath:
                  i % 2 === 0
                    ? "polygon(0 60px, 100% 0, 100% 100%, 0% 100%)"
                    : "polygon(0 0, 100% 60px, 100% 100%, 0% 100%)",
              }}
            >
              <div className="flex flex-col items-center justify-center w-full max-w-5xl px-8 space-y-8">
                {/* Title */}
                <h1
                  style={{
                    opacity: titleOpacity,
                    transform: titleTransform,
                  }}
                  className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center transition-all duration-1000 ease-out leading-tight"
                >
                  {sec.title}
                </h1>

                {/* Description */}
                <div
                  style={{
                    opacity: descriptionOpacity,
                    transform: descriptionTransform,
                  }}
                  className="text-white/85 text-lg md:text-xl text-center max-w-4xl leading-relaxed transition-all duration-1000 ease-out delay-200"
                >
                  {typeof sec.description === 'string' ? (
                    <p>{sec.description}</p>
                  ) : (
                    sec.description
                  )}
                </div>

                {/* Tab Slider Component */}
                {sec.hasSlider && sec.tabsData.length > 0 && (
                  <div
                    style={{
                      opacity: sliderOpacity,
                      transform: sliderTransform,
                    }}
                    className="w-full transition-all duration-1000 ease-out delay-400"
                  >
                    <TabSlider tabs={sec.tabsData} interval={5000} />
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
