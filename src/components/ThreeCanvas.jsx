import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

const ThreeCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 70 }}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} fade />

        {/* Postprocessing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>

        {/* Controls for now */}
        <OrbitControls enableZoom={false} enablePan={false} />
      </Suspense>
    </Canvas>
  )
}

export default ThreeCanvas
