import React from 'react';
import { FOUL_OPTIONS, ALL_BALLS, RED_BALL } from '../constants';
import { SnookerAction, SnookerState, BallType } from '../types';

interface FoulDialogProps {
  isOpen: boolean;
  dispatch: React.Dispatch<SnookerAction>;
  state: SnookerState;
}

const FoulBallButton: React.FC<{
    ball: BallType;
    onClick: () => void;
    disabled?: boolean;
}> = ({ ball, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`relative p-2 w-14 h-14 rounded-full font-semibold shadow-md transition-all duration-150 ease-in-out
                    ${ball.colorClass} ${ball.textColorClass}
                    ${disabled ? 'opacity-40 cursor-not-allowed' : 'transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white'}
                    flex items-center justify-center text-center text-xs leading-tight`}
        aria-label={`Foul potting ${ball.name}`}
    >
        {ball.name}
    </button>
);


export const FoulDialog: React.FC<FoulDialogProps> = ({ isOpen, dispatch, state }) => {
  if (!isOpen) return null;

  const handleFoulSelect = (points: number) => {
    dispatch({ type: 'CONFIRM_FOUL', payload: { points } });
  };
  
  const handleFoulOnPot = (ball: BallType) => {
    dispatch({ type: 'FOUL_ON_POT', payload: { ball } });
  };

  const handleClose = () => {
    dispatch({type: 'CLOSE_FOUL_DIALOG' });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#132D34] p-6 rounded-lg shadow-xl max-w-lg w-full border border-[#314B52] animate-scale-in">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Declare Foul</h3>
        
        {/* Standard Foul */}
        <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-600 pb-2">Standard Foul</h4>
            <div className="grid grid-cols-4 gap-3">
            {FOUL_OPTIONS.map((points) => (
                <button
                key={points}
                onClick={() => handleFoulSelect(points)}
                className="scoreboard-button red text-lg py-3 w-full"
                >
                {points}
                </button>
            ))}
            </div>
        </div>

        {/* Foul on Pot */}
        <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-600 pb-2">Foul on Pot</h4>
            <p className="text-xs text-slate-400 mb-4">Select the ball that was illegally potted (e.g., cue ball goes in-off the blue, select Blue).</p>
            <div className="flex flex-wrap justify-center gap-3">
                {ALL_BALLS.map((ball) => (
                    <FoulBallButton 
                        key={ball.name}
                        ball={ball}
                        onClick={() => handleFoulOnPot(ball)}
                        disabled={ball.name === RED_BALL.name && state.remainingReds === 0}
                    />
                ))}
            </div>
        </div>

        <button
          onClick={handleClose}
          className="scoreboard-button w-full py-2 mt-8"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};