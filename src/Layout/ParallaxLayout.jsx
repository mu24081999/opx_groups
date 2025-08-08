// src/components/ParallaxLayout.jsx
import { useState, useEffect } from "react";
import backgroundImg from "../assets/background.jpg";
import "./ParallaxLayout.css";
import MainLayer from "../components/main";
// import Nav from "../components/Nav";
import ParticleRing from "../components/ParticleRing";
import SoundBar from "../components/Navbar";
import BackgroundLayout from "../components/BackgroundLayout";
const ParallaxLayout = () => {
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("debug-on", debug);
  }, [debug]);

  return (
    <div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_bottom_left,_rgba(0,133,255,0.4)_0%,_transparent_80%)] pointer-events-none z-50" />

      {/* Debug toggle */}
      <div className="debug">
        <label>
          <input
            type="checkbox"
            checked={debug}
            onChange={() => setDebug(!debug)}
          />{" "}
          Debug
        </label>
      </div>
      <SoundBar />
      <div className="bg-black">
        <ParticleRing />
      </div>
      {/* <div className="fixed top-0 left-0 w-full h-full z-40 pointer-events-none">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <MainLayer />
        </div>
      </div> */}
      {/* Parallax container */}
      <div className={`parallax h-screen bg-black`}>
        <div id="group4" className="parallax__group">
          <div className="parallax__layer parallax__layer--base">
            {/* <ParticleRing />{" "} */}
            {/* <Layer2 /> */}
          </div>
          <div className="parallax__layer parallax__layer--back h-screen">
            {/* <BackgroundLayout /> */}
          </div>
          <div className="parallax__layer parallax__layer--deep">
            {/* <ParticleRing /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxLayout;
