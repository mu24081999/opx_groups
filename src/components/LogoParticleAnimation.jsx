import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const LogoParticleAnimation = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const logoGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const animationIdRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Reduced particle count for better performance
  const particleCount = 1000; // Reduced from 2000
  const particlePoolRef = useRef([]);
  const activeParticlesRef = useRef([]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const logoSectionHeight = window.innerHeight * 4; // Match App.jsx
    let scrollProgress = Math.min(scrollTop / Math.max(logoSectionHeight, 1), 1);

    // Reset logic: when scroll reaches 100%, reset to 0 after a brief moment
    if (scrollProgress >= 0.99) {
      setTimeout(() => {
        // Smooth reset particles
        if (particlesRef.current) {
          particlesRef.current.children.forEach((particle) => {
            if (particle.material) {
              particle.material.opacity = 0;
            }
            // Reset positions
            const userData = particle.userData;
            if (userData) {
              particle.position.x = userData.originalX;
              particle.position.y = userData.bottomY || userData.originalY - 15;
              particle.position.z = userData.originalHeight;
              particle.scale.setScalar(1);
            }
          });
        }

        // Reset logo rotation
        if (logoGroupRef.current) {
          logoGroupRef.current.rotation.y = 0;
        }

        scrollProgressRef.current = 0;
      }, 100);
    } else {
      scrollProgressRef.current = scrollProgress;
    }
  }, []);

  // Optimized mouse handler
  const handleMouseMove = useCallback((event) => {
    setMousePos({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current || isInitializedRef.current) return;

    // Prevent duplicate initialization
    const existingCanvas = mountRef.current.querySelector("canvas");
    if (existingCanvas) {
      existingCanvas.remove();
    }

    isInitializedRef.current = true;

    // Scene setup - optimized settings
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disabled for performance
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: false, // Simplified for 2D-like particles
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Disable unnecessary features for performance
    renderer.shadowMap.enabled = false;
    renderer.physicallyCorrectLights = false;

    mountRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Instant logo creation with fallback
    const logoGroup = new THREE.Group();
    let logoModel = null;

    // Create immediate fallback logo for instant loading
    const createFallbackLogo = () => {
      const fallbackGeometry = new THREE.BoxGeometry(20, 20, 20);
      const fallbackMaterial = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        wireframe: false,
      });
      const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
      fallbackMesh.position.set(0, 0, 0);
      logoGroup.add(fallbackMesh);
      logoModel = fallbackMesh;
      return fallbackMesh;
    };

    // Create instant fallback
    createFallbackLogo();

    // Try to load actual logo asynchronously (non-blocking)
    const loadActualLogo = async () => {
      try {
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const loader = new GLTFLoader();

        loader.load(
          "/O.glb",
          (gltf) => {
            // Remove fallback
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
                child.material.transparent = true;
                child.material.opacity = 0.9;
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

    // Load actual logo without blocking
    loadActualLogo();

    logoGroup.position.set(0, 0, 0);
    scene.add(logoGroup);
    logoGroupRef.current = logoGroup;

    // Optimized particle system with object pooling
    const particles = new THREE.Group();

    // Reduced particle sizes for performance
    const particleSizes = [0.03, 0.05, 0.08, 0.12, 0.18, 0.25];
    const particleColor = 0x888888;

    // Create shared geometries for better performance
    const sharedGeometries = particleSizes.map(
      (size) => new THREE.SphereGeometry(size, 8, 8) // Reduced segments from 12,12 to 8,8
    );

    // Create shared material
    const sharedMaterial = new THREE.MeshBasicMaterial({
      // color: particleColor,
      // transparent: true,
      // opacity: 0,
      color: new THREE.Color(0xffffff),
      metalness: 0,
      roughness: 0,
      transparent: true,
      opacity: 0.5,
      transmission: 1, // glass refraction
      ior: 1.5,
      thickness: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });

    // Initialize particle pool
    for (let i = 0; i < particleCount; i++) {
      const sizeIndex = Math.floor(Math.random() * sharedGeometries.length);
      const particle = new THREE.Mesh(
        sharedGeometries[sizeIndex],
        sharedMaterial.clone()
      );

      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 25; // Reduced spread
      const height = (Math.random() - 0.5) * 20; // Reduced height
      const clusterVariation = Math.random() * 8; // Reduced variation

      particle.position.x =
        Math.cos(angle) * radius + (Math.random() - 0.5) * clusterVariation;
      particle.position.y =
        Math.sin(angle) * radius + (Math.random() - 0.5) * clusterVariation;
      particle.position.z = height;

      const bottomY = particle.position.y - 15;

      particle.userData = {
        originalAngle: angle,
        originalRadius: radius,
        originalHeight: height,
        originalX: particle.position.x,
        originalY: particle.position.y,
        bottomY: bottomY,
        speed: 0.02 + Math.random() * 0.08,
        floatSpeed: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.1 + Math.random() * 0.2,
        maxOpacity: 0.6 + Math.random() * 0.4,
        originalSize: particleSizes[sizeIndex],
        pulseSpeed: 0.3 + Math.random() * 1.0,
        active: false,
      };

      particles.add(particle);
      particlePoolRef.current.push(particle);
    }

    scene.add(particles);
    particlesRef.current = particles;

    camera.position.set(0, 0, 40);

    // Initialize scroll progress
    handleScroll();

    // Event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Optimized animation loop
    let frameCount = 0;
    let lastTime = 0;

    const animate = (currentTime) => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Throttle to 60fps max
      if (currentTime - lastTime < 16.67) return;
      lastTime = currentTime;

      frameCount++;
      const time = currentTime * 0.001;
      const progress = scrollProgressRef.current;

      // Logo animation - simplified
      if (logoGroupRef.current && frameCount % 2 === 0) {
        logoGroupRef.current.position.set(0, 0, 0);
        logoGroupRef.current.rotation.y = progress * Math.PI * 5; // 2.5 rotations

        if (logoModel) {
          logoModel.position.set(0, 0, 0);
        }
      }

      // Optimized particle animation with culling
      if (particlesRef.current && frameCount % 3 === 0) {
        // Update every 3rd frame
        activeParticlesRef.current = [];

        particlePoolRef.current.forEach((particle, i) => {
          const userData = particle.userData;
          if (!userData) return;

          const particleIndex = i / particleCount;
          let opacity = 0;
          let showParticle = false;

          // Stage-based visibility with reset handling
          if (progress >= 0 && progress <= 0.33) {
            if (particleIndex < 0.25) {
              // Reduced from 0.3
              showParticle = true;
              const fadeIn = Math.min(1, progress * 4);
              opacity = fadeIn * 0.7;
              particle.position.y = userData.bottomY;
            }
          } else if (progress > 0.33 && progress <= 0.66) {
            if (particleIndex < 0.5) {
              // Reduced from 0.6
              showParticle = true;
              const stage2Progress = (progress - 0.33) / 0.33;
              opacity = Math.min(0.8, stage2Progress * 0.8 + 0.3);
              const growthHeight = stage2Progress * 12;
              particle.position.y = userData.bottomY + growthHeight;
            }
          } else if (progress > 0.66 && progress < 0.99) {
            showParticle = true;
            const stage3Progress = (progress - 0.66) / 0.33;
            opacity = Math.min(userData.maxOpacity, stage3Progress + 0.4);
            const fullGrowthHeight = 25;
            particle.position.y = userData.bottomY + fullGrowthHeight;

            // Simplified expansion
            const screenExpansion = stage3Progress * 30;
            const expansionAngle = userData.originalAngle + time * 0.3;
            particle.position.x =
              userData.originalX + Math.cos(expansionAngle) * screenExpansion;
          }

          // Update particle
          if (particle.material && particle.material.opacity !== undefined) {
            particle.material.opacity = showParticle
              ? Math.max(0, Math.min(1, opacity))
              : 0;
          }

          // Simple animations for active particles
          if (showParticle && opacity > 0) {
            userData.active = true;
            activeParticlesRef.current.push(particle);

            // Simplified floating
            if (progress <= 0.66) {
              particle.position.z =
                userData.originalHeight + Math.sin(time * 0.1 + i * 0.1) * 0.5;
            }

            // Simplified scaling
            const pulseSpeed = userData.pulseSpeed * 0.2;
            const pulse = 1 + Math.sin(time * pulseSpeed + i * 0.02) * 0.05;
            const progressScale = 1 + progress * 0.1;
            particle.scale.setScalar(
              Math.max(0.9, Math.min(1.2, pulse * progressScale))
            );
          } else {
            userData.active = false;
          }
        });
      }

      // Simplified camera movement
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

      // Dispose shared geometries
      sharedGeometries.forEach((geo) => geo.dispose());
      sharedMaterial.dispose();

      // Clean particles
      if (particlesRef.current) {
        particlesRef.current.children.forEach((particle) => {
          if (particle.material && particle.material !== sharedMaterial) {
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

      // Clear refs
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

      {/* Optimized Custom Cursor */}
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

      {/* Content overlay for logo animation */}
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
