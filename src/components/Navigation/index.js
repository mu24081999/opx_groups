import { useState } from 'react'
import './index.scss'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Work', href: '#work' },
    { label: 'Experiments', href: '#experiments' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <a href="/" className="brand-link">
          Active Theory
        </a>
      </div>
      
      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        {menuItems.map((item, index) => (
          <a 
            key={index}
            href={item.href} 
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
      
      <button 
        className="nav-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  )
}
