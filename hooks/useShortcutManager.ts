import { useState, useEffect, useCallback } from 'react';
import { ShortcutSettings, ShortcutAction } from '../types';

const STORAGE_KEY = 'snookerShortcutSettings';

const DEFAULT_SHORTCUTS: ShortcutSettings = {
  potRed: 'r',
  potYellow: 'y',
  potGreen: 'g',
  potBrown: 'b',
  potBlue: 'l',
  potPink: 'p',
  potBlack: 'k',
  foul: 'f',
  foul4: '4',
  foul5: '5',
  foul6: '6',
  foul7: '7',
  endTurn: ' ', // Space bar
  concedeFrame: 'c',
  startNextFrame: 'n',
};

export const useShortcutManager = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutSettings>(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      if (storedSettings) {
        // Merge stored settings with defaults to ensure all actions have a key
        const parsed = JSON.parse(storedSettings);
        return { ...DEFAULT_SHORTCUTS, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load shortcut settings from localStorage", error);
    }
    return DEFAULT_SHORTCUTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
    } catch (error) {
      console.error("Failed to save shortcut settings to localStorage", error);
    }
  }, [shortcuts]);

  const updateShortcut = useCallback((action: ShortcutAction, key: string) => {
    // Check for conflicts
    const conflict = (Object.keys(shortcuts) as ShortcutAction[]).find(
      (act) => act !== action && shortcuts[act].toLowerCase() === key.toLowerCase()
    );
    if (conflict) {
      alert(`Key "${key.toUpperCase()}" is already assigned to another action. Please choose a different key.`);
      return;
    }

    setShortcuts((prev) => ({
      ...prev,
      [action]: key,
    }));
  }, [shortcuts]);

  const resetShortcuts = useCallback(() => {
    setShortcuts(DEFAULT_SHORTCUTS);
  }, []);

  return { shortcuts, updateShortcut, resetShortcuts, defaultShortcuts: DEFAULT_SHORTCUTS };
};
