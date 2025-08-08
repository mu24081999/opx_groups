import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Particle generation utilities
const MIN_RADIUS = 7.5;
const MAX_RADIUS = 15;
const DEPTH = 2;
const LEFT_COLOR = "faf3e7";
const RIGHT_COLOR = "8b5cf6";
const NUM_POINTS = 2500;

// Available shape configurations
const SHAPES = {
  CIRCLE: "circle",
  DRUM: "drum",
  ROLLER_STAIRS: "roller_stairs",
  SPIRAL: "spiral",
  HELIX: "helix",
  WAVE_TUBE: "wave_tube",
  TWISTED_RING: "twisted_ring",
  DOUBLE_HELIX: "double_helix",
};

const getGradientStop = (ratio) => {
  ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

  const c0 = LEFT_COLOR.match(/.{1,2}/g).map(
    (oct) => parseInt(oct, 16) * (1 - ratio)
  );
  const c1 = RIGHT_COLOR.match(/.{1,2}/g).map(
    (oct) => parseInt(oct, 16) * ratio
  );
  const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
  const color = ci
    .reduce((a, v) => (a << 8) + v, 0)
    .toString(16)
    .padStart(6, "0");

  return `#${color}`;
};

const calculateColor = (x, y, z, shape) => {
  // Different color calculation strategies per shape
  switch (shape) {
    case SHAPES.DRUM:
      // Color based on height (Z-axis)
      const heightRatio = (z + 10) / 20; // Assuming height range -10 to 10
      return getGradientStop(heightRatio);
    case SHAPES.ROLLER_STAIRS:
      // Color based on stair level
      const stairLevel = Math.floor((z + 15) / 3) / 10;
      return getGradientStop(stairLevel);
    case SHAPES.SPIRAL:
    case SHAPES.HELIX:
      // Color based on spiral progress
      const spiralRatio = (z + 15) / 30;
      return getGradientStop(spiralRatio);
    default:
      // Original X-based coloring for circle and others
      const maxDiff = MAX_RADIUS * 2;
      const distance = x + MAX_RADIUS;
      const ratio = distance / maxDiff;
      return getGradientStop(ratio);
  }
};

const randomFromInterval = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Shape generation functions
const generateCirclePoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    const rings = 8;
    const pointsPerRing = numPoints / rings;
    const ringIndex = Math.floor(k / pointsPerRing);
    const pointInRing = k % pointsPerRing;

    const radius = MIN_RADIUS + (ringIndex / rings) * (MAX_RADIUS - MIN_RADIUS);
    const angle = (pointInRing / pointsPerRing) * Math.PI * 2;

    const radiusVariation = randomFromInterval(-0.5, 0.5);
    const angleVariation = randomFromInterval(-0.1, 0.1);

    const finalRadius = radius + radiusVariation;
    const finalAngle = angle + angleVariation;

    const x = Math.cos(finalAngle) * finalRadius;
    const y = Math.sin(finalAngle) * finalRadius;
    const z = randomFromInterval(-DEPTH, DEPTH);

    const color = calculateColor(x, y, z, SHAPES.CIRCLE);

    return { idx: k + 1, position: [x, y, z], color };
  });
};

const generateDrumPoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    // Create cylindrical drum shape
    const heightLevels = 15;
    const pointsPerLevel = numPoints / heightLevels;
    const levelIndex = Math.floor(k / pointsPerLevel);
    const pointInLevel = k % pointsPerLevel;

    // Drum dimensions
    const drumRadius = 12;
    const drumHeight = 20;
    const z = -drumHeight / 2 + (levelIndex / heightLevels) * drumHeight;

    // Create circular cross-section with some randomness
    const angle = (pointInLevel / pointsPerLevel) * Math.PI * 2;
    const radiusVariation = randomFromInterval(-1, 1);
    const radius = drumRadius + radiusVariation;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const color = calculateColor(x, y, z, SHAPES.DRUM);

    return { idx: k + 1, position: [x, y, z], color };
  });
};

const generateRollerStairsPoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    // Create stair-like steps in a cylindrical arrangement
    const steps = 12;
    const pointsPerStep = numPoints / steps;
    const stepIndex = Math.floor(k / pointsPerStep);
    const pointInStep = k % pointsPerStep;

    // Stair dimensions
    const stairRadius = 10 + stepIndex * 0.8; // Gradually increasing radius
    const stepHeight = 2.5;
    const z = -15 + stepIndex * stepHeight;

    // Slight spiral effect
    const baseAngle = (stepIndex / steps) * Math.PI * 0.5;
    const angle = baseAngle + (pointInStep / pointsPerStep) * Math.PI * 2;

    const x = Math.cos(angle) * stairRadius;
    const y = Math.sin(angle) * stairRadius;

    const color = calculateColor(x, y, z, SHAPES.ROLLER_STAIRS);

    return { idx: k + 1, position: [x, y, z], color };
  });
};

const generateSpiralPoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    const progress = k / numPoints;

    // Spiral parameters
    const turns = 4;
    const spiralHeight = 30;
    const maxRadius = 14;
    const minRadius = 6;

    const angle = progress * Math.PI * 2 * turns;
    const z = -spiralHeight / 2 + progress * spiralHeight;
    const radius =
      minRadius + (maxRadius - minRadius) * Math.sin(progress * Math.PI);

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const color = calculateColor(x, y, z, SHAPES.SPIRAL);

    return { idx: k + 1, position: [x, y, z], color };
  });
};

const generateHelixPoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    const progress = k / numPoints;

    // Double helix parameters
    const turns = 3;
    const helixHeight = 25;
    const radius = 10;

    const angle = progress * Math.PI * 2 * turns;
    const z = -helixHeight / 2 + progress * helixHeight;

    // Create two intertwined helixes
    const helixOffset = (k % 2) * Math.PI;
    const finalAngle = angle + helixOffset;

    const x = Math.cos(finalAngle) * radius;
    const y = Math.sin(finalAngle) * radius;

    const color = calculateColor(x, y, z, SHAPES.HELIX);

    return { idx: k + 1, position: [x, y, z], color };
  });
};

const generateWaveTubePoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    const rings = 20;
    const pointsPerRing = numPoints / rings;
    const ringIndex = Math.floor(k / pointsPerRing);
    const pointInRing = k % pointsPerRing;

    // Wave tube parameters
    const tubeLength = 30;
    const baseRadius = 8;
    const waveAmplitude = 4;
    const waveFrequency = 3;

    const z = -tubeLength / 2 + (ringIndex / rings) * tubeLength;
    const angle = (pointInRing / pointsPerRing) * Math.PI * 2;

    // Create wavy radius
    const waveOffset =
      Math.sin((ringIndex / rings) * Math.PI * 2 * waveFrequency) *
      waveAmplitude;
    const radius = baseRadius + waveOffset;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const color = calculateColor(x, y, z, SHAPES.WAVE_TUBE);

    return { idx: k + 1, position: [x, y, z], color };
  });
};

const generateTwistedRingPoints = (numPoints) => {
  return Array.from({ length: numPoints }, (_, k) => {
    const rings = 8;
    const pointsPerRing = numPoints / rings;
    const ringIndex = Math.floor(k / pointsPerRing);
    const pointInRing = k % pointsPerRing;

    const radius = MIN_RADIUS + (ringIndex / rings) * (MAX_RADIUS - MIN_RADIUS);
    const baseAngle = (pointInRing / pointsPerRing) * Math.PI * 2;

    // Add twist based on radius
    const twist = (radius / MAX_RADIUS) * Math.PI * 2;
    const angle = baseAngle + twist;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Vertical displacement based on twist
    const z = Math.sin(twist * 2) * 3;

    const color = calculateColor(x, y, z, SHAPES.TWISTED_RING);

    return { idx: k + 1, position: [x, y, z], color };
  });
};

// Shape generator mapping
const shapeGenerators = {
  [SHAPES.CIRCLE]: generateCirclePoints,
  [SHAPES.DRUM]: generateDrumPoints,
  [SHAPES.ROLLER_STAIRS]: generateRollerStairsPoints,
  [SHAPES.SPIRAL]: generateSpiralPoints,
  [SHAPES.HELIX]: generateHelixPoints,
  [SHAPES.WAVE_TUBE]: generateWaveTubePoints,
  [SHAPES.TWISTED_RING]: generateTwistedRingPoints,
  [SHAPES.DOUBLE_HELIX]: generateHelixPoints, // Same as helix for now
};

// Current shape configuration
let currentShape = SHAPES.CIRCLE; // Default shape

const generatePoints = (shape, numPoints) => {
  const generator = shapeGenerators[shape] || shapeGenerators[SHAPES.CIRCLE];
  return generator(numPoints);
};

// Generate points based on current shape
const pointsInner = generatePoints(currentShape, NUM_POINTS);

const pointsOuter = Array.from({ length: NUM_POINTS / 4 }, (_, k) => {
  const radius = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const z = randomFromInterval(-DEPTH * 10, DEPTH * 10);
  const color = calculateColor(x, y, z, currentShape);

  return { idx: k + 1, position: [x, y, z], color };
});

const MouseTracker = ({ onMouseMove }) => {
  const { viewport, camera } = useThree();

  const handlePointerMove = (event) => {
    const x = (event.point.x / viewport.width) * 2;
    const y = (event.point.y / viewport.height) * 2;
    onMouseMove(event.point.x, event.point.y);
  };

  return (
    <mesh
      position={[0, 0, -10]}
      onPointerMove={handlePointerMove}
      visible={false}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

const ParticleRing = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const [currentShape, setCurrentShape] = useState(SHAPES.DRUM);
  const [points, setPoints] = useState(() => ({
    inner: generatePoints(SHAPES.CIRCLE, NUM_POINTS),
    outer: Array.from({ length: NUM_POINTS / 4 }, (_, k) => {
      const radius = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = randomFromInterval(-DEPTH * 10, DEPTH * 10);
      const color = calculateColor(x, y, z, SHAPES.CIRCLE);
      return { idx: k + 1, position: [x, y, z], color };
    }),
  }));

  const handleMouseMove = (x, y) => {
    setMousePos({ x, y });

    const newRipple = {
      id: Date.now(),
      x: x,
      y: y,
      startTime: Date.now(),
      duration: 3000,
    };

    setRipples((prev) => [...prev.slice(-4), newRipple]);
  };

  const handleShapeChange = (newShape) => {
    setCurrentShape(newShape);
    setPoints({
      inner: generatePoints(newShape, NUM_POINTS),
      outer: Array.from({ length: NUM_POINTS / 4 }, (_, k) => {
        const radius = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = randomFromInterval(-DEPTH * 10, DEPTH * 10);
        const color = calculateColor(x, y, z, newShape);
        return { idx: k + 1, position: [x, y, z], color };
      }),
    });
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRipples((prev) =>
        prev.filter((ripple) => now - ripple.startTime < ripple.duration)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ height: "100vh", background: "transparent" }}
      >
        <OrbitControls
          enableZoom={false}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.3}
          rotateSpeed={0.4}
          minDistance={1}
          maxDistance={50}
          minPolarAngle={Math.PI / 4} // 45 degrees
          maxPolarAngle={Math.PI / 2} // 90 degrees
          autoRotate={true}
          autoRotateSpeed={1.0}
        />

        <MouseTracker onMouseMove={handleMouseMove} />

        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 25]} intensity={1} />

        <PointCircle
          mousePos={mousePos}
          ripples={ripples}
          points={points}
          currentShape={currentShape}
        />
      </Canvas>
      <div className="relative z-10">{children}</div>

      {/* <div className="absolute top-4 left-4 text-white/60 font-mono text-sm space-y-2">
        <p>
          Current Shape:{" "}
          <span className="text-purple-400">
            {currentShape.replace("_", " ").toUpperCase()}
          </span>
        </p>
        <p>Active ripples: {ripples.length}</p>

        <div className="mt-4 space-y-1">
          <p className="text-white/40 text-xs mb-2">CLICK TO CHANGE SHAPE:</p>
          {Object.values(SHAPES).map((shape) => (
            <button
              key={shape}
              onClick={() => handleShapeChange(shape)}
              className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                currentShape === shape
                  ? "bg-purple-500/30 text-purple-300"
                  : "hover:bg-white/10 text-white/50 hover:text-white/80"
              }`}
            >
              {shape.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-white/40 font-mono text-xs">
        <p>• Move mouse for water ripples</p>
        <p>• Drag to rotate • Scroll to zoom</p>
        <p>• Click shape names to transform</p>
      </div> */}
    </div>
  );
};

const PointCircle = ({ mousePos, ripples, points, currentShape }) => {
  const ref = useRef();
  const [time, setTime] = useState(0);

  useFrame(({ clock }) => {
    setTime(clock.getElapsedTime());
  });

  const total = points.inner.length + points.outer.length;

  return (
    <group ref={ref}>
      {[...points.inner, ...points.outer].map((point, i) => (
        <Point
          key={`pt-${point.idx}`}
          {...point}
          time={time}
          sequenceIndex={i}
          totalPoints={total}
          mousePos={mousePos}
          ripples={ripples}
          currentShape={currentShape}
        />
      ))}
    </group>
  );
};

const Point = ({
  position,
  color,
  time,
  sequenceIndex,
  totalPoints,
  mousePos,
  ripples,
  currentShape,
}) => {
  const meshRef = useRef();
  const originalPosition = useMemo(
    () => new THREE.Vector3(...position),
    [position]
  );

  // Smooth interpolation states
  const currentPosition = useRef(new THREE.Vector3(...position));
  const targetPosition = useRef(new THREE.Vector3(...position));
  const currentScale = useRef(1);
  const targetScale = useRef(1);
  const currentColor = useRef(new THREE.Color(color));
  const targetColor = useRef(new THREE.Color(color));
  const currentOpacity = useRef(0.1);
  const targetOpacity = useRef(0.1);
  const currentEmissive = useRef(0.1);
  const targetEmissive = useRef(0.1);

  // Smooth easing function
  const smoothLerp = (current, target, factor) => {
    return current + (target - current) * factor;
  };

  const smoothVector3Lerp = (currentVec, targetVec, factor) => {
    currentVec.x = smoothLerp(currentVec.x, targetVec.x, factor);
    currentVec.y = smoothLerp(currentVec.y, targetVec.y, factor);
    currentVec.z = smoothLerp(currentVec.z, targetVec.z, factor);
  };

  const smoothColorLerp = (currentCol, targetCol, factor) => {
    currentCol.r = smoothLerp(currentCol.r, targetCol.r, factor);
    currentCol.g = smoothLerp(currentCol.g, targetCol.g, factor);
    currentCol.b = smoothLerp(currentCol.b, targetCol.b, factor);
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth interpolation factors (higher = more responsive, lower = smoother)
    const positionSmoothing = Math.min(delta * 8, 0.15); // Clamp for stable frame rates
    const scaleSmoothing = Math.min(delta * 12, 0.2);
    const colorSmoothing = Math.min(delta * 10, 0.18);
    const materialSmoothing = Math.min(delta * 15, 0.25);

    // Original wave animation with smoother transitions
    const sequenceDuration = 4;
    const waveSpeed = 0.6; // Slightly slower for smoother feel
    const waveWidth = 2.5; // Wider for gentler transitions
    const sequenceProgress = (time * waveSpeed) % sequenceDuration;
    const normalizedIndex = sequenceIndex / totalPoints;
    const particleTime = normalizedIndex * sequenceDuration;

    const timeDiff =
      (sequenceProgress - particleTime + sequenceDuration) % sequenceDuration;

    // Smoother wave function using smoothstep
    let intensity = 0;
    if (timeDiff < waveWidth) {
      const waveProgress = timeDiff / waveWidth;
      // Smooth cubic interpolation instead of sine for ultra-smooth transitions
      intensity = waveProgress * waveProgress * (3.0 - 2.0 * waveProgress);
      intensity = Math.sin(intensity * Math.PI);
    }

    // Mouse and water ripple effects with smooth falloff
    let mouseInfluence = 0;
    let waterDisplacement = new THREE.Vector3(0, 0, 0);

    // Calculate mouse proximity effect with smoother falloff
    const mouseDistance = Math.sqrt(
      Math.pow(originalPosition.x - mousePos.x, 2) +
        Math.pow(originalPosition.y - mousePos.y, 2)
    );
    const maxMouseDistance = 8;

    if (mouseDistance < maxMouseDistance) {
      const rawInfluence = 1 - mouseDistance / maxMouseDistance;
      // Ultra-smooth falloff using cubic easing
      mouseInfluence = rawInfluence * rawInfluence * rawInfluence;
    }

    // Calculate ripple effects with enhanced smoothing
    ripples.forEach((ripple) => {
      const now = Date.now();
      const rippleAge = (now - ripple.startTime) / ripple.duration;

      if (rippleAge <= 1) {
        const rippleDistance = Math.sqrt(
          Math.pow(originalPosition.x - ripple.x, 2) +
            Math.pow(originalPosition.y - ripple.y, 2)
        );

        // Smoother water ripple parameters
        const rippleSpeed = 12; // Slightly slower for smoother expansion
        const rippleRadius = rippleAge * rippleSpeed;
        const rippleWidth = 3; // Wider ripple for smoother transitions

        // Check if particle is within the ripple with smooth edges
        const distanceFromRipple = Math.abs(rippleDistance - rippleRadius);
        if (distanceFromRipple < rippleWidth) {
          // Smooth ripple intensity with cubic easing
          const edgeFactor = 1 - distanceFromRipple / rippleWidth;
          const smoothEdge = edgeFactor * edgeFactor * (3.0 - 2.0 * edgeFactor);
          const ageFactor = 1 - rippleAge;
          const smoothAge = ageFactor * ageFactor * (3.0 - 2.0 * ageFactor);

          const rippleIntensity = smoothAge * smoothEdge;

          // Create smoother wave displacement
          const angle = Math.atan2(
            originalPosition.y - ripple.y,
            originalPosition.x - ripple.x
          );

          // Smoother vertical displacement
          waterDisplacement.z += rippleIntensity * 1.8;

          // Gentler radial displacement
          waterDisplacement.x += Math.cos(angle) * rippleIntensity * 0.4;
          waterDisplacement.y += Math.sin(angle) * rippleIntensity * 0.4;

          intensity = Math.max(intensity, rippleIntensity);
        }
      }
    });

    // Calculate target position with water effect
    targetPosition.current.copy(originalPosition).add(waterDisplacement);

    // Add smooth mouse repulsion/attraction
    if (mouseInfluence > 0) {
      const mouseDirection = new THREE.Vector3()
        .subVectors(
          originalPosition,
          new THREE.Vector3(mousePos.x, mousePos.y, originalPosition.z)
        )
        .normalize();

      // Gentler repulsion with smooth motion
      const repulsionForce = mouseDirection.multiplyScalar(
        mouseInfluence * 1.2
      );
      targetPosition.current.add(repulsionForce);

      // Smoother Z-axis movement for depth
      const zOffset =
        Math.sin(time * 2.5 + mouseInfluence * 8) * mouseInfluence * 0.6;
      targetPosition.current.z += zOffset;
    }

    // Smooth position interpolation
    smoothVector3Lerp(
      currentPosition.current,
      targetPosition.current,
      positionSmoothing
    );
    meshRef.current.position.copy(currentPosition.current);

    // Calculate target scale with smoother transitions
    const basePulse = 1 + 0.35 * Math.sin(time * 0.8); // Slower, gentler pulse
    const waveScale = 1 + intensity * 0.3;
    const mouseScale = 1 + mouseInfluence * 0.4;
    targetScale.current = basePulse * waveScale * mouseScale;

    // Smooth scale interpolation
    currentScale.current = smoothLerp(
      currentScale.current,
      targetScale.current,
      scaleSmoothing
    );
    meshRef.current.scale.setScalar(currentScale.current);

    // Calculate target color with smoother blending
    const baseColor = new THREE.Color(color);
    const waterTone = new THREE.Color(0.2, 0.6, 1.0);
    const mouseTone = new THREE.Color(1.0, 0.3, 0.8);

    targetColor.current.copy(baseColor);

    // Smoother color blending
    if (intensity > 0) {
      const waterBlend = intensity * 0.35;
      targetColor.current.lerp(waterTone, waterBlend);
    }

    if (mouseInfluence > 0) {
      const mouseBlend = mouseInfluence * 0.25;
      targetColor.current.lerp(mouseTone, mouseBlend);
    }

    // Smooth color interpolation
    smoothColorLerp(currentColor.current, targetColor.current, colorSmoothing);
    meshRef.current.material.color = currentColor.current;
    meshRef.current.material.emissive = currentColor.current;

    // Smooth material property transitions
    const baseOpacity = 0.1;
    const effectOpacity = Math.max(intensity, mouseInfluence);
    targetOpacity.current = baseOpacity + effectOpacity * 0.8;
    targetEmissive.current = 0.1 + effectOpacity * 1.2;

    currentOpacity.current = smoothLerp(
      currentOpacity.current,
      targetOpacity.current,
      materialSmoothing
    );
    currentEmissive.current = smoothLerp(
      currentEmissive.current,
      targetEmissive.current,
      materialSmoothing
    );

    meshRef.current.material.opacity = currentOpacity.current;
    meshRef.current.material.emissiveIntensity = currentEmissive.current;
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.08, 8, 8]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        roughness={0.3}
        transparent
        opacity={0.1}
        depthWrite={true}
      />
    </Sphere>
  );
};

export default ParticleRing;
