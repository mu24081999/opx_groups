import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Environment, 
  PerspectiveCamera, 
  OrbitControls,
  Html,
  useProgress,
  Text,
  Box,
  Plane
} from '@react-three/drei'
import * as THREE from 'three'
import './index.scss'

// Loading component
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="loader-3d">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p>Loading... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

// Video Screen Component
function VideoScreen({ position, rotation, scale, videoSrc }) {
  const meshRef = useRef()
  const videoRef = useRef()
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial color="#000" />
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[15, 8.5]} />
        <meshBasicMaterial>
          <videoTexture attach="map">
            <video
              ref={videoRef}
              src={videoSrc}
              crossOrigin="anonymous"
              loop
              muted
              playsInline
            />
          </videoTexture>
        </meshBasicMaterial>
      </mesh>
    </mesh>
  )
}

// Environment Room Component
function EnvironmentRoom({ environment, isActive }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.001
    }
  })

  const roomConfig = {
    la: {
      color: '#ff4500',
      lightColor: '#ffaa44',
      videoSrc: '/videos/la-reel.mp4',
      title: 'Los Angeles Office'
    },
    amsterdam: {
      color: '#0066cc', 
      lightColor: '#4488ff',
      videoSrc: '/videos/amsterdam-reel.mp4',
      title: 'Amsterdam Office'
    }
  }

  const config = roomConfig[environment] || roomConfig.la

  return (
    <group ref={groupRef} visible={isActive}>
      {/* Floor */}
      <Plane 
        args={[50, 50]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -5, 0]}
      >
        <meshStandardMaterial color="#222" />
      </Plane>

      {/* Back Wall */}
      <Plane 
        args={[50, 20]} 
        position={[0, 5, -25]}
      >
        <meshStandardMaterial color="#333" />
      </Plane>

      {/* Side Walls */}
      <Plane 
        args={[50, 20]} 
        rotation={[0, Math.PI / 2, 0]}
        position={[-25, 5, 0]}
      >
        <meshStandardMaterial color="#333" />
      </Plane>

      <Plane 
        args={[50, 20]} 
        rotation={[0, -Math.PI / 2, 0]}
        position={[25, 5, 0]}
      >
        <meshStandardMaterial color="#333" />
      </Plane>

      {/* Main Video Screen */}
      <VideoScreen 
        position={[0, 5, -20]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        videoSrc={config.videoSrc}
      />

      {/* Accent Lights */}
      <pointLight 
        position={[-10, 10, -10]} 
        color={config.lightColor} 
        intensity={0.5}
      />
      <pointLight 
        position={[10, 10, -10]} 
        color={config.lightColor} 
        intensity={0.5}
      />

      {/* Environment Title */}
      <Text
        position={[0, 12, -24]}
        fontSize={2}
        color={config.color}
        anchorX="center"
        anchorY="middle"
      >
        {config.title}
      </Text>

      {/* Decorative Elements */}
      <Box args={[2, 8, 2]} position={[-15, 0, -15]}>
        <meshStandardMaterial color={config.color} />
      </Box>
      
      <Box args={[2, 6, 2]} position={[15, -1, -15]}>
        <meshStandardMaterial color={config.color} />
      </Box>
    </group>
  )
}

// Main Scene Component
function Scene({ currentEnvironment }) {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, 5, 15)
    camera.lookAt(0, 5, 0)
  }, [camera])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      <EnvironmentRoom 
        environment="la" 
        isActive={currentEnvironment === 'la'} 
      />
      <EnvironmentRoom 
        environment="amsterdam" 
        isActive={currentEnvironment === 'amsterdam'} 
      />
      
      <Environment preset="night" />
    </>
  )
}

// Main 3D Scene Component
export default function Scene3D({ currentEnvironment }) {
  return (
    <div className="scene-3d">
      <Canvas
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <Suspense fallback={<Loader />}>
          <Scene currentEnvironment={currentEnvironment} />
        </Suspense>
      </Canvas>
    </div>
  )
}
