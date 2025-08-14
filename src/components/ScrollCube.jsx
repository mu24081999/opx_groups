// import React, { useEffect, useRef } from "react";

// export default function ScrollCube() {
//   const cubeRef = useRef(null);
//   const targetRotation = useRef({ x: 0, y: 0 });
//   const currentRotation = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       targetRotation.current = {
//         x: scrollTop * 0.15, // vertical tilt
//         y: scrollTop * 0.3, // horizontal spin
//       };
//     };

//     const animate = () => {
//       // Smooth interpolation toward target
//       currentRotation.current.x +=
//         (targetRotation.current.x - currentRotation.current.x) * 0.08;
//       currentRotation.current.y +=
//         (targetRotation.current.y - currentRotation.current.y) * 0.08;

//       if (cubeRef.current) {
//         cubeRef.current.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`;
//       }

//       requestAnimationFrame(animate);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     animate(); // start animation loop

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         height: "300vh",
//         margin: 0,
//         // background: "#111",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "200px",
//           height: "200px",
//           perspective: "1000px",
//         }}
//       >
//         <div
//           ref={cubeRef}
//           style={{
//             position: "relative",
//             width: "100%",
//             height: "100%",
//             transformStyle: "preserve-3d",
//           }}
//         >
//           {[
//             { class: "front", t: "translateZ(100px)" },
//             { class: "back", t: "rotateY(180deg) translateZ(100px)" },
//             { class: "left", t: "rotateY(-90deg) translateZ(100px)" },
//             { class: "right", t: "rotateY(90deg) translateZ(100px)" },
//             { class: "top", t: "rotateX(90deg) translateZ(100px)" },
//             { class: "bottom", t: "rotateX(-90deg) translateZ(100px)" },
//             { class: "side1", t: "rotateY(45deg) translateZ(100px)" },
//             { class: "side2", t: "rotateY(-45deg) translateZ(100px)" },
//             { class: "side3", t: "rotateY(135deg) translateZ(100px)" },
//             { class: "side4", t: "rotateY(-135deg) translateZ(100px)" },
//           ].map((face, i) => (
//             <div
//               key={i}
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 height: "100%",
//                 // background: "rgba(255, 166, 0, 0.116)",
//                 border: "2px solid #888",
//                 borderRadius: "100%",
//                 transform: face.t,
//               }}
//             ></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";

function LogoModel({ scrollY }) {
  const ref = useRef();
  const { scene } = useGLTF("O.glb");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y +=
        (scrollY.current * 0.003 - ref.current.rotation.y) * 0.08;
      ref.current.rotation.x +=
        (scrollY.current * 0.0015 - ref.current.rotation.x) * 0.08;
    }
  });

  return <primitive ref={ref} object={scene} scale={2} />;
}

export default function OPXScrollLogo() {
  const scrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ height: "500vh", background: "#" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Environment preset="city" />
        <LogoModel scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
