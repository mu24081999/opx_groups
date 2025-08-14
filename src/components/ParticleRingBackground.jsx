// import React, { useRef, useState, useMemo, useEffect } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Instances, Instance, Environment } from "@react-three/drei";
// import * as THREE from "three";
// import ScrollCube from "./ScrollCube"; // Assuming ScrollCube is in the same directory
// // Config
// const NUM_POINTS = 400;
// const MIN_RADIUS = 4.5;
// const MAX_RADIUS = 15;
// const DEPTH = 1;
// const LEFT_COLOR = "faf3e7";
// const RIGHT_COLOR = "8b5cf6";

// // Gradient color function
// const getGradientStop = (ratio) => {
//   ratio = Math.min(Math.max(ratio, 0), 1);
//   const c0 = LEFT_COLOR.match(/.{1,2}/g).map(
//     (o) => parseInt(o, 16) * (1 - ratio)
//   );
//   const c1 = RIGHT_COLOR.match(/.{1,2}/g).map((o) => parseInt(o, 16) * ratio);
//   const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
//   return `#${ci
//     .reduce((a, v) => (a << 8) + v, 0)
//     .toString(16)
//     .padStart(6, "0")}`;
// };

// // Generate circle points
// const generateCirclePoints = (numPoints) => {
//   return Array.from({ length: numPoints }, (_, k) => {
//     const rings = 6;
//     const pointsPerRing = numPoints / rings;
//     const ringIndex = Math.floor(k / pointsPerRing);
//     const pointInRing = k % pointsPerRing;
//     const radius = MIN_RADIUS + (ringIndex / rings) * (MAX_RADIUS - MIN_RADIUS);
//     const angle = (pointInRing / pointsPerRing) * Math.PI * 2;
//     const radiusVariation = (Math.random() - 0.5) * 0.5;
//     const angleVariation = (Math.random() - 0.5) * 0.2;
//     const x = Math.cos(angle + angleVariation) * (radius + radiusVariation);
//     const y = Math.sin(angle + angleVariation) * (radius + radiusVariation);
//     const z = (Math.random() - 0.5) * DEPTH * 2;
//     const color = getGradientStop((x + MAX_RADIUS) / (MAX_RADIUS * 2));
//     return { position: [x, y, z], color };
//   });
// };

// function ParticleBackground() {
//   const groupRef = useRef();
//   const { viewport } = useThree();
//   const [scrollProgress, setScrollProgress] = useState(0);

//   // Generate points once
//   const points = useMemo(() => generateCirclePoints(NUM_POINTS), []);

//   // Scroll listener
//   useEffect(() => {
//     const handleScroll = () => {
//       const totalScroll = document.body.scrollHeight - window.innerHeight;
//       setScrollProgress(window.scrollY / totalScroll);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     handleScroll();
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // // Animate group based on scroll
//   // useFrame(({ clock }) => {
//   //   if (groupRef.current) {
//   //     const t = clock.getElapsedTime();
//   //     groupRef.current.rotation.y = scrollProgress * Math.PI * 1.2 + t * 0.02;
//   //     groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.1;
//   //     groupRef.current.rotation.z =
//   //       Math.cos(scrollProgress * Math.PI * 0.8) * 0.05;
//   //   }
//   // });
//   useFrame(({ clock }) => {
//     if (groupRef.current) {
//       const t = clock.getElapsedTime();

//       // Target rotation from scroll
//       const targetY = scrollProgress * Math.PI * 1.2;
//       const targetX = Math.sin(scrollProgress * Math.PI) * 0.1;
//       const targetZ = Math.cos(scrollProgress * Math.PI * 0.8) * 0.05;

//       // Smooth interpolation (0.05 = smoothness factor)
//       groupRef.current.rotation.y = THREE.MathUtils.lerp(
//         groupRef.current.rotation.y,
//         targetY,
//         0.05
//       );
//       groupRef.current.rotation.x = THREE.MathUtils.lerp(
//         groupRef.current.rotation.x,
//         targetX,
//         0.05
//       );
//       groupRef.current.rotation.z = THREE.MathUtils.lerp(
//         groupRef.current.rotation.z,
//         targetZ,
//         0.05
//       );

//       // Add a slow idle spin
//       groupRef.current.rotation.y += t * 0.0005;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       <Instances
//         limit={NUM_POINTS}
//         geometry={new THREE.SphereGeometry(0.1, 8, 8)}
//       >
//         <meshStandardMaterial
//           roughness={0.2}
//           metalness={0.1}
//           transparent
//           opacity={0.85}
//         />
//         {points.map((p, i) => (
//           <Instance key={i} position={p.position} color={p.color} />
//         ))}
//       </Instances>
//     </group>
//   );
// }

// export default function ParticleRingBackground() {
//   return (
//     <div className="fixed inset-0 -z-10">
//       <Canvas
//         camera={{ position: [0, 0, 20], fov: 60 }}
//         dpr={[1, 2]}
//         gl={{ antialias: true }}
//       >
//         <ambientLight intensity={0.4} />
//         <pointLight position={[10, 10, 10]} intensity={1} />
//         <Environment preset="city" />
//         <ParticleBackground />
//       </Canvas>
//       <ScrollCube />
//     </div>
//   );
// }
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instances, Instance, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Config
const NUM_POINTS = 400;
const MIN_RADIUS = 4.5;
const MAX_RADIUS = 15;
const DEPTH = 1;
const LEFT_COLOR = "faf3e7";
const RIGHT_COLOR = "8b5cf6";

const getGradientStop = (ratio) => {
  ratio = Math.min(Math.max(ratio, 0), 1);
  const c0 = LEFT_COLOR.match(/.{1,2}/g).map(
    (o) => parseInt(o, 16) * (1 - ratio)
  );
  const c1 = RIGHT_COLOR.match(/.{1,2}/g).map((o) => parseInt(o, 16) * ratio);
  const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
  return `#${ci
    .reduce((a, v) => (a << 8) + v, 0)
    .toString(16)
    .padStart(6, "0")}`;
};

const generateCirclePoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    const rings = 6;
    const pointsPerRing = numPoints / rings;
    const ringIndex = Math.floor(k / pointsPerRing);
    const pointInRing = k % pointsPerRing;
    const radius = MIN_RADIUS + (ringIndex / rings) * (MAX_RADIUS - MIN_RADIUS);
    const angle = (pointInRing / pointsPerRing) * Math.PI * 2;
    const radiusVariation = (Math.random() - 0.5) * 0.5;
    const angleVariation = (Math.random() - 0.5) * 0.2;
    const x = Math.cos(angle + angleVariation) * (radius + radiusVariation);
    const y = Math.sin(angle + angleVariation) * (radius + radiusVariation);
    const z = (Math.random() - 0.5) * DEPTH * 2;
    const color = getGradientStop((x + MAX_RADIUS) / (MAX_RADIUS * 2));
    return { position: [x, y, z], color };
  });
};

// Particle Ring
function ParticleBackground({ scrollProgress }) {
  const groupRef = useRef();
  const points = useMemo(() => generateCirclePoints(NUM_POINTS), []);

  useFrame(() => {
    const targetY = scrollProgress * Math.PI * 2; // sync with logo
    const targetX = scrollProgress * Math.PI * 0.5; // tilt effect

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      <Instances
        limit={NUM_POINTS}
        geometry={new THREE.SphereGeometry(0.1, 8, 8)}
      >
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
        {points.map((p, i) => (
          <Instance key={i} position={p.position} color={p.color} />
        ))}
      </Instances>
    </group>
  );
}

// Logo
function Logo3D({ scrollProgress }) {
  const ref = useRef();
  const { scene } = useGLTF("/O.glb");

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.center();
      }
    });
  }, [scene]);

  useFrame(() => {
    const targetY = scrollProgress * Math.PI * 2; // coin spin
    const targetX = scrollProgress * Math.PI; // flip like coin

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetY,
      0.08
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetX,
      0.08
    );
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={35} // make it big inside the ring
      position={[0, 0, 0]}
    />
  );
}

export default function ParticleRingBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(window.scrollY / totalScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        <ParticleBackground scrollProgress={scrollProgress} />
        <Logo3D scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
