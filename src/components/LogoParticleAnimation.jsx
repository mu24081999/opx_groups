// import React, { useEffect, useRef, useState, useCallback } from "react";
// import * as THREE from "three";

// const LogoParticleAnimation = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const logoGroupRef = useRef(null);
//   const particlesRef = useRef(null);
//   const scrollProgressRef = useRef(0);
//   const animationIdRef = useRef(null);
//   const isInitializedRef = useRef(false);
//   const pulseWaveRef = useRef({ position: 0, active: false, time: 0 });

//   // Reduced particle count for better performance
//   const particleCount = 2500;
//   const particlePoolRef = useRef([]);
//   const activeParticlesRef = useRef([]);

//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   // Optimized scroll handler with throttling
//   const handleScroll = useCallback(() => {
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     const logoSectionHeight = window.innerHeight * 4;
//     let scrollProgress = Math.min(
//       scrollTop / Math.max(logoSectionHeight, 1),
//       1
//     );

//     if (scrollProgress >= 0.99) {
//       setTimeout(() => {
//         // Reset pulse wave
//         pulseWaveRef.current = { position: 0, active: false, time: 0 };

//         // Smooth reset particles
//         if (particlesRef.current) {
//           particlesRef.current.children.forEach((particle) => {
//             if (particle.material) {
//               particle.material.opacity = 0;
//               particle.material.emissive = new THREE.Color(0x000000);
//               particle.material.emissiveIntensity = 0;
//             }
//             const userData = particle.userData;
//             if (userData) {
//               particle.position.x = userData.originalX;
//               particle.position.y = userData.bottomY || userData.originalY - 15;
//               particle.position.z = userData.originalHeight;
//               particle.scale.setScalar(1);
//               userData.bubblePhase = 0;
//               userData.lightIntensity = 0;
//             }
//           });
//         }

//         if (logoGroupRef.current) {
//           logoGroupRef.current.rotation.y = 0;
//         }

//         scrollProgressRef.current = 0;
//       }, 100);
//     } else {
//       scrollProgressRef.current = scrollProgress;
//     }
//   }, []);

//   const handleMouseMove = useCallback((event) => {
//     setMousePos({
//       x: event.clientX,
//       y: event.clientY,
//     });
//   }, []);

//   useEffect(() => {
//     if (!mountRef.current || isInitializedRef.current) return;

//     const existingCanvas = mountRef.current.querySelector("canvas");
//     if (existingCanvas) {
//       existingCanvas.remove();
//     }

//     isInitializedRef.current = true;

//     // Scene setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );

//     // Renderer with enhanced settings for glass effect
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       powerPreference: "high-performance",
//     });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0x000000, 1);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     // Enable advanced lighting for glass materials
//     renderer.physicallyCorrectLights = true;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1;

//     mountRef.current.appendChild(renderer.domElement);
//     sceneRef.current = scene;
//     rendererRef.current = renderer;

//     // Enhanced lighting setup for glass materials
//     const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(10, 10, 5);
//     scene.add(directionalLight);

//     // Add point lights for glass reflections
//     const pointLight1 = new THREE.PointLight(0x64ffda, 1, 100);
//     pointLight1.position.set(0, 0, 20);
//     scene.add(pointLight1);

//     const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 50);
//     pointLight2.position.set(-10, 10, 10);
//     scene.add(pointLight2);

//     // Logo creation with enhanced materials
//     const logoGroup = new THREE.Group();
//     let logoModel = null;

//     const createFallbackLogo = () => {
//       const fallbackGeometry = new THREE.BoxGeometry(20, 20, 20);
//       const fallbackMaterial = new THREE.MeshPhysicalMaterial({
//         color: 0x64ffda,
//         metalness: 0.1,
//         roughness: 0.1,
//         transparent: true,
//         opacity: 0.9,
//         transmission: 0.3,
//         ior: 1.5,
//         clearcoat: 1,
//         clearcoatRoughness: 0,
//         emissive: new THREE.Color(0x64ffda),
//         emissiveIntensity: 0.3,
//       });
//       const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
//       fallbackMesh.position.set(0, 0, 0);
//       logoGroup.add(fallbackMesh);
//       logoModel = fallbackMesh;
//       return fallbackMesh;
//     };

//     createFallbackLogo();

//     const loadActualLogo = async () => {
//       try {
//         const { GLTFLoader } = await import(
//           "three/examples/jsm/loaders/GLTFLoader.js"
//         );
//         const loader = new GLTFLoader();

//         loader.load(
//           "/O.glb",
//           (gltf) => {
//             if (logoModel && logoGroup.children.includes(logoModel)) {
//               logoGroup.remove(logoModel);
//               logoModel.geometry?.dispose();
//               logoModel.material?.dispose();
//             }

//             logoModel = gltf.scene;
//             logoModel.scale.setScalar(120);

//             const box = new THREE.Box3().setFromObject(logoModel);
//             const center = box.getCenter(new THREE.Vector3());
//             logoModel.position.sub(center);
//             logoModel.position.set(0, 0, 0);

//             logoModel.traverse((child) => {
//               if (child.isMesh) {
//                 child.material = new THREE.MeshPhysicalMaterial({
//                   // color: 0x64ffda,
//                   // emissive: new THREE.Color(0x64ffda),
//                   color: 0x888888,
//                   emissive: new THREE.Color(0x888888),
//                   metalness: 0.1,
//                   roughness: 0.1,
//                   transparent: true,
//                   opacity: 0.9,
//                   transmission: 0.3,
//                   ior: 1.5,
//                   clearcoat: 1,
//                   clearcoatRoughness: 0,
//                   emissiveIntensity: 0.3,
//                 });
//               }
//             });

//             logoGroup.add(logoModel);
//           },
//           undefined,
//           (error) => {
//             console.log("Using fallback logo:", error.message);
//           }
//         );
//       } catch (error) {
//         console.log("GLTFLoader not available, using fallback");
//       }
//     };

//     loadActualLogo();

//     logoGroup.position.set(0, 0, 0);
//     scene.add(logoGroup);
//     logoGroupRef.current = logoGroup;

//     // Enhanced particle system with glass ball materials
//     const particles = new THREE.Group();

//     const particleSizes = [0.03, 0.05, 0.08, 0.12, 0.18, 0.25];

//     // Create shared geometries
//     const sharedGeometries = particleSizes.map(
//       (size) => new THREE.SphereGeometry(size, 16, 16) // Increased segments for smoother glass
//     );

//     // Initialize particle pool with glass materials
//     for (let i = 0; i < particleCount; i++) {
//       const sizeIndex = Math.floor(Math.random() * sharedGeometries.length);

//       // Create glass material for each particle
//       const glassMaterial = new THREE.MeshPhysicalMaterial({
//         // color: new THREE.Color(0xffffff),
//         // metalness: 0,
//         // roughness: 0,
//         // transparent: true,
//         // opacity: 0,
//         // transmission: 0.95, // High transmission for glass effect
//         // ior: 1.5, // Index of refraction for glass
//         // thickness: 0.5,
//         // clearcoat: 1,
//         // clearcoatRoughness: 0,
//         // emissive: new THREE.Color(0x000000),
//         // emissiveIntensity: 0,
//         // reflectivity: 0.9,
//         color: new THREE.Color(0x888888), // soft gray base
//         emissive: new THREE.Color(0x888888), // gray glow when lit
//         metalness: 0,
//         roughness: 0,
//         transparent: true,
//         opacity: 0.5, // fully transparent at start
//         transmission: 0.95, // glass effect
//         ior: 1.5,
//         thickness: 0.5,
//         clearcoat: 1,
//         clearcoatRoughness: 0,
//         emissiveIntensity: 0,
//         reflectivity: 0.9,
//       });

//       const particle = new THREE.Mesh(
//         sharedGeometries[sizeIndex],
//         glassMaterial
//       );

//       const angle = Math.random() * Math.PI * 2;
//       const radius = 0.5 + Math.random() * 25;
//       const height = (Math.random() - 0.5) * 20;
//       const clusterVariation = Math.random() * 8;

//       particle.position.x =
//         Math.cos(angle) * radius + (Math.random() - 0.5) * clusterVariation;
//       particle.position.y =
//         Math.sin(angle) * radius + (Math.random() - 0.5) * clusterVariation;
//       particle.position.z = height;

//       const bottomY = particle.position.y - 15;
//       const distanceFromCenter = Math.sqrt(
//         particle.position.x * particle.position.x +
//           particle.position.y * particle.position.y
//       );

//       particle.userData = {
//         originalAngle: angle,
//         originalRadius: radius,
//         originalHeight: height,
//         originalX: particle.position.x,
//         originalY: particle.position.y,
//         bottomY: bottomY,
//         distanceFromCenter: distanceFromCenter,
//         speed: 0.02 + Math.random() * 0.08,
//         floatSpeed: 0.05 + Math.random() * 0.15,
//         phase: Math.random() * Math.PI * 2,
//         amplitude: 0.1 + Math.random() * 0.2,
//         maxOpacity: 0.8 + Math.random() * 0.2,
//         originalSize: particleSizes[sizeIndex],
//         pulseSpeed: 0.3 + Math.random() * 1.0,
//         bubblePhase: 0,
//         lightIntensity: 0,
//         sequenceIndex: i, // For sequential light flow
//         active: false,
//       };

//       particles.add(particle);
//       particlePoolRef.current.push(particle);
//     }

//     // Sort particles by distance from center for sequential wave effect
//     particlePoolRef.current.sort(
//       (a, b) => a.userData.distanceFromCenter - b.userData.distanceFromCenter
//     );

//     scene.add(particles);
//     particlesRef.current = particles;

//     camera.position.set(0, 0, 40);
//     window.scrollTo(0, 324);
//     handleScroll();

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     window.addEventListener("mousemove", handleMouseMove, { passive: true });

//     // Enhanced animation loop with pulse wave effects
//     let frameCount = 0;
//     let lastTime = 0;

//     const animate = (currentTime) => {
//       animationIdRef.current = requestAnimationFrame(animate);

//       if (currentTime - lastTime < 16.67) return;
//       lastTime = currentTime;

//       frameCount++;
//       const time = currentTime * 0.001;
//       const progress = scrollProgressRef.current;

//       // Logo animation - perfectly centered at start
//       if (logoGroupRef.current && frameCount % 2 === 0) {
//         logoGroupRef.current.position.set(0, -5, 0);

//         // Only rotate when there's scroll progress, start perfectly straight
//         if (progress > 0.01) {
//           logoGroupRef.current.rotation.y = progress * Math.PI * 5;
//         } else {
//           logoGroupRef.current.rotation.y = 0; // Perfectly straight at start
//         }

//         // Enhance logo pulse effect
//         if (logoModel && logoModel.material) {
//           const pulsePower = 0.3 + Math.sin(time * 2) * 0.2;
//           if (logoModel.material.emissiveIntensity !== undefined) {
//             logoModel.material.emissiveIntensity = pulsePower;
//           }
//         }

//         if (logoModel) {
//           logoModel.position.set(0, 0, 0);
//         }
//       }

//       // Pulse wave management
//       const waveSpeed = 0.02; // Speed of wave propagation
//       if (progress > 0 && progress < 0.99) {
//         pulseWaveRef.current.active = true;
//         pulseWaveRef.current.time = time;

//         // Wave travels from center outward in cycles
//         const wavePosition = (Math.sin(time * 0.5) * 0.5 + 0.5) * 30; // Max radius
//         pulseWaveRef.current.position = wavePosition;
//       }

//       // Enhanced particle animation with glass effects and wave
//       if (particlesRef.current && frameCount % 2 === 0) {
//         activeParticlesRef.current = [];

//         particlePoolRef.current.forEach((particle, i) => {
//           const userData = particle.userData;
//           if (!userData) return;

//           const particleIndex = i / particleCount;
//           let opacity = 0;
//           let showParticle = false;

//           // Stage-based visibility
//           if (progress >= 0 && progress <= 0.33) {
//             if (particleIndex < 0.25) {
//               showParticle = true;
//               const fadeIn = Math.min(1, progress * 4);
//               opacity = fadeIn * 0.4; // Reduced base opacity for glass
//               particle.position.y = userData.bottomY;
//             }
//           } else if (progress > 0.33 && progress <= 0.66) {
//             if (particleIndex < 0.5) {
//               showParticle = true;
//               const stage2Progress = (progress - 0.33) / 0.33;
//               opacity = Math.min(0.6, stage2Progress * 0.6 + 0.2);
//               const growthHeight = stage2Progress * 12;
//               particle.position.y = userData.bottomY + growthHeight;
//             }
//           } else if (progress > 0.66 && progress < 0.99) {
//             showParticle = true;
//             const stage3Progress = (progress - 0.66) / 0.33;
//             opacity = Math.min(userData.maxOpacity * 0.7, stage3Progress + 0.3);
//             const fullGrowthHeight = 25;
//             particle.position.y = userData.bottomY + fullGrowthHeight;

//             const screenExpansion = stage3Progress * 30;
//             const expansionAngle = userData.originalAngle + time * 0.3;
//             particle.position.x =
//               userData.originalX + Math.cos(expansionAngle) * screenExpansion;
//           }

//           // Pulse wave effect
//           if (pulseWaveRef.current.active && showParticle) {
//             const wavePosition = pulseWaveRef.current.position;
//             const distanceFromWave = Math.abs(
//               userData.distanceFromCenter - wavePosition
//             );

//             // Wave influence zone
//             const waveInfluence = Math.max(0, 1 - distanceFromWave / 3);

//             if (waveInfluence > 0) {
//               // Light pulse effect
//               const pulsePower =
//                 waveInfluence * (0.5 + Math.sin(time * 4 + i * 0.1) * 0.3);
//               userData.lightIntensity = pulsePower;

//               // Bubble effect on light pass
//               userData.bubblePhase = Math.min(userData.bubblePhase + 0.1, 1);

//               // Enhanced emissive glow
//               if (particle.material.emissive) {
//                 particle.material.emissive.setRGB(
//                   0.4 * pulsePower,
//                   1.0 * pulsePower,
//                   0.85 * pulsePower
//                 );
//                 particle.material.emissiveIntensity = pulsePower * 2;
//               }
//             } else {
//               // Fade out light intensity
//               userData.lightIntensity *= 0.95;
//               userData.bubblePhase *= 0.98;

//               if (particle.material.emissive) {
//                 particle.material.emissive.multiplyScalar(0.95);
//                 particle.material.emissiveIntensity *= 0.95;
//               }
//             }
//           }

//           // Update particle material properties
//           if (particle.material) {
//             particle.material.opacity = showParticle
//               ? Math.max(0, Math.min(0.8, opacity))
//               : 0;

//             // Enhance transmission for glass effect
//             particle.material.transmission =
//               0.95 - userData.lightIntensity * 0.3;

//             // Add subtle iridescence
//             if (userData.lightIntensity > 0) {
//               const iridescence = Math.sin(time * 2 + i * 0.2) * 0.1 + 0.9;
//               particle.material.ior = 1.5 + iridescence * 0.2;
//             }
//           }

//           // Enhanced animations for active particles
//           if (showParticle && opacity > 0) {
//             userData.active = true;
//             activeParticlesRef.current.push(particle);

//             // Floating animation
//             if (progress <= 0.66) {
//               particle.position.z =
//                 userData.originalHeight + Math.sin(time * 0.1 + i * 0.1) * 0.5;
//             }

//             // Bubble scaling effect
//             const bubbleScale = 1 + userData.bubblePhase * 0.3;
//             const pulseScale =
//               1 + Math.sin(time * userData.pulseSpeed + i * 0.02) * 0.05;
//             const progressScale = 1 + progress * 0.1;
//             const lightScale = 1 + userData.lightIntensity * 0.4;

//             particle.scale.setScalar(
//               Math.max(
//                 0.8,
//                 Math.min(
//                   1.5,
//                   bubbleScale * pulseScale * progressScale * lightScale
//                 )
//               )
//             );
//           } else {
//             userData.active = false;
//           }
//         });
//       }

//       // Enhanced camera movement
//       camera.position.x = Math.sin(time * 0.05) * 0.08;
//       camera.position.y = Math.cos(time * 0.04) * 0.05;
//       camera.lookAt(0, 0, 0);

//       renderer.render(scene, camera);
//     };

//     animate(0);

//     // Resize handler
//     const handleResize = () => {
//       if (!camera || !renderer) return;
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     // Cleanup function
//     return () => {
//       isInitializedRef.current = false;

//       if (animationIdRef.current) {
//         cancelAnimationFrame(animationIdRef.current);
//       }
//       if (mountRef.current) {
//         mountRef.current.querySelectorAll("canvas").forEach((canvas) => {
//           canvas.remove();
//         });
//       }
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("resize", handleResize);

//       // Dispose geometries
//       sharedGeometries.forEach((geo) => geo.dispose());

//       // Clean particles
//       if (particlesRef.current) {
//         particlesRef.current.children.forEach((particle) => {
//           if (particle.material) {
//             particle.material.dispose();
//           }
//         });
//         particlesRef.current.clear();
//       }

//       // Clean logo
//       if (logoGroupRef.current) {
//         logoGroupRef.current.children.forEach((child) => {
//           if (child.geometry) child.geometry.dispose();
//           if (child.material) child.material.dispose();
//         });
//         logoGroupRef.current.clear();
//       }

//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         rendererRef.current.forceContextLoss();
//       }

//       if (
//         mountRef.current &&
//         rendererRef.current &&
//         rendererRef.current.domElement
//       ) {
//         try {
//           mountRef.current.removeChild(rendererRef.current.domElement);
//         } catch (error) {
//           console.log("Canvas cleanup completed");
//         }
//       }

//       particlePoolRef.current = [];
//       activeParticlesRef.current = [];
//     };
//   }, [handleScroll, handleMouseMove]);

//   return (
//     <div className="relative">
//       {/* Fixed 3D Scene */}
//       <div
//         className="fixed inset-0 w-full h-screen"
//         style={{
//           background: "#000000",
//           cursor: "none",
//           zIndex: 1,
//         }}
//       >
//         <div ref={mountRef} className="w-full h-full" />
//       </div>

//       {/* Custom Cursor */}
//       <div
//         className="fixed w-2 h-2 bg-white rounded-full pointer-events-none transition-transform duration-75"
//         style={{
//           left: mousePos.x,
//           top: mousePos.y,
//           transform: "translate(-50%, -50%)",
//           mixBlendMode: "difference",
//           zIndex: 50,
//         }}
//       />

//       {/* Cursor Trail */}
//       <div
//         className="fixed w-6 h-6 border border-white/30 rounded-full pointer-events-none transition-all duration-200"
//         style={{
//           left: mousePos.x,
//           top: mousePos.y,
//           transform: "translate(-50%, -50%)",
//           zIndex: 40,
//         }}
//       />

//       {/* Content overlay */}
//       <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
//         <div className="text-center text-white/20 text-xs sm:text-sm lg:text-base">
//           <div className="mb-2">OPX Groups</div>
//           <div className="text-xs sm:text-sm opacity-50">Scroll to explore</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LogoParticleAnimation;
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const LogoParticleAnimation = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const logoGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const animationIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const pulseWaveRef = useRef({ position: 0, active: false, time: 0 });

  // Reduced particle count for better performance
  const particleCount = 2500;
  const particlePoolRef = useRef([]);
  const activeParticlesRef = useRef([]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const logoSectionHeight = window.innerHeight * 4;
    let scrollProgress = Math.min(
      scrollTop / Math.max(logoSectionHeight, 1),
      1
    );

    if (scrollProgress >= 0.99) {
      setTimeout(() => {
        // Reset pulse wave
        pulseWaveRef.current = { position: 0, active: false, time: 0 };

        // Smooth reset particles
        if (particlesRef.current) {
          particlesRef.current.children.forEach((particle) => {
            if (particle.material) {
              particle.material.opacity = 0;
              particle.material.emissive = new THREE.Color(0x000000);
              particle.material.emissiveIntensity = 0;
            }
            const userData = particle.userData;
            if (userData) {
              particle.position.x = userData.originalX;
              particle.position.y = userData.bottomY || userData.originalY - 15;
              particle.position.z = userData.originalHeight;
              particle.scale.setScalar(1);
              userData.bubblePhase = 0;
              userData.lightIntensity = 0;
            }
          });
        }

        if (logoGroupRef.current) {
          logoGroupRef.current.rotation.y = 0;
        }

        scrollProgressRef.current = 0;
      }, 100);
    } else {
      scrollProgressRef.current = scrollProgress;
    }
  }, []);

  const handleMouseMove = useCallback((event) => {
    setMousePos({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current || isInitializedRef.current) return;

    const existingCanvas = mountRef.current.querySelector("canvas");
    if (existingCanvas) {
      existingCanvas.remove();
    }

    isInitializedRef.current = true;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer with enhanced settings for glass effect
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enable advanced lighting for glass materials
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    mountRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Enhanced lighting setup for glass materials
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Add point lights for glass reflections
    const pointLight1 = new THREE.PointLight(0x64ffda, 1, 100);
    pointLight1.position.set(0, 0, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 50);
    pointLight2.position.set(-10, 10, 10);
    scene.add(pointLight2);

    // Logo creation with enhanced materials
    const logoGroup = new THREE.Group();
    let logoModel = null;

    const createFallbackLogo = () => {
      const fallbackGeometry = new THREE.BoxGeometry(20, 20, 20);
      const fallbackMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x64ffda,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        transmission: 0.3,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        emissive: new THREE.Color(0x64ffda),
        emissiveIntensity: 0.3,
      });
      const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
      fallbackMesh.position.set(0, 0, 0);
      logoGroup.add(fallbackMesh);
      logoModel = fallbackMesh;
      return fallbackMesh;
    };

    createFallbackLogo();

    const loadActualLogo = async () => {
      try {
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const loader = new GLTFLoader();

        loader.load(
          "/O.glb",
          (gltf) => {
            if (logoModel && logoGroup.children.includes(logoModel)) {
              logoGroup.remove(logoModel);
              logoModel.geometry?.dispose();
              logoModel.material?.dispose();
            }

            logoModel = gltf.scene;
            logoModel.scale.setScalar(120);

            const box = new THREE.Box3().setFromObject(logoModel);
            const center = box.getCenter(new THREE.Vector3());
            logoModel.position.sub(center);
            logoModel.position.set(0, 0, 0);

            logoModel.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshPhysicalMaterial({
                  // color: 0x64ffda,
                  // emissive: new THREE.Color(0x64ffda),
                  color: 0x888888,
                  emissive: new THREE.Color(0x888888),
                  metalness: 0.1,
                  roughness: 0.1,
                  transparent: true,
                  opacity: 0.9,
                  transmission: 0.3,
                  ior: 1.5,
                  clearcoat: 1,
                  clearcoatRoughness: 0,
                  emissiveIntensity: 0.3,
                });
              }
            });

            logoGroup.add(logoModel);
          },
          undefined,
          (error) => {
            console.log("Using fallback logo:", error.message);
          }
        );
      } catch (error) {
        console.log("GLTFLoader not available, using fallback");
      }
    };

    loadActualLogo();

    logoGroup.position.set(0, 0, 0);
    scene.add(logoGroup);
    logoGroupRef.current = logoGroup;

    // Enhanced particle system with glass ball materials
    const particles = new THREE.Group();

    const particleSizes = [0.03, 0.05, 0.08, 0.12, 0.18, 0.25];

    // Create shared geometries
    const sharedGeometries = particleSizes.map(
      (size) => new THREE.SphereGeometry(size, 16, 16) // Increased segments for smoother glass
    );

    // Initialize particle pool with glass materials
    for (let i = 0; i < particleCount; i++) {
      const sizeIndex = Math.floor(Math.random() * sharedGeometries.length);

      // Create glass material for each particle
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x888888), // soft gray base
        emissive: new THREE.Color(0x888888), // gray glow when lit
        metalness: 0,
        roughness: 0,
        transparent: true,
        opacity: 0.5, // fully transparent at start
        transmission: 0.95, // glass effect
        ior: 1.5,
        thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        emissiveIntensity: 0,
        reflectivity: 0.9,
      });

      const particle = new THREE.Mesh(
        sharedGeometries[sizeIndex],
        glassMaterial
      );

      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 25;
      const height = (Math.random() - 0.5) * 20;
      const clusterVariation = Math.random() * 8;

      particle.position.x =
        Math.cos(angle) * radius + (Math.random() - 0.5) * clusterVariation;
      particle.position.y =
        Math.sin(angle) * radius + (Math.random() - 0.5) * clusterVariation;
      particle.position.z = height;

      const bottomY = particle.position.y - 15;
      const distanceFromCenter = Math.sqrt(
        particle.position.x * particle.position.x +
          particle.position.y * particle.position.y
      );

      particle.userData = {
        originalAngle: angle,
        originalRadius: radius,
        originalHeight: height,
        originalX: particle.position.x,
        originalY: particle.position.y,
        bottomY: bottomY,
        distanceFromCenter: distanceFromCenter,
        speed: 0.02 + Math.random() * 0.08,
        floatSpeed: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.1 + Math.random() * 0.2,
        maxOpacity: 0.8 + Math.random() * 0.2,
        originalSize: particleSizes[sizeIndex],
        pulseSpeed: 0.3 + Math.random() * 1.0,
        bubblePhase: 0,
        lightIntensity: 0,
        sequenceIndex: i, // For sequential light flow
        active: false,
      };

      particles.add(particle);
      particlePoolRef.current.push(particle);
    }

    // Sort particles by distance from center for sequential wave effect
    particlePoolRef.current.sort(
      (a, b) => a.userData.distanceFromCenter - b.userData.distanceFromCenter
    );

    scene.add(particles);
    particlesRef.current = particles;
    particlesRef.current.userData.smoothProgress = 0;

    camera.position.set(0, 0, 40);
    window.scrollTo(0, 324);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = (currentTime) => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = currentTime * 0.001;
      const progress = scrollProgressRef.current;

      // Smooth the scroll progress using linear interpolation
      if (!particlesRef.current.userData.smoothProgress) {
        particlesRef.current.userData.smoothProgress = progress;
      }
      const smoothedProgress = THREE.MathUtils.lerp(
        particlesRef.current.userData.smoothProgress,
        progress,
        0.08
      );
      particlesRef.current.userData.smoothProgress = smoothedProgress;

      // Logo animation - perfectly centered at start
      if (logoGroupRef.current) {
        logoGroupRef.current.position.set(0, -5, 0);

        // Only rotate when there's scroll progress, start perfectly straight
        if (smoothedProgress > 0.01) {
          logoGroupRef.current.rotation.y = smoothedProgress * Math.PI * 5;
        } else {
          logoGroupRef.current.rotation.y = 0; // Perfectly straight at start
        }

        // Enhance logo pulse effect
        if (logoModel && logoModel.material) {
          const pulsePower = 0.3 + Math.sin(time * 2) * 0.2;
          if (logoModel.material.emissiveIntensity !== undefined) {
            logoModel.material.emissiveIntensity = pulsePower;
          }
        }

        if (logoModel) {
          logoModel.position.set(0, 0, 0);
        }
      }

      // Pulse wave management
      const waveSpeed = 0.02; // Speed of wave propagation
      if (progress > 0 && progress < 0.99) {
        pulseWaveRef.current.active = true;
        pulseWaveRef.current.time = time;

        // Wave travels from center outward in cycles
        const wavePosition = (Math.sin(time * 0.5) * 0.5 + 0.5) * 30; // Max radius
        pulseWaveRef.current.position = wavePosition;
      }

      // Enhanced particle animation with glass effects and wave
      if (particlesRef.current) {
        activeParticlesRef.current = [];

        particlePoolRef.current.forEach((particle, i) => {
          const userData = particle.userData;
          if (!userData) return;

          const particleIndex = i / particleCount;
          let opacity = 0;
          let showParticle = false;

          // Stage-based visibility
          if (smoothedProgress >= 0 && smoothedProgress <= 0.33) {
            if (particleIndex < 0.25) {
              showParticle = true;
              const fadeIn = Math.min(1, smoothedProgress * 4);
              opacity = fadeIn * 0.4; // Reduced base opacity for glass
              particle.position.y = userData.bottomY;
            }
          } else if (smoothedProgress > 0.33 && smoothedProgress <= 0.66) {
            if (particleIndex < 0.5) {
              showParticle = true;
              const stage2Progress = (smoothedProgress - 0.33) / 0.33;
              opacity = Math.min(0.6, stage2Progress * 0.6 + 0.2);
              const growthHeight = stage2Progress * 12;
              particle.position.y = userData.bottomY + growthHeight;
            }
          } else if (smoothedProgress > 0.66 && smoothedProgress < 0.99) {
            showParticle = true;
            const stage3Progress = (smoothedProgress - 0.66) / 0.33;
            opacity = Math.min(userData.maxOpacity * 0.7, stage3Progress + 0.3);
            const fullGrowthHeight = 25;
            particle.position.y = userData.bottomY + fullGrowthHeight;

            const screenExpansion = stage3Progress * 30;
            const expansionAngle = userData.originalAngle + time * 0.3;
            particle.position.x =
              userData.originalX + Math.cos(expansionAngle) * screenExpansion;
          }

          // Pulse wave effect
          if (pulseWaveRef.current.active && showParticle) {
            const wavePosition = pulseWaveRef.current.position;
            const distanceFromWave = Math.abs(
              userData.distanceFromCenter - wavePosition
            );

            // Wave influence zone
            const waveInfluence = Math.max(0, 1 - distanceFromWave / 3);

            if (waveInfluence > 0) {
              // Light pulse effect
              const pulsePower =
                waveInfluence * (0.5 + Math.sin(time * 4 + i * 0.1) * 0.3);
              userData.lightIntensity = pulsePower;

              // Bubble effect on light pass
              userData.bubblePhase = Math.min(userData.bubblePhase + 0.1, 1);

              // Enhanced emissive glow
              if (particle.material.emissive) {
                particle.material.emissive.setRGB(
                  0.4 * pulsePower,
                  1.0 * pulsePower,
                  0.85 * pulsePower
                );
                particle.material.emissiveIntensity = pulsePower * 2;
              }
            } else {
              // Fade out light intensity
              userData.lightIntensity *= 0.95;
              userData.bubblePhase *= 0.98;

              if (particle.material.emissive) {
                particle.material.emissive.multiplyScalar(0.95);
                particle.material.emissiveIntensity *= 0.95;
              }
            }
          }

          // Update particle material properties
          if (particle.material) {
            particle.material.opacity = showParticle
              ? Math.max(0, Math.min(0.8, opacity))
              : 0;

            // Enhance transmission for glass effect
            particle.material.transmission =
              0.95 - userData.lightIntensity * 0.3;

            // Add subtle iridescence
            if (userData.lightIntensity > 0) {
              const iridescence = Math.sin(time * 2 + i * 0.2) * 0.1 + 0.9;
              particle.material.ior = 1.5 + iridescence * 0.2;
            }
          }

          // Enhanced animations for active particles
          if (showParticle && opacity > 0) {
            userData.active = true;
            activeParticlesRef.current.push(particle);

            // Floating animation
            if (smoothedProgress <= 0.66) {
              particle.position.z =
                userData.originalHeight + Math.sin(time * 0.1 + i * 0.1) * 0.5;
            }

            // Bubble scaling effect
            const bubbleScale = 1 + userData.bubblePhase * 0.3;
            const pulseScale =
              1 + Math.sin(time * userData.pulseSpeed + i * 0.02) * 0.05;
            const progressScale = 1 + smoothedProgress * 0.1;
            const lightScale = 1 + userData.lightIntensity * 0.4;

            particle.scale.setScalar(
              Math.max(
                0.8,
                Math.min(
                  1.5,
                  bubbleScale * pulseScale * progressScale * lightScale
                )
              )
            );
          } else {
            userData.active = false;
          }
        });
      }

      // Enhanced camera movement
      camera.position.x = Math.sin(time * 0.05) * 0.08;
      camera.position.y = Math.cos(time * 0.04) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate(0);

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      isInitializedRef.current = false;

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current) {
        mountRef.current.querySelectorAll("canvas").forEach((canvas) => {
          canvas.remove();
        });
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose geometries
      sharedGeometries.forEach((geo) => geo.dispose());

      // Clean particles
      if (particlesRef.current) {
        particlesRef.current.children.forEach((particle) => {
          if (particle.material) {
            particle.material.dispose();
          }
        });
        particlesRef.current.clear();
      }

      // Clean logo
      if (logoGroupRef.current) {
        logoGroupRef.current.children.forEach((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
        logoGroupRef.current.clear();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }

      if (
        mountRef.current &&
        rendererRef.current &&
        rendererRef.current.domElement
      ) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (error) {
          console.log("Canvas cleanup completed");
        }
      }

      particlePoolRef.current = [];
      activeParticlesRef.current = [];
    };
  }, [handleScroll, handleMouseMove]);

  return (
    <div className="relative">
      {/* Fixed 3D Scene */}
      <div
        className="fixed inset-0 w-full h-screen"
        style={{
          background: "#000000",
          cursor: "none",
          zIndex: 1,
        }}
      >
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* Custom Cursor */}
      <div
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none transition-transform duration-75"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
          zIndex: 50,
        }}
      />

      {/* Cursor Trail */}
      <div
        className="fixed w-6 h-6 border border-white/30 rounded-full pointer-events-none transition-all duration-200"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
          zIndex: 40,
        }}
      />

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        <div className="text-center text-white/20 text-xs sm:text-sm lg:text-base">
          <div className="mb-2">OPX Groups</div>
          <div className="text-xs sm:text-sm opacity-50">Scroll to explore</div>
        </div>
      </div>
    </div>
  );
};

export default LogoParticleAnimation;
