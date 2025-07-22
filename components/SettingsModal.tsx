import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShortcutSettings, ShortcutAction } from '../types';

interface SettingsModalProps {
  shortcuts: ShortcutSettings;
  defaultShortcuts: ShortcutSettings;
  onUpdateShortcut: (action: ShortcutAction, key: string) => void;
  onReset: () => void;
  onClose: () => void;
}

const ACTION_LABELS: Record<ShortcutAction, string> = {
  potRed: 'Pot Red Ball',
  potYellow: 'Pot Yellow Ball',
  potGreen: 'Pot Green Ball',
  potBrown: 'Pot Brown Ball',
  potBlue: 'Pot Blue Ball',
  potPink: 'Pot Pink Ball',
  potBlack: 'Pot Black Ball',
  foul: 'Declare Foul (Dialog)',
  foul4: 'Foul: 4 Points',
  foul5: 'Foul: 5 Points',
  foul6: 'Foul: 6 Points',
  foul7: 'Foul: 7 Points',
  endTurn: 'End Turn / Miss',
  concedeFrame: 'Concede Frame',
  startNextFrame: 'Start Next Frame',
};

const SettingsModal: React.FC<SettingsModalProps> = ({ shortcuts, defaultShortcuts, onUpdateShortcut, onReset, onClose }) => {
  const [editingAction, setEditingAction] = useState<ShortcutAction | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (editingAction) {
      e.preventDefault();
      e.stopPropagation();

      let key = e.key;
      // Handle special keys
      if (key === ' ') key = 'Space';

      // We only care about single characters or specific names like 'Space'
      if (key.length === 1 || key === 'Space') {
        onUpdateShortcut(editingAction, key);
        setEditingAction(null);
      } else {
        // Optionally alert user for invalid key, e.g. "Shift", "Control"
        alert("Invalid shortcut key. Please use a single character or Spacebar.");
      }
    }
  }, [editingAction, onUpdateShortcut]);

  useEffect(() => {
    if (editingAction) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingAction, handleKeyDown]);

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all shortcuts to their default settings?')) {
      onReset();
    }
  };

  const actionOrder: ShortcutAction[] = useMemo(() => [
    'potRed', 'potYellow', 'potGreen', 'potBrown', 'potBlue', 'potPink', 'potBlack',
    'foul', 'foul4', 'foul5', 'foul6', 'foul7', 'endTurn', 'concedeFrame', 'startNextFrame'
  ], []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-[#132D34] border border-[#314B52] p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 id="settings-title" className="text-2xl font-semibold text-white mb-6 text-center">
          Keyboard Shortcuts
        </h3>
        
        <div className="overflow-y-auto pr-2 -mr-2">
            <ul className="space-y-3">
            {actionOrder.map((action) => (
                <li key={action} className="flex items-center justify-between p-3 bg-[#0D242B]/60 rounded-md">
                <span className="text-gray-200">{ACTION_LABELS[action]}</span>
                {editingAction === action ? (
                    <div className="px-4 py-1.5 border-2 border-sky-500 rounded-md text-sky-300 animate-pulse">
                    Press any key...
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                    <kbd className="inline-block text-center w-20 px-3 py-1.5 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md font-mono text-sm">
                        {shortcuts[action] === ' ' ? 'Space' : shortcuts[action].toUpperCase()}
                    </kbd>
                    <button
                        onClick={() => setEditingAction(action)}
                        className="scoreboard-button yellow text-sm py-1 px-3"
                    >
                        Change
                    </button>
                    </div>
                )}
                </li>
            ))}
            </ul>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 border-t border-[#314B52] pt-6">
          <button
            onClick={handleResetDefaults}
            className="scoreboard-button red py-2 px-4"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="scoreboard-button py-2 px-4"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;