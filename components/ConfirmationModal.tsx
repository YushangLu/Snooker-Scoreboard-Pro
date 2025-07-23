import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div 
        className="bg-[#132D34] p-6 rounded-lg shadow-xl max-w-sm w-full border border-[#314B52] animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 id="confirmation-title" className="text-xl font-semibold text-white mb-4 text-center">{title}</h3>
        <p className="text-gray-300 mb-6 text-center">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="scoreboard-button py-2 px-4"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="scoreboard-button red py-2 px-4"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;