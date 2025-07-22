import React from 'react';

export const SnookerLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle 
            cx="12" 
            cy="12" 
            r="9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            pathLength="1" 
            strokeDasharray="0.8 0.2" 
            transform="rotate(-100 12 12)" 
        />
    </svg>
);
