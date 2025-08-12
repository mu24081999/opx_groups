import React from 'react';

export const ExperiencesIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" 
      fill={color}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}
    />
    <path 
      d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z" 
      fill={color}
      opacity="0.7"
    />
    <path 
      d="M5 6L5.5 8L7 8.5L5.5 9L5 11L4.5 9L3 8.5L4.5 8L5 6Z" 
      fill={color}
      opacity="0.7"
    />
  </svg>
);

export const AIIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" 
      fill={color}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}
    />
    <circle cx="8" cy="8" r="2" fill={color} opacity="0.8"/>
    <circle cx="16" cy="8" r="2" fill={color} opacity="0.8"/>
    <circle cx="6" cy="16" r="1.5" fill={color} opacity="0.6"/>
    <circle cx="18" cy="16" r="1.5" fill={color} opacity="0.6"/>
    <circle cx="12" cy="20" r="1" fill={color} opacity="0.4"/>
    <path 
      d="M12 6L8 8L6 16L12 20L18 16L16 8L12 6Z" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none"
      opacity="0.5"
    />
  </svg>
);

export const AnalyticsIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect 
      x="3" y="16" width="4" height="6" 
      fill={color}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}
    />
    <rect 
      x="10" y="12" width="4" height="10" 
      fill={color}
      opacity="0.9"
    />
    <rect 
      x="17" y="8" width="4" height="14" 
      fill={color}
      opacity="0.8"
    />
    <path 
      d="M5 16L12 12L17 8L21 4" 
      stroke={color} 
      strokeWidth="2" 
      fill="none"
      opacity="0.6"
    />
    <circle cx="5" cy="16" r="2" fill={color}/>
    <circle cx="12" cy="12" r="2" fill={color}/>
    <circle cx="17" cy="8" r="2" fill={color}/>
  </svg>
);

export const DevelopmentIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect 
      x="2" y="4" width="20" height="16" rx="2" 
      fill="none" 
      stroke={color} 
      strokeWidth="2"
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}
    />
    <rect x="2" y="4" width="20" height="4" fill={color} opacity="0.8"/>
    <path 
      d="M8 12L10 14L8 16" 
      stroke={color} 
      strokeWidth="2" 
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line 
      x1="13" y1="16" x2="16" y2="16" 
      stroke={color} 
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="6" cy="6" r="1" fill="white"/>
    <circle cx="8" cy="6" r="1" fill="white"/>
    <circle cx="10" cy="6" r="1" fill="white"/>
  </svg>
);

export const PlayIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M8 5V19L19 12L8 5Z" 
      fill={color}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}
    />
  </svg>
);

export const PauseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect 
      x="6" y="4" width="4" height="16" 
      fill={color}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}
    />
    <rect x="14" y="4" width="4" height="16" fill={color}/>
  </svg>
);
