import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { pointsInner, pointsOuter } from "../utils/particleRing";

const ParticleRing = () => {
  return (
    <div className="relative">
      {/* <video
        className="absolute top-0 left-0 z-50 w-full h-full object-cover opacity-20 "
        autoPlay
        muted
        loop
        playsInline
        src="https://activetheory.net/assets/video/reel.mp4"
      /> */}
      <Canvas camera={{ position: [5, -2, -35] }} style={{ height: "100vh" }}>
        {/* <OrbitControls maxDistance={20} minDistance={10} /> */}
        <directionalLight />
        <pointLight position={[-30, 0, -30]} intensity={1.5} />
        <PointCircle />
      </Canvas>
      {/* TEXT OVERLAY */}
      {/* <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white font-bold text-5xl z-20 pointer-events-none">
        Blood Flow Simulation
      </h1> */}
    </div>
  );
};

const PointCircle = () => {
  const ref = useRef();
  const [time, setTime] = useState(0);

  useFrame(({ clock }) => {
    // Remove rotation, just update time for sequential animation
    setTime(clock.getElapsedTime());
  });
  //   const [tintStrength, setTintStrength] = useState(0);

  //   useFrame(({ clock }) => {
  //     const t = clock.getElapsedTime();
  //     setTintStrength(Math.min(t / 10, 1)); // Increase over 10s
  //   });

  return (
    <group ref={ref}>
      {pointsInner.map((point, index) => (
        <Point
          key={`inner-${point.idx}`}
          {...point}
          time={time}
          sequenceIndex={index}
          totalPoints={pointsInner.length}
        />
      ))}
      {pointsOuter.map((point, index) => (
        <Point
          key={`outer-${point.idx}`}
          {...point}
          time={time}
          sequenceIndex={index + pointsInner.length}
          totalPoints={pointsInner.length + pointsOuter.length}
        />
      ))}
    </group>
  );
};

const Point = ({ position, color, time, sequenceIndex, totalPoints }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;

    // Sequential wave animation with smooth flow
    const sequenceDuration = 4; // 4 seconds for full sequence
    const waveSpeed = 2; // Speed of the wave
    const sequenceProgress = (time * waveSpeed) % sequenceDuration;
    const normalizedIndex = sequenceIndex / totalPoints;

    // Calculate when this particle should be "lit" in the sequence
    const particleTime = normalizedIndex * sequenceDuration;
    const timeDiff = (sequenceProgress - particleTime + sequenceDuration) % sequenceDuration;

    // Smooth wave with fade in/out
    const waveWidth = 0.3; // Width of the light wave
    let intensity = 0;

    if (timeDiff < waveWidth) {
      // Smooth sine wave for intensity
      intensity = Math.sin((timeDiff / waveWidth) * Math.PI);
    }

    // Smooth pulsing scale (slower and gentler)
    const pulseSpeed = 0.8; // Slower pulse
    const pulseAmount = 0.15; // Gentler pulse
    const basePulse = 1 + pulseAmount * Math.sin(time * pulseSpeed);
    const lightPulse = 1 + (intensity * 0.3); // Additional pulse when lit
    const finalScale = basePulse * lightPulse;

    meshRef.current.scale.set(finalScale, finalScale, finalScale);

    // Update material opacity and emissive intensity
    if (meshRef.current.material) {
      meshRef.current.material.opacity = 0.1 + intensity * 0.9; // Start transparent, light up
      meshRef.current.material.emissiveIntensity = 0.1 + intensity * 1.2;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.08, 8, 8]}>
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.1}
        roughness={0.3}
        color={color}
        transparent={true}
        opacity={0.1}
      />
    </Sphere>
  );
};

export default ParticleRing;
