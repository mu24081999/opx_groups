import { Suspense, useRef, useEffect, useState } from 'react'
import './index.scss'

// Environment Display Component
function EnvironmentDisplay({ environment, isActive }) {
  const [currentVideo, setCurrentVideo] = useState('')

  const environments = {
    la: {
      title: 'Los Angeles Office',
      color: '#ff4500',
      gradient: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
      description: 'Creative studio in the heart of Los Angeles',
      video: 'https://videos.pexels.com/video-files/33237483/14161808_640_360_25fps.mp4'
    },
    amsterdam: {
      title: 'Amsterdam Office',
      color: '#0066cc',
      gradient: 'linear-gradient(135deg, #0066cc 0%, #4488ff 100%)',
      description: 'European headquarters along the canals',
      video: 'https://videos.pexels.com/video-files/6394060/6394060-hd_1920_1080_25fps.mp4'
    }
  }

  const config = environments[environment] || environments.la

  useEffect(() => {
    if (isActive) {
      setCurrentVideo(config.video)
    }
  }, [isActive, config.video])

  return (
    <div
      className={`environment-display ${isActive ? 'active' : ''}`}
      style={{ '--accent-color': config.color, '--bg-gradient': config.gradient }}
    >
      <div className="environment-content">
        <div className="video-container">
          {currentVideo && (
            <video
              key={environment}
              src={currentVideo}
              autoPlay
              loop
              muted
              playsInline
              className="environment-video"
            />
          )}
          <div className="video-overlay"></div>
        </div>

        <div className="environment-info">
          <h2 className="environment-title">{config.title}</h2>
          <p className="environment-description">{config.description}</p>

          <div className="environment-features">
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Creative Direction</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Interactive Experiences</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <span>WebGL Innovation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="environment-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${i * 0.2}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Main Scene Component
export default function Scene3D({ currentEnvironment }) {
  return (
    <div className="scene-3d">
      <EnvironmentDisplay
        environment="la"
        isActive={currentEnvironment === 'la'}
      />
      <EnvironmentDisplay
        environment="amsterdam"
        isActive={currentEnvironment === 'amsterdam'}
      />
    </div>
  )
}
