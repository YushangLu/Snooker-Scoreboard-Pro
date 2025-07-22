import React from 'react';
import { CompletedMatch, Player } from '../types';
import PlayerImage from './PlayerImage';

interface MatchSummaryScreenProps {
  matchData: CompletedMatch;
}

const MatchSummaryScreen: React.FC<MatchSummaryScreenProps> = ({
  matchData,
}) => {
  const {
    player1NameSnapshot,
    player2NameSnapshot,
    player1ImageUrlSnapshot,
    player2ImageUrlSnapshot,
    finalScoreP1,
    finalScoreP2,
    frameHistory,
    matchWinner,
  } = matchData;

  const getPlayerName = (player: Player | null) => {
    if (player === Player.Player1) return player1NameSnapshot;
    if (player === Player.Player2) return player2NameSnapshot;
    return "N/A";
  }

  return (
    <div className="w-full max-w-4xl mx-auto card animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Match Complete</h2>
      {matchWinner && (
        <p className="text-xl text-green-400 mb-6 text-center">
          {getPlayerName(matchWinner)} wins the match!
        </p>
      )}

      {/* Score Header */}
      <div className="flex items-center justify-around mb-8 p-4 bg-[#0D242B]/50 rounded-lg">
        <div className="flex flex-col items-center text-center">
          <PlayerImage imageUrl={player1ImageUrlSnapshot} altText={player1NameSnapshot} size="h-20 w-20 sm:h-24 sm:w-24" />
          <p className="mt-2 text-lg sm:text-xl font-semibold">{player1NameSnapshot}</p>
        </div>
        <div className="text-center">
          <p className="text-4xl sm:text-5xl font-bold">
            {finalScoreP1} <span className="text-2xl sm:text-3xl text-gray-400 mx-1 sm:mx-2">-</span> {finalScoreP2}
          </p>
          <p className="text-sm text-gray-400 mt-1">Frames</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <PlayerImage imageUrl={player2ImageUrlSnapshot} altText={player2NameSnapshot} size="h-20 w-20 sm:h-24 sm:w-24" />
          <p className="mt-2 text-lg sm:text-xl font-semibold">{player2NameSnapshot}</p>
        </div>
      </div>

      {/* Frame by Frame Details Table */}
      <h3 className="text-2xl font-semibold text-white mb-4 text-center">Frame Details</h3>
      <div className="overflow-x-auto rounded-lg shadow-md border border-[#314B52]">
        <table className="w-full min-w-[500px] sm:min-w-[600px] text-sm text-left text-gray-300 bg-[#132D34]">
          <thead className="text-xs text-gray-300 uppercase bg-[#0D242B]/50">
            <tr>
              <th scope="col" className="px-3 py-3 text-center">{player1NameSnapshot} H.Break</th>
              <th scope="col" className="px-3 py-3 text-center">Points</th>
              <th scope="col" className="px-3 py-3 text-center font-bold text-lg">Frame</th>
              <th scope="col" className="px-3 py-3 text-center">Points</th>
              <th scope="col" className="px-3 py-3 text-center">{player2NameSnapshot} H.Break</th>
            </tr>
          </thead>
          <tbody>
            {frameHistory.map((frame, index) => (
              <tr key={index} className={`border-b border-[#314B52] ${index % 2 === 0 ? 'bg-[#132D34]' : 'bg-[#0D242B]/40'} hover:bg-[#314B52]/50 transition-colors`}>
                <td className={`px-3 py-3 text-center font-medium ${frame.player1HighestBreakInFrame >= 50 ? 'text-yellow-400' : ''}`}>
                  {frame.player1HighestBreakInFrame > 0 ? frame.player1HighestBreakInFrame : '-'}
                </td>
                <td className={`px-3 py-3 text-center font-bold ${frame.winner === Player.Player1 ? 'text-green-400' : ''}`}>
                  {frame.player1Score}
                </td>
                <td className="px-3 py-3 text-center font-bold text-sky-400">{frame.frameNumber}</td>
                <td className={`px-3 py-3 text-center font-bold ${frame.winner === Player.Player2 ? 'text-green-400' : ''}`}>
                  {frame.player2Score}
                </td>
                <td className={`px-3 py-3 text-center font-medium ${frame.player2HighestBreakInFrame >= 50 ? 'text-yellow-400' : ''}`}>
                  {frame.player2HighestBreakInFrame > 0 ? frame.player2HighestBreakInFrame : '-'}
                </td>
              </tr>
            ))}
             {frameHistory.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">No frame data recorded for this match.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchSummaryScreen;