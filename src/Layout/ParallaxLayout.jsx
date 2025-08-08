// src/components/ParallaxLayout.jsx
import { useState, useEffect } from "react";
import backgroundImg from "../assets/background.jpg";
import "./ParallaxLayout.css";
import MainLayer from "../components/main";
// import Nav from "../components/Nav";
import ParticleRing from "../components/ParticleRing";
import SoundBar from "../components/AudioPlayer3D";
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
      <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <SoundBar />
          <MainLayer />
        </div>
      </div>
      {/* Parallax container */}
      <div
        className={`parallax h-screen `}
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* <div id="group1" className="parallax__group">
          <div className="parallax__layer parallax__layer--base">
          </div>
        </div>
        <div id="group2" className="parallax__group">
          <div className="parallax__layer parallax__layer--base">
            <div className="title">Base Layer</div>
            <ParticleRing />
          </div>
          <div className="parallax__layer parallax__layer--back">
            <div className="title">Background Layer</div>
          </div>
        </div> */}
        {/* 
        <div id="group3" className="parallax__group">
          <div className="parallax__layer parallax__layer--fore">
            <div className="title">Foreground Layer</div>
          </div>
          <div className="parallax__layer parallax__layer--base">
            <div className="title">Base Layer</div>
          </div>
        </div> */}

        <div id="group4" className="parallax__group">
          <div className="parallax__layer parallax__layer--base">
            <ParticleRing />{" "}
          </div>
          <div className="parallax__layer parallax__layer--back h-screen"></div>
          <div className="parallax__layer parallax__layer--deep"></div>
        </div>

        <div id="group5" className="parallax__group">
          <div className="parallax__layer parallax__layer--fore"></div>
          <div className="parallax__layer parallax__layer--base"></div>
        </div>

        <div id="group6" className="parallax__group">
          <div className="parallax__layer parallax__layer--back">
            <div className="title">Background Layer</div>
          </div>
          <div className="parallax__layer parallax__layer--base">
            <div className="title">Base Layer</div>
          </div>
        </div>

        <div id="group7" className="parallax__group">
          <div className="parallax__layer parallax__layer--base">
            <div className="title">Base Layer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxLayout;
