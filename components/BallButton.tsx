import React from 'react';
import { BallType } from '../types';

interface BallButtonProps {
  ball: BallType;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  shortcutKey?: string;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void;
}

export const BallButton: React.FC<BallButtonProps> = ({ ball, onClick, disabled, shortcutKey, onMouseDown, onMouseUp, onTouchStart, onTouchEnd }) => {
  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={disabled}
      className={`relative p-3 w-16 h-16 rounded-full font-semibold shadow-md transition-all duration-150 ease-in-out
                  ${ball.colorClass} ${ball.textColorClass}
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white'}
                  flex items-center justify-center text-center text-sm leading-tight`}
      aria-label={`Pot ${ball.name}`}
    >
      {shortcutKey && !disabled && (
        <span className="shortcut-key" aria-hidden="true">{shortcutKey === ' ' ? 'Space' : shortcutKey}</span>
      )}
      {ball.name}
      {/* <span className="block text-xs">({ball.value})</span> */}
    </button>
  );
};
