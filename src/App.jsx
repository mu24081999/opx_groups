import { useState } from "react";
import ParticleRing from "./components/ParticleRing";
import ParallaxLayout from "./Layout/ParallaxLayout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <ParallaxLayout/>
      {/* <ParticleRing /> */}
    </>
  );
}

export default App;
