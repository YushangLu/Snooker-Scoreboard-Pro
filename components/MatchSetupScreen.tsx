import React, { useState, useEffect } from 'react';
import { PlayerProfile, MatchSettings } from '../types';
import PlayerImage from './PlayerImage';

interface MatchSetupScreenProps {
  players: PlayerProfile[];
  onStartMatch: (settings: MatchSettings) => void;
  currentMatchSettings: MatchSettings | null; 
}

const MatchSetupScreen: React.FC<MatchSetupScreenProps> = ({
  players,
  onStartMatch,
  currentMatchSettings
}) => {
  const [player1Id, setPlayer1Id] = useState<string | null>(null);
  const [player2Id, setPlayer2Id] = useState<string | null>(null);
  const [bestOfFrames, setBestOfFrames] = useState<number>(currentMatchSettings?.bestOfFrames || 5);

  useEffect(() => {
    // Pre-fill from currentMatchSettings if available and valid
    if (currentMatchSettings) {
        if (players.find(p => p.id === currentMatchSettings.player1Id)) {
            setPlayer1Id(currentMatchSettings.player1Id);
        }
        if (players.find(p => p.id === currentMatchSettings.player2Id)) {
            setPlayer2Id(currentMatchSettings.player2Id);
        }
    } else if (players.length > 0) {
        // Default selection if no currentMatchSettings or they are invalid
        setPlayer1Id(players[0].id);
        if (players.length > 1) {
            const defaultP2 = players.find(p => p.id !== players[0].id);
            setPlayer2Id(defaultP2 ? defaultP2.id : null);
        } else {
            setPlayer2Id(null);
        }
    }
  }, [players, currentMatchSettings]);

   // Ensure P2 is different from P1 if P1 changes
  useEffect(() => {
    if (player1Id && player1Id === player2Id && players.length > 1) {
      const newP2 = players.find(p => p.id !== player1Id);
      setPlayer2Id(newP2 ? newP2.id : null);
    }
  }, [player1Id, player2Id, players]);


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!player1Id || !player2Id) {
      alert('Please select two players for the match.');
      return;
    }
    if (player1Id === player2Id) {
      alert('Players must be different.');
      return;
    }
    if (bestOfFrames < 1 || bestOfFrames % 2 === 0) {
        alert('Best of frames must be an odd positive number (e.g., 1, 3, 5).');
        return;
    }
    onStartMatch({ player1Id, player2Id, bestOfFrames });
  };

  const getPlayerById = (id: string | null) => players.find(p => p.id === id);

  if (players.length < 2) {
    return (
      <div className="w-full max-w-md mx-auto text-center card animate-fade-in">
        <h2 className="text-2xl font-semibold text-white mb-4">Match Setup</h2>
        <p className="text-gray-300 mb-6">
          You need at least two players to start a match. Please add more players.
        </p>
        <button
          onClick={() => { /* Navigation handled by header */ }}
          className="scoreboard-button py-2 px-4"
        >
          Go to Player Management
        </button>
      </div>
    );
  }

  const selectedPlayer1 = getPlayerById(player1Id);
  const selectedPlayer2 = getPlayerById(player2Id);

  return (
    <div className="w-full max-w-lg mx-auto card animate-fade-in">
      <h2 className="text-3xl font-semibold text-white mb-8 text-center">Match Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Player 1 Selection */}
        <div>
          <label htmlFor="player1" className="block text-lg font-medium text-gray-200 mb-2">
            Player 1
          </label>
          <div className="flex items-center space-x-3 bg-[#0D242B]/50 p-3 rounded-md">
            {selectedPlayer1 && <PlayerImage imageUrl={selectedPlayer1.imageUrl} altText={selectedPlayer1.name} size="h-12 w-12" />}
            <select
              id="player1"
              value={player1Id || ''}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="" disabled>Select Player 1</option>
              {players.map(p => (
                <option key={p.id} value={p.id} disabled={p.id === player2Id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Player 2 Selection */}
        <div>
          <label htmlFor="player2" className="block text-lg font-medium text-gray-200 mb-2">
            Player 2
          </label>
           <div className="flex items-center space-x-3 bg-[#0D242B]/50 p-3 rounded-md">
            {selectedPlayer2 && <PlayerImage imageUrl={selectedPlayer2.imageUrl} altText={selectedPlayer2.name} size="h-12 w-12" />}
            <select
              id="player2"
              value={player2Id || ''}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="" disabled>Select Player 2</option>
              {players.map(p => (
                <option key={p.id} value={p.id} disabled={p.id === player1Id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Best Of Frames */}
        <div>
          <label htmlFor="bestOfFrames" className="block text-lg font-medium text-gray-200 mb-2">
            Best of Frames
          </label>
          <input
            id="bestOfFrames"
            type="number"
            value={bestOfFrames}
            onChange={(e) => setBestOfFrames(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            step="2" 
            className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="e.g., 5 for Best of 5"
          />
           <p className="text-xs text-gray-400 mt-1">Must be an odd number (1, 3, 5, etc.). First to {Math.ceil(bestOfFrames / 2)} frames wins.</p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="scoreboard-button green w-full text-lg py-3"
            disabled={!player1Id || !player2Id || player1Id === player2Id}
          >
            Start Match
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchSetupScreen;