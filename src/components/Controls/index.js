import { useEffect } from 'react'
import './index.scss'

export default function Controls({ currentEnvironment, onEnvironmentChange }) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault()
        const newEnvironment = currentEnvironment === 'la' ? 'amsterdam' : 'la'
        onEnvironmentChange(newEnvironment)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentEnvironment, onEnvironmentChange])

  return (
    <div className="controls-overlay">
      <div className="controls-hint">
        <div className="spacebar-hint">
          <span className="key">SPACE</span>
          <span className="action">Toggle Environment</span>
        </div>
        
        <div className="environment-indicator">
          <div className={`indicator ${currentEnvironment === 'la' ? 'active' : ''}`}>
            LA
          </div>
          <div className={`indicator ${currentEnvironment === 'amsterdam' ? 'active' : ''}`}>
            AMS
          </div>
        </div>
      </div>
    </div>
  )
}
