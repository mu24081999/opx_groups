import { useState } from "react";
import ParticleRing from "./components/ParticleRing";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ParticleRing />
    </>
  );
}

export default App;
