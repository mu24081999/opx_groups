import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function VideoTexture({ src, onLoad, ...props }) {
  const [video] = useState(() => Object.assign(document.createElement('video'), {
    src,
    crossOrigin: 'Anonymous',
    loop: true,
    muted: true,
    playsInline: true
  }))
  
  const [texture] = useState(() => new THREE.VideoTexture(video))
  
  useEffect(() => {
    const playVideo = async () => {
      try {
        await video.play()
        if (onLoad) onLoad()
      } catch (error) {
        console.warn('Video autoplay failed:', error)
      }
    }
    
    if (video.readyState >= 3) {
      playVideo()
    } else {
      video.addEventListener('canplaythrough', playVideo)
    }
    
    return () => {
      video.removeEventListener('canplaythrough', playVideo)
      video.pause()
    }
  }, [video, onLoad])
  
  useFrame(() => {
    if (video.readyState >= 2) {
      texture.needsUpdate = true
    }
  })
  
  return <meshBasicMaterial map={texture} {...props} />
}
