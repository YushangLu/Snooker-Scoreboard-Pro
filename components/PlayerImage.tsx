
import React from 'react';

interface PlayerImageProps {
  imageUrl?: string;
  altText: string;
  size?: string; // e.g., "h-16 w-16"
  className?: string;
}

const PlayerImage: React.FC<PlayerImageProps> = ({ imageUrl, altText, size = 'h-20 w-20', className = '' }) => {
  return (
    <div className={`${size} rounded-full overflow-hidden bg-slate-600 flex items-center justify-center shadow-md ring-2 ring-transparent transition-all duration-300 ease-in-out ${className}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={altText} className="object-cover w-full h-full" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-3/5 h-3/5 text-slate-400 ${className}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      )}
    </div>
  );
};

export default PlayerImage;