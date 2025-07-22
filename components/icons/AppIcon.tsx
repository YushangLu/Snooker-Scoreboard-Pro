import React from 'react';

// A recreation of the app icon provided in the prompt.
export const AppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 512 512" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <defs>
      <style>{`
        .snooker-text { font-family: 'Inter', sans-serif; font-weight: 800; fill: white; letter-spacing: 0.05em; }
        .pro-text { font-family: 'Inter', sans-serif; font-weight: 700; fill: white; }
      `}</style>
    </defs>
    
    {/* Background using a dark green similar to snooker table felt */}
    <rect width="512" height="512" rx="90" fill="#166534" />

    {/* Cue Ball */}
    <circle cx="155" cy="165" r="80" fill="white" />
    
    {/* A cluster of 5 Red Balls, inspired by the icon */}
    <g>
        <circle cx="345" cy="165" r="45" fill="#DC2626" />
        <circle cx="415" cy="115" r="45" fill="#DC2626" />
        <circle cx="415" cy="215" r="45" fill="#DC2626" />
        <circle cx="295" cy="110" r="45" fill="#DC2626" />
        <circle cx="295" cy="220" r="45" fill="#DC2626" />
    </g>

    <text x="50%" y="340" textAnchor="middle" fontSize="54" className="snooker-text">SNOOKER</text>
    <text x="50%" y="405" textAnchor="middle" fontSize="54" className="snooker-text">SCOREBOARD</text>
    
    <rect x="181" y="435" width="150" height="60" rx="15" fill="#F97316" />
    <text x="50%" y="480" textAnchor="middle" fontSize="45" className="pro-text">PRO</text>
  </svg>
);
