import { useState, useEffect } from 'react'
import Scene3D from './components/Scene3D'
import Navigation from './components/Navigation'
import Controls from './components/Controls'
import './App.scss'

function App() {
  const [currentEnvironment, setCurrentEnvironment] = useState('la')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleEnvironmentChange = (newEnvironment) => {
    setCurrentEnvironment(newEnvironment)
  }

  return (
    <div className="App">
      {!isLoaded && (
        <div className="initial-loader">
          <div className="loader-content">
            <h1>Active Theory</h1>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
            <p>Loading Experience...</p>
          </div>
        </div>
      )}
      
      {isLoaded && (
        <>
          <Navigation />
          <Scene3D currentEnvironment={currentEnvironment} />
          <Controls 
            currentEnvironment={currentEnvironment}
            onEnvironmentChange={handleEnvironmentChange}
          />
        </>
      )}
    </div>
  )
}

export default App
