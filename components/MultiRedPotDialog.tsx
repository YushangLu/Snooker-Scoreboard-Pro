import React from 'react';
import { SnookerAction } from '../types';

interface MultiRedPotDialogProps {
  isOpen: boolean;
  dispatch: React.Dispatch<SnookerAction>;
  remainingReds: number;
}

const MultiRedPotDialog: React.FC<MultiRedPotDialogProps> = ({ isOpen, dispatch, remainingReds }) => {
  if (!isOpen) return null;

  const handleSelect = (count: number) => {
    dispatch({ type: 'CONFIRM_MULTI_RED_POT', payload: { count } });
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MULTI_RED_DIALOG' });
  };

  // Create an array of numbers from 1 to remainingReds
  const numberOptions = Array.from({ length: remainingReds }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="multi-red-dialog-title">
      <div className="bg-[#132D34] p-6 rounded-lg shadow-xl max-w-md w-full border border-[#314B52] animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <h3 id="multi-red-dialog-title" className="text-xl font-semibold text-white mb-6 text-center">Select Number of Reds Potted</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6 max-h-48 overflow-y-auto pr-2">
          {numberOptions.map((num) => (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              className="scoreboard-button red aspect-square text-lg"
              aria-label={`Pot ${num} red balls`}
            >
              {num}
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

export default MultiRedPotDialog;