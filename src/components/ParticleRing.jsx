import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { pointsInner, pointsOuter } from "../utils/particleRing";

const ParticleRing = () => {
  return (
    <div className="relative">
      <video
        className="absolute top-0 left-0 z-50 w-full h-full object-cover opacity-20 "
        autoPlay
        muted
        loop
        playsInline
        src="https://activetheory.net/assets/video/reel.mp4"
      />
      <Canvas
        camera={{ position: [10, -7.5, -5] }}
        style={{ height: "100vh" }}
        className="bg-slate-900"
      >
        {/* <OrbitControls maxDistance={20} minDistance={10} /> */}
        <directionalLight />
        <pointLight position={[-30, 0, -30]} intensity={1.5} />
        <PointCircle />
      </Canvas>
      {/* TEXT OVERLAY */}
      <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white font-bold text-5xl z-20 pointer-events-none">
        Blood Flow Simulation
      </h1>
    </div>
  );
};

const PointCircle = () => {
  const ref = useRef();

  //   useFrame(({ clock }) => {
  //     if (ref.current) {
  //       ref.current.rotation.z = clock.getElapsedTime() * 0.05;
  //     }
  //   });
  const [tintStrength, setTintStrength] = useState(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setTintStrength(Math.min(t / 10, 1)); // Increase over 10s
  });

  return (
    <group ref={ref}>
      {pointsInner.map((point) => (
        <Point
          key={`inner-${point.idx}`}
          {...point}
          tintStrength={tintStrength}
        />
      ))}
      {pointsOuter.map((point) => (
        <Point
          key={`outer-${point.idx}`}
          {...point}
          tintStrength={tintStrength}
        />
      ))}
    </group>
  );
};

const Point = ({ position, color, delay }) => {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0.1);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay]);

  useFrame(() => {
    if (!visible || !meshRef.current) return;

    // Pulsing scale (bubble effect)
    const s = 1 + 0.2 * Math.sin(Date.now() * 0.005);
    meshRef.current.scale.set(s, s, s);
  });
  return (
    <Sphere ref={meshRef} position={position} args={[0.1, 10, 10]}>
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
        color={color}
      />
    </Sphere>
  );
};

export default ParticleRing;
