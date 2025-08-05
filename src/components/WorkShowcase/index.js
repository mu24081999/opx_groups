import { useState, useEffect } from 'react'
import './index.scss'

export default function WorkShowcase({ isVisible }) {
  const [currentProject, setCurrentProject] = useState(0)
  
  const projects = [
    {
      title: 'Immersive Web Experiences',
      category: 'WebGL Development',
      description: 'Creating cutting-edge interactive experiences using Three.js and WebGL',
      image: 'https://images.pexels.com/photos/21696/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      tags: ['WebGL', 'Three.js', 'Interactive']
    },
    {
      title: 'Creative Digital Solutions',
      category: 'UI/UX Design',
      description: 'Designing user-centered interfaces that push creative boundaries',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Design', 'UX', 'Innovation']
    },
    {
      title: 'Interactive Installations',
      category: 'Mixed Reality',
      description: 'Blending physical and digital worlds through immersive technology',
      image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['AR/VR', 'Installation', 'Interactive']
    }
  ]
  
  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isVisible, projects.length])
  
  if (!isVisible) return null
  
  const current = projects[currentProject]
  
  return (
    <div className="work-showcase">
      <div className="showcase-content">
        <div className="project-info">
          <span className="project-category">{current.category}</span>
          <h3 className="project-title">{current.title}</h3>
          <p className="project-description">{current.description}</p>
          
          <div className="project-tags">
            {current.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          
          <button className="view-project-btn">
            View Project
            <span className="arrow">→</span>
          </button>
        </div>
        
        <div className="project-visual">
          <img 
            src={current.image} 
            alt={current.title}
            className="project-image"
          />
          <div className="image-overlay"></div>
        </div>
      </div>
      
      <div className="project-indicators">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentProject ? 'active' : ''}`}
            onClick={() => setCurrentProject(index)}
          />
        ))}
      </div>
    </div>
  )
}
