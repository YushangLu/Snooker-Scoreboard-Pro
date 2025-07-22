import React from 'react';
import { Player, SnookerState } from '../types';
import PlayerImage from './PlayerImage';

interface ScoreDisplayProps {
  state: SnookerState;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ state }) => {
  const {
    player1Name,
    player2Name,
    player1ImageUrl,
    player2ImageUrl,
    scores,
    framesWon,
    currentTurn,
    currentBreak,
    bestOfFrames,
  } = state;

  const currentFrameNumber = framesWon.Player1 + framesWon.Player2 + 1;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Frame in Progress</h2>
        <div className="text-lg text-gray-300">
          Frame <span className="font-bold text-white">{currentFrameNumber}</span>/{bestOfFrames}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        {/* Player 1 Section */}
        <div className="flex items-center gap-x-4">
          <PlayerImage imageUrl={player1ImageUrl} altText={player1Name} size="h-20 w-20" className={currentTurn === Player.Player1 ? 'ring-2 ring-yellow-400' : ''}/>
          <div>
            <h3 className="text-xl font-semibold text-white">{player1Name}</h3>
            <p className="text-gray-400">Current Break: <span className="font-bold text-white">{currentTurn === Player.Player1 ? currentBreak : 0}</span></p>
          </div>
        </div>
        <p className="text-7xl font-bold text-white pl-4">{scores[Player.Player1]}</p>

        {/* Divider */}
        <div className="h-24 w-px bg-[#314B52] mx-8"></div>

        {/* Player 2 Section */}
        <p className="text-7xl font-bold text-white pr-4">{scores[Player.Player2]}</p>
        <div className="flex items-center gap-x-4">
          <div className="text-right">
            <h3 className="text-xl font-semibold text-white">{player2Name}</h3>
            <p className="text-gray-400">Current Break: <span className="font-bold text-white">{currentTurn === Player.Player2 ? currentBreak : 0}</span></p>
          </div>
          <PlayerImage imageUrl={player2ImageUrl} altText={player2Name} size="h-20 w-20" className={currentTurn === Player.Player2 ? 'ring-2 ring-yellow-400' : ''}/>
        </div>
      </div>
    </div>
  );
};