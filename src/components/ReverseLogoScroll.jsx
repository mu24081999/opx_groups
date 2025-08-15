import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const ReverseLogoScroll = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const logoGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const animationIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const pulseWaveRef = useRef({ position: 0, active: false, time: 0 });

  const particleCount = 800;
  const particlePoolRef = useRef([]);
  const activeParticlesRef = useRef([]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Reverse scroll handler - scrolls in opposite direction
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const logoSectionHeight = window.innerHeight * 4; // Main logo section
    const parallaxHeight = window.innerHeight * 3 * 4; // 4 sections of 3vh each
    const reverseLogoSectionHeight = window.innerHeight * 3; // This component's height

    // Calculate when this component should be active
    const componentStartPosition = logoSectionHeight + parallaxHeight;
    const componentEndPosition = componentStartPosition + reverseLogoSectionHeight;

    if (scrollTop >= componentStartPosition && scrollTop <= componentEndPosition) {
      // Calculate reverse progress (1 to 0 as user scrolls down)
      const localScroll = scrollTop - componentStartPosition;
      const reverseProgress = 1 - (localScroll / reverseLogoSectionHeight);
      scrollProgressRef.current = Math.max(0, Math.min(1, reverseProgress));
    } else {
      scrollProgressRef.current = 0; // Hide when not in this section
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

    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    mountRef.current.appendChild(renderer.domElement);
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(-10, -10, 5);
    scene.add(directionalLight);

    // Point lights same as main logo
    const pointLight1 = new THREE.PointLight(0x64ffda, 1, 100); // Same cyan
    pointLight1.position.set(0, 0, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 50); // White light
    pointLight2.position.set(10, -10, 10);
    scene.add(pointLight2);

    // Logo creation with different color scheme
    const logoGroup = new THREE.Group();
    let logoModel = null;

    const createFallbackLogo = () => {
      const fallbackGeometry = new THREE.BoxGeometry(20, 20, 20); // Same size as main
      const fallbackMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x64ffda, // Same cyan color
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
            logoModel.scale.setScalar(120); // Same size as main logo

            const box = new THREE.Box3().setFromObject(logoModel);
            const center = box.getCenter(new THREE.Vector3());
            logoModel.position.sub(center);
            logoModel.position.set(0, 0, 0);

            logoModel.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshPhysicalMaterial({
                  color: 0x64ffda, // Same cyan color
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

    // Enhanced particle system with different arrangement
    const particles = new THREE.Group();
    const particleSizes = [0.02, 0.04, 0.06, 0.10, 0.15, 0.20];

    // Create shared geometries
    const sharedGeometries = particleSizes.map(
      (size) => new THREE.SphereGeometry(size, 12, 12)
    );

    // Initialize particle pool with reverse color scheme
    for (let i = 0; i < particleCount; i++) {
      const sizeIndex = Math.floor(Math.random() * sharedGeometries.length);
      
      // Create glass material with red/orange tints
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffffff),
        metalness: 0,
        roughness: 0.1,
        transparent: true,
        opacity: 0,
        transmission: 0.9,
        ior: 1.5,
        thickness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0,
        reflectivity: 0.8,
      });

      const particle = new THREE.Mesh(
        sharedGeometries[sizeIndex],
        glassMaterial
      );

      // Same arrangement as main logo
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
        maxOpacity: 0.6 + Math.random() * 0.4,
        originalSize: particleSizes[sizeIndex],
        pulseSpeed: 0.3 + Math.random() * 1.0,
        bubblePhase: 0,
        lightIntensity: 0,
        sequenceIndex: i,
        active: false,
      };

      particles.add(particle);
      particlePoolRef.current.push(particle);
    }

    // Sort particles by distance from center for reverse wave effect
    particlePoolRef.current.sort((a, b) =>
      b.userData.distanceFromCenter - a.userData.distanceFromCenter // Outside to inside
    );

    scene.add(particles);
    particlesRef.current = particles;

    camera.position.set(0, 0, 40);

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Enhanced animation loop with reverse effects
    let frameCount = 0;
    let lastTime = 0;

    const animate = (currentTime) => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (currentTime - lastTime < 16.67) return;
      lastTime = currentTime;

      frameCount++;
      const time = currentTime * 0.001;
      const progress = scrollProgressRef.current; // Already reversed

      // Logo animation - perfectly centered at end
      if (logoGroupRef.current && frameCount % 2 === 0) {
        logoGroupRef.current.position.set(0, 0, 0);

        // Only rotate when there's significant progress, end perfectly straight
        if (progress > 0.99) {
          logoGroupRef.current.rotation.y = 0; // Perfectly straight at end
          logoGroupRef.current.rotation.x = 0; // No tilt at end
        } else if (progress > 0.01) {
          logoGroupRef.current.rotation.y = -progress * Math.PI * 4; // Negative for reverse
          logoGroupRef.current.rotation.x = progress * Math.PI * 0.5; // Additional axis
        } else {
          logoGroupRef.current.rotation.y = 0; // Straight when not active
          logoGroupRef.current.rotation.x = 0;
        }

        // Enhanced logo pulse effect
        if (logoModel && logoModel.material) {
          const pulsePower = 0.3 + Math.sin(time * 2) * 0.2;
          if (logoModel.material.emissiveIntensity !== undefined) {
            logoModel.material.emissiveIntensity = pulsePower * progress;
          }
        }

        if (logoModel) {
          logoModel.position.set(0, 0, 0);
        }
      }

      // Reverse pulse wave management (from outside to inside)
      if (progress > 0) {
        pulseWaveRef.current.active = true;
        pulseWaveRef.current.time = time;
        
        // Wave travels from outside inward in reverse
        const maxRadius = 20;
        const wavePosition = maxRadius * (1 - progress) + Math.sin(time * 0.8) * 3;
        pulseWaveRef.current.position = wavePosition;
      }

      // Enhanced particle animation with reverse wave
      if (particlesRef.current && frameCount % 2 === 0) {
        activeParticlesRef.current = [];

        particlePoolRef.current.forEach((particle, i) => {
          const userData = particle.userData;
          if (!userData) return;

          let opacity = 0;
          let showParticle = false;

          // Reverse stage-based visibility (same stages but reversed progress)
          const reverseProgress = progress; // Already reversed in scroll handler
          const particleIndex = i / particleCount;

          if (reverseProgress >= 0.66) {
            showParticle = true;
            const stage3Progress = (reverseProgress - 0.66) / 0.34;
            opacity = Math.min(userData.maxOpacity, stage3Progress + 0.4);
            const fullGrowthHeight = 25;
            particle.position.y = userData.bottomY + fullGrowthHeight;

            // Reverse expansion
            const screenExpansion = (1 - stage3Progress) * 30; // Contract as progress increases
            const expansionAngle = userData.originalAngle - time * 0.3; // Reverse rotation
            particle.position.x =
              userData.originalX + Math.cos(expansionAngle) * screenExpansion;
          } else if (reverseProgress > 0.33 && reverseProgress <= 0.66) {
            if (particleIndex < 0.5) {
              showParticle = true;
              const stage2Progress = (reverseProgress - 0.33) / 0.33;
              opacity = Math.min(0.8, stage2Progress * 0.8 + 0.3);
              const growthHeight = (1 - stage2Progress) * 12; // Reverse height
              particle.position.y = userData.bottomY + growthHeight;
            }
          } else if (reverseProgress >= 0 && reverseProgress <= 0.33) {
            if (particleIndex < 0.25) {
              showParticle = true;
              const fadeIn = Math.min(1, reverseProgress * 4);
              opacity = fadeIn * 0.7;
              particle.position.y = userData.bottomY;
            }
          }

          // Reverse pulse wave effect (from outside to inside)
          if (pulseWaveRef.current.active && showParticle) {
            const wavePosition = pulseWaveRef.current.position;
            const distanceFromWave = Math.abs(userData.distanceFromCenter - wavePosition);
            
            // Wave influence zone
            const waveInfluence = Math.max(0, 1 - distanceFromWave / 4);
            
            if (waveInfluence > 0) {
              // Light pulse effect with red/orange colors
              const pulsePower = waveInfluence * (0.6 + Math.sin(time * 3 + i * 0.15) * 0.4);
              userData.lightIntensity = pulsePower;
              
              // Bubble effect on light pass
              userData.bubblePhase = Math.min(userData.bubblePhase + 0.12, 1);
              
              // Enhanced emissive glow with cyan colors (same as main)
              if (particle.material.emissive) {
                particle.material.emissive.setRGB(
                  0.4 * pulsePower,      // Red component
                  1.0 * pulsePower,      // Green component
                  0.85 * pulsePower      // Blue component (cyan = #64ffda)
                );
                particle.material.emissiveIntensity = pulsePower * 2;
              }
            } else {
              // Fade out light intensity
              userData.lightIntensity *= 0.94;
              userData.bubblePhase *= 0.96;
              
              if (particle.material.emissive) {
                particle.material.emissive.multiplyScalar(0.94);
                particle.material.emissiveIntensity *= 0.94;
              }
            }
          }

          // Update particle material properties
          if (particle.material) {
            particle.material.opacity = showParticle
              ? Math.max(0, Math.min(0.7, opacity))
              : 0;
              
            // Enhance transmission for glass effect
            particle.material.transmission = 0.9 - userData.lightIntensity * 0.2;
            
            // Add warm iridescence
            if (userData.lightIntensity > 0) {
              const iridescence = Math.sin(time * 1.8 + i * 0.25) * 0.15 + 0.85;
              particle.material.ior = 1.5 + iridescence * 0.3;
            }
          }

          // Enhanced animations for active particles (same as main)
          if (showParticle && opacity > 0) {
            userData.active = true;
            activeParticlesRef.current.push(particle);

            // Floating animation (same as main)
            if (reverseProgress <= 0.66) {
              particle.position.z =
                userData.originalHeight + Math.sin(time * 0.1 + i * 0.1) * 0.5;
            }

            // Bubble scaling effect (same as main)
            const bubbleScale = 1 + userData.bubblePhase * 0.3;
            const pulseScale = 1 + Math.sin(time * userData.pulseSpeed + i * 0.02) * 0.05;
            const progressScale = 1 + reverseProgress * 0.1;
            const lightScale = 1 + userData.lightIntensity * 0.4;

            particle.scale.setScalar(
              Math.max(0.9, Math.min(1.2,
                bubbleScale * pulseScale * progressScale * lightScale
              ))
            );
          } else {
            userData.active = false;
          }
        });
      }

      // Simplified camera movement (same as main)
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
    <div className="relative w-full h-full">
      {/* Fixed 3D Scene for reverse scroll effect */}
      <div
        className="fixed inset-0 w-full h-screen"
        style={{
          background: "transparent",
          cursor: "none",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <div className="text-center text-white/20 text-xs sm:text-sm lg:text-base">
          <div className="mb-2">OPX Groups</div>
          <div className="text-xs sm:text-sm opacity-50">Reverse Flow</div>
        </div>
      </div>
    </div>
  );
};

export default ReverseLogoScroll;
