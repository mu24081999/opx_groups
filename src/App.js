import { useState, useEffect } from 'react'
import OPXLogoRing from './components/OPXLogoRing'
import ScrollContent from './components/ScrollContent'
import './App.scss'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="App">
      {!isLoaded && (
        <div className="initial-loader">
          <div className="loader-content">
            <h1>OPX Groups</h1>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
            <p>Loading Experience...</p>
          </div>
        </div>
      )}

      {isLoaded && (
        <>
          <OPXLogoRing />
          <ScrollContent />
        </>
      )}
    </div>
  )
}

export default App
