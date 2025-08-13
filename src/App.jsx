import { useState } from "react";
import ParticleRing from "./components/ParticleRing";
import ParallaxLayout from "./Layout/ParallaxLayout";
import AnimatedBackgroundElements from "./components/AnimatedBackgroundElements";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ParallaxLayout />
      <AnimatedBackgroundElements />
      {/* <ParticleRing /> */}
    </>
  );
}

export default App;
