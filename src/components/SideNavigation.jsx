import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ExperiencesIcon, AIIcon, AnalyticsIcon, DevelopmentIcon } from "./Icons";

const NavigationContainer = styled.div`
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid ${props => props.$active ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'};
  background: ${props => props.$active
    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    : 'linear-gradient(135deg, rgba(27, 26, 26, 0.9) 0%, rgba(40, 40, 40, 0.8) 100%)'
  };
  backdrop-filter: blur(15px);
  color: ${props => props.$active ? 'white' : '#888'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  /* 3D depth effect */
  box-shadow: ${props => props.$active
    ? `
      0 8px 20px rgba(139, 92, 246, 0.3),
      0 4px 12px rgba(139, 92, 246, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `
    : `
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 2px 6px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2)
    `
  };

  /* Elegant shine effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    background: ${props => props.$active
      ? 'linear-gradient(135deg, #9333ea 0%, #8b5cf6 100%)'
      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)'
    };
    border-color: #8b5cf6;
    color: white;
    transform: translateY(-2px) scale(1.05);
    box-shadow: ${props => props.$active
      ? `
        0 12px 28px rgba(139, 92, 246, 0.4),
        0 6px 16px rgba(139, 92, 246, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `
      : `
        0 8px 20px rgba(139, 92, 246, 0.3),
        0 4px 12px rgba(139, 92, 246, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `
    };

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const NavLabel = styled.div`
  position: absolute;
  left: 65px;
  background: rgba(27, 26, 26, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.3);

  ${NavButton}:hover + & {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const sections = [
  { id: 'experiences', label: 'Experiences', icon: '🎨' },
  { id: 'ai-chat', label: 'AI Chat', icon: '🤖' },
  { id: 'stat-analysis', label: 'Analytics', icon: '📊' },
  { id: 'software-dev', label: 'Development', icon: '💻' }
];

const SideNavigation = () => {
  const [activeSection, setActiveSection] = useState('experiences');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['experiences', 'ai-chat', 'stat-analysis', 'software-dev'];
      const scrollY = window.scrollY + window.innerHeight / 2;

      // Find which section is currently in view
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollY >= elementTop && scrollY <= elementBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial active section

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <NavigationContainer>
      {sections.map((section) => (
        <div key={section.id} style={{ position: 'relative' }}>
          <NavButton
            $active={activeSection === section.id}
            onClick={() => handleNavClick(section.id)}
            aria-label={section.label}
          >
            {section.icon}
          </NavButton>
          <NavLabel>{section.label}</NavLabel>
        </div>
      ))}
    </NavigationContainer>
  );
};

export default SideNavigation;
