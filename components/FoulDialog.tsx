import React from 'react';
import { FOUL_OPTIONS } from '../constants';
import { SnookerAction } from '../types';

interface FoulDialogProps {
  isOpen: boolean;
  dispatch: React.Dispatch<SnookerAction>;
}

export const FoulDialog: React.FC<FoulDialogProps> = ({ isOpen, dispatch }) => {
  if (!isOpen) return null;

  const handleFoulSelect = (points: number) => {
    dispatch({ type: 'CONFIRM_FOUL', payload: { points } });
  };

  const handleClose = () => {
    dispatch({type: 'CLOSE_FOUL_DIALOG' });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#132D34] p-6 rounded-lg shadow-xl max-w-sm w-full border border-[#314B52] animate-scale-in">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Select Foul Points</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {FOUL_OPTIONS.map((points) => (
            <button
              key={points}
              onClick={() => handleFoulSelect(points)}
              className="scoreboard-button red text-lg py-3 w-full"
            >
              {points} Points
            </button>
          ))}
        </div>
        <button
          onClick={handleClose}
          className="scoreboard-button w-full py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};