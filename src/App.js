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
          {/* Test content to ensure scrolling works */}
          <div style={{
            position: 'relative',
            zIndex: 100,
            background: 'red',
            height: '200vh',
            padding: '50px',
            color: 'white',
            fontSize: '24px'
          }}>
            <h1>TEST SCROLL CONTENT</h1>
            <p>If you can see this, scrolling is working!</p>
            <div style={{ marginTop: '100vh' }}>
              <h2>Middle Section</h2>
              <p>Keep scrolling to test the logo rotation...</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
