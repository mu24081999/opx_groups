import { useState } from "react";
import ParticleRing from "./components/ParticleRing";
import ParallaxLayout from "./Layout/ParallaxLayout";
import AnimatedBackgroundElements from "./components/AnimatedBackgroundElements";
import EnhancedHeroSection from "./components/EnhancedHeroSection";
import SmoothScrollNav from "./components/SmoothScrollNav";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SmoothScrollNav />
      
      {/* Enhanced Hero Section */}
      <section id="hero">
        <EnhancedHeroSection />
        <AnimatedBackgroundElements />
      </section>

      {/* Original Layout */}
      <section id="about">
        <ParallaxLayout />
      </section>

      {/* <ParticleRing /> */}
    </>
  );
}

export default App;
