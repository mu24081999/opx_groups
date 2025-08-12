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
  border: 2px solid ${props => props.$active ? '#8b5cf6' : '#4a4a4a'};
  background: ${props => props.$active ? '#8b5cf6' : 'rgba(27, 26, 26, 0.8)'};
  backdrop-filter: blur(10px);
  color: ${props => props.$active ? 'white' : '#888'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'};
    border-color: #8b5cf6;
    color: white;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 0.7rem;
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
