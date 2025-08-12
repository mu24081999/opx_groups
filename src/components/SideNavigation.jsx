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
  border: 2px solid ${props => props.$active ? '#888' : '#4a4a4a'};
  background: ${props => props.$active ? '#888' : 'rgba(0, 0, 0, 0.8)'};
  backdrop-filter: blur(10px);
  color: ${props => props.$active ? 'black' : '#888'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;

  /* Glass effect for 3D look */
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(136, 136, 136, 0.1);

  &:hover {
    background: ${props => props.$active ? '#888' : 'rgba(136, 136, 136, 0.2)'};
    border-color: #888;
    color: ${props => props.$active ? 'black' : 'white'};
    transform: scale(1.1);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(136, 136, 136, 0.2);
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
  background: linear-gradient(135deg, rgba(27, 26, 26, 0.95) 0%, rgba(40, 40, 40, 0.9) 100%);
  backdrop-filter: blur(15px);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-10px) translateY(-50%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(139, 92, 246, 0.4);
  top: 50%;

  /* Enhanced 3D depth */
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);

  /* Elegant arrow pointer */
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 8px 6px 0;
    border-color: transparent rgba(40, 40, 40, 0.9) transparent transparent;
    filter: drop-shadow(-1px 0 2px rgba(0, 0, 0, 0.3));
  }

  ${NavButton}:hover + & {
    opacity: 1;
    visibility: visible;
    transform: translateX(0) translateY(-50%);
    box-shadow:
      0 12px 32px rgba(139, 92, 246, 0.2),
      0 6px 16px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const sections = [
  { id: 'experiences', label: 'Experiences', icon: ExperiencesIcon },
  { id: 'ai-chat', label: 'AI Chat', icon: AIIcon },
  { id: 'stat-analysis', label: 'Analytics', icon: AnalyticsIcon },
  { id: 'software-dev', label: 'Development', icon: DevelopmentIcon }
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
            <section.icon size={20} />
          </NavButton>
          <NavLabel>{section.label}</NavLabel>
        </div>
      ))}
    </NavigationContainer>
  );
};

export default SideNavigation;
