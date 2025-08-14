import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const LogoParticleAnimation = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const logoGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const scrollProgressRef = useRef(0);

  // Initialize scroll progress on component mount
  useEffect(() => {
    const initialScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    scrollProgressRef.current = Math.min(
      initialScroll / Math.max(scrollHeight, 1),
      1
    );
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with WHITE background as requested
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1); // BLACK background as requested
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Load your custom logo from public folder
    const logoGroup = new THREE.Group();

    // Dynamic import of GLTFLoader to avoid constructor issues
    let logoModel = null;

    const loadLogo = async () => {
      try {
        // Dynamic import of GLTFLoader
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const loader = new GLTFLoader();

        loader.load(
          "/O.glb", // Your logo file in public folder
          (gltf) => {
            logoModel = gltf.scene;

            // Scale the logo MUCH BIGGER as requested
            logoModel.scale.setScalar(120); // HUGE size for prominence!

            // Center the logo EXACTLY at origin
            const box = new THREE.Box3().setFromObject(logoModel);
            const center = box.getCenter(new THREE.Vector3());
            logoModel.position.sub(center);
            logoModel.position.set(0, 0, 0); // Force to center

            // Set logo material properties for visibility on black background
            logoModel.traverse((child) => {
              if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = 0.9;
                // Bright color for visibility on black background
                if (child.material.color) {
                  child.material.color = new THREE.Color(0x64ffda);
                } else {
                  child.material = new THREE.MeshBasicMaterial({
                    color: 0x64ffda,
                    transparent: true,
                    opacity: 0.9,
                  });
                }
              }
            });

            logoGroup.add(logoModel);
            console.log("Logo loaded successfully!");
          },
          (progress) => {
            console.log(
              "Logo loading progress:",
              (progress.loaded / progress.total) * 100 + "%"
            );
          },
          (error) => {
            console.error("Error loading logo:", error);
            // Fallback: create a simple placeholder if logo fails to load
            const fallbackGeometry = new THREE.BoxGeometry(20, 20, 20);
            const fallbackMaterial = new THREE.MeshBasicMaterial({
              color: 0x64ffda,
              wireframe: true,
            });
            const fallbackMesh = new THREE.Mesh(
              fallbackGeometry,
              fallbackMaterial
            );
            fallbackMesh.position.set(0, 0, 0); // Center fallback too
            logoGroup.add(fallbackMesh);
            logoModel = fallbackMesh;
            console.log("Using fallback logo");
          }
        );
      } catch (error) {
        console.error("Failed to load GLTFLoader:", error);
        // Create fallback logo - reasonable size for testing
        const fallbackGeometry = new THREE.BoxGeometry(20, 20, 20); // Big visible cube
        const fallbackMaterial = new THREE.MeshBasicMaterial({
          color: 0x64ffda, // Bright cyan on black background
          wireframe: false,
        });
        const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
        fallbackMesh.position.set(0, 0, 0); // Center fallback
        logoGroup.add(fallbackMesh);
        logoModel = fallbackMesh;
        console.log("Using fallback logo due to loader error");
      }
    };

    // Call the async loader
    loadLogo();

    // Keep logo group at center
    logoGroup.position.set(0, 0, 0);
    scene.add(logoGroup);
    logoGroupRef.current = logoGroup;

    // MASSIVE particle system with PERFORMANCE OPTIMIZATION
    const particles = new THREE.Group();
    const particleCount = 2000; // Reduced from 3000 for better performance

    // EXACT particle sizes - INCREASED as requested
    const particleSizes = [
      0.04, // Small bubbles (increased from 0.025)
      0.07, // Medium bubbles (increased from 0.04)
      0.11, // Large bubbles (increased from 0.06)
      0.16, // Very large bubbles (increased from 0.09)
      0.22, // Extra large (increased from 0.13)
      0.3, // Huge bubbles (increased from 0.18)
      0.4, // Massive bubbles (increased from 0.25)
    ];

    // #888888 gray color as specifically requested
    const particleColor = 0x888888; // Your exact color requirement

    for (let i = 0; i < particleCount; i++) {
      // Size distribution - more variety in sizes
      let size;
      const sizeRand = Math.random();
      if (sizeRand < 0.3) size = particleSizes[0]; // 30% small
      else if (sizeRand < 0.5) size = particleSizes[1]; // 20% medium
      else if (sizeRand < 0.7) size = particleSizes[2]; // 20% large
      else if (sizeRand < 0.85) size = particleSizes[3]; // 15% very large
      else if (sizeRand < 0.93) size = particleSizes[4]; // 8% extra large
      else if (sizeRand < 0.98) size = particleSizes[5]; // 5% huge
      else size = particleSizes[6]; // 2% massive

      const particleGeometry = new THREE.SphereGeometry(size, 12, 12);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: particleColor, // #888888 as requested
        transparent: true,
        opacity: 0,
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);

      // Position particles for TREE GROWTH effect - start from bottom
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 30;
      const height = (Math.random() - 0.5) * 25;

      // Position particles initially at BOTTOM of screen
      const clusterVariation = Math.random() * 12;
      particle.position.x =
        Math.cos(angle) * radius + (Math.random() - 0.5) * clusterVariation;
      particle.position.y =
        Math.sin(angle) * radius + (Math.random() - 0.5) * clusterVariation;
      particle.position.z = height;

      // Store BOTTOM position for tree growth effect
      const bottomY = particle.position.y - 15; // Move particles to bottom initially

      particle.userData = {
        originalAngle: angle,
        originalRadius: radius,
        originalHeight: height,
        originalX: particle.position.x,
        originalY: particle.position.y,
        bottomY: bottomY, // Store bottom position for tree growth
        speed: 0.02 + Math.random() * 0.1, // Much slower speed
        floatSpeed: 0.05 + Math.random() * 0.2, // Much slower floating
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.1 + Math.random() * 0.3, // Much smaller movement range
        clusterGroup: Math.floor(i / 120),
        maxOpacity: 0.7 + Math.random() * 0.3,
        originalSize: size,
        pulseSpeed: 0.5 + Math.random() * 1.5,
      };

      particles.add(particle);
    }

    scene.add(particles);
    particlesRef.current = particles;

    camera.position.z = 40; // Move camera even further back for full edge coverage
    camera.position.x = 0;
    camera.position.y = 0;

    // SCROLL-based progress tracking with RESET on page load
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollTop / Math.max(scrollHeight, 1), 1);

      // RESET to actual scroll position (fixes back button issue)
      scrollProgressRef.current = scrollProgress;
    };

    // Mouse tracking for cursor only
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop with PERFORMANCE MONITORING
    let frameCount = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      frameCount++;
      const time = performance.now() * 0.001;
      const progress = scrollProgressRef.current;

      // Performance optimization - skip some frames if needed
      if (frameCount % 2 === 0 || progress === 0) {
        // Reduce computation when static

        // Logo rotation - FIXED at center like a spinning toy (2.5 rotations)
        if (logoGroupRef.current) {
          // Keep logo group PERFECTLY CENTERED - no movement, just spinning
          logoGroupRef.current.position.set(0, 0, 0);

          // 2.5 rotations = 2.5 * 2π = 5π radians - ONLY Y-axis rotation like a spinning toy
          logoGroupRef.current.rotation.y = progress * Math.PI * 5; // 2.5 rotations (900°)

          // Inner model stays centered and rotates with the group
          if (logoModel) {
            // Keep model perfectly centered within the group
            try {
              const box = new THREE.Box3().setFromObject(logoModel);
              const center = box.getCenter(new THREE.Vector3());
              logoModel.position.sub(center);
              logoModel.position.set(0, 0, 0);
            } catch (error) {
              // Fallback if bounding box fails
              logoModel.position.set(0, 0, 0);
            }
          }
        }
      }

      // Particles animation with PERFORMANCE OPTIMIZATION
      if (particlesRef.current && particlesRef.current.children.length > 0) {
        // Only update visible particles to improve performance
        const visibleParticles = particlesRef.current.children.filter(
          (particle, i) => {
            const userData = particle.userData;
            if (!userData) return false; // Safety check

            const particleIndex = i / particleCount;

            // Quick visibility check
            if (progress <= 0.33) {
              const isLeftSide = particle.position.x < -3;
              const isRightSide = particle.position.x > 3;
              return (isLeftSide || isRightSide) && particleIndex < 0.3;
            } else if (progress <= 0.66) {
              return particleIndex < 0.6;
            } else {
              return true; // All particles visible
            }
          }
        );

        visibleParticles.forEach((particle, i) => {
          const userData = particle.userData;
          if (!userData) return; // Safety check

          const particleIndex = i / particleCount;

          // TREE GROWTH effect - particles grow from bottom upward
          let opacity = 0;
          let showParticle = false;

          // Stage 1: PAGE LOAD - 30% particles at BOTTOM (0% to 33% scroll)
          if (progress >= 0 && progress <= 0.33) {
            if (particleIndex < 0.3) {
              showParticle = true;
              const fadeIn = Math.min(1, progress * 3);
              opacity = fadeIn * 0.8;

              // Keep particles at BOTTOM initially
              particle.position.y = userData.bottomY || userData.originalY - 15;
            }
          }

          // Stage 2: FIRST SCROLL - 60% particles grow to HALF SCREEN (33% to 66% scroll)
          else if (progress > 0.33 && progress <= 0.66) {
            if (particleIndex < 0.6) {
              showParticle = true;
              const stage2Progress = (progress - 0.33) / 0.33;
              opacity = Math.min(0.85, stage2Progress * 0.9 + 0.3);

              // GROW from bottom to HALF screen like a tree
              const growthHeight = stage2Progress * 15; // Grow upward
              particle.position.y =
                (userData.bottomY || userData.originalY - 15) + growthHeight;
            }
          }

          // Stage 3: MORE SCROLL - 100% particles cover WHOLE SCREEN (66% to 100% scroll)
          else if (progress > 0.66) {
            showParticle = true;
            const stage3Progress = (progress - 0.66) / 0.34;
            opacity = Math.min(userData.maxOpacity || 1, stage3Progress + 0.4);

            // COMPLETE TREE GROWTH - particles reach FULL screen height
            const fullGrowthHeight = 30; // Full screen coverage
            particle.position.y =
              (userData.bottomY || userData.originalY - 15) + fullGrowthHeight;

            // Expand horizontally as well for full screen coverage
            const screenExpansion = stage3Progress * 35;
            const expansionAngle =
              userData.originalAngle + time * 0.5 + i * 0.02;
            particle.position.x =
              userData.originalX + Math.cos(expansionAngle) * screenExpansion;

            // Swirling effect during full growth - MUCH GENTLER
            const gentleSwirl = Math.sin(time * 0.5 + i * 0.02) * 0.5; // Much smaller swirl
            particle.position.x += gentleSwirl;
          }

          // Safe opacity assignment
          if (particle.material && particle.material.opacity !== undefined) {
            particle.material.opacity = showParticle
              ? Math.max(0, Math.min(1, opacity))
              : 0;
          }

          // Particle animations - MUCH SLOWER and more natural
          if (showParticle && opacity > 0) {
            const flowTime =
              time * (userData.floatSpeed || 0.1) + (userData.phase || 0);

            // For all stages: VERY GENTLE floating motion with NO left-right oscillation
            if (progress <= 0.66) {
              // REMOVE oscillating movement - keep particles more stable
              // Only very subtle Z movement for depth
              particle.position.z =
                (userData.originalHeight || 0) + Math.sin(flowTime * 0.2) * 1;

              // MINIMAL X movement - just tiny gentle drift, no back and forth
              particle.position.x += Math.sin(time * 0.1 + i * 0.05) * 0.05; // Very small drift
            }

            // Scale animation - MUCH SLOWER pulsing
            const pulseSpeed = (userData.pulseSpeed || 1) * 0.3; // Much slower pulse
            const gentlePulse =
              1 + Math.sin(time * pulseSpeed + i * 0.02) * 0.1; // Smaller pulse
            const progressScale = 1 + progress * 0.2; // Smaller growth
            const finalScale = Math.max(
              0.8,
              Math.min(1.5, gentlePulse * progressScale)
            ); // Smaller range
            particle.scale.setScalar(finalScale);
          }
        });
      }

      // Camera gentle movement
      camera.position.x = Math.sin(time * 0.08) * 0.12;
      camera.position.y = Math.cos(time * 0.06) * 0.08;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // PROPER CLEANUP to prevent memory leaks
      if (particlesRef.current) {
        particlesRef.current.children.forEach((particle) => {
          if (particle.geometry) particle.geometry.dispose();
          if (particle.material) particle.material.dispose();
        });
        particlesRef.current.clear();
      }

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
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Fixed 3D Scene */}
      <div
        className="fixed inset-0 w-full h-screen"
        style={{
          background: "#000000", // BLACK background as requested
          cursor: "none",
          zIndex: 1,
        }}
      >
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* Custom Cursor */}
      <div
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none"
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
        className="fixed w-8 h-8 border border-white/20 rounded-full pointer-events-none transition-all duration-150"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
          zIndex: 40,
        }}
      />

      {/* Navigation */}
      <div className="fixed top-8 right-8" style={{ zIndex: 30 }}>
        <div
          className="flex items-center rounded-full px-2 py-2"
          style={{
            background: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            className="px-8 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 rounded-full"
            style={{ fontWeight: "300", letterSpacing: "0.5px" }}
          >
            WORK
          </button>
          <div className="w-px h-5 bg-gray-600/40 mx-1"></div>
          <button
            className="px-8 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300 rounded-full"
            style={{ fontWeight: "300", letterSpacing: "0.5px" }}
          >
            CONTACT
          </button>
        </div>
      </div>

      {/* Scrollable content to enable scroll functionality */}
      <div
        className="relative"
        style={{
          height: "500vh", // 5x viewport height for smooth 2.5 rotations
          zIndex: 10,
          pointerEvents: "none", // Allow scroll but no click interference
        }}
      >
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
      </div>
    </div>
  );
};

export default LogoParticleAnimation;
