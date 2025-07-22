import React from 'react';
import { CompletedMatch } from '../types';
import PlayerImage from './PlayerImage';

interface MatchHistoryScreenProps {
  matches: CompletedMatch[];
  onViewMatchSummary: (match: CompletedMatch) => void;
}

const MatchHistoryScreen: React.FC<MatchHistoryScreenProps> = ({
  matches,
  onViewMatchSummary,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto card animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center sm:text-left">
          Match History
        </h2>
      </div>

      {matches.length === 0 ? (
        <p className="text-gray-400 text-center py-10 text-lg">
          No completed matches yet. Play a game to see it here!
        </p>
      ) : (
        <ul className="space-y-4">
          {matches.map((match, index) => (
            <li
              key={match.id}
              className="bg-[#0D242B]/60 p-4 rounded-lg shadow-md hover:bg-[#0D242B] transition-colors duration-150 animate-fade-in-up"
              style={{ animationDelay: `${100 + index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-grow">
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1 sm:mb-0">
                    <div className="flex items-center gap-2">
                      <PlayerImage imageUrl={match.player1ImageUrlSnapshot} altText={match.player1NameSnapshot} size="h-8 w-8" />
                      <span className="font-semibold text-gray-100">{match.player1NameSnapshot}</span>
                    </div>
                    <span className="text-gray-400 mx-1">vs</span>
                    <div className="flex items-center gap-2">
                       <PlayerImage imageUrl={match.player2ImageUrlSnapshot} altText={match.player2NameSnapshot} size="h-8 w-8" />
                       <span className="font-semibold text-gray-100">{match.player2NameSnapshot}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatDate(match.date)}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-0 w-full sm:w-auto shrink-0">
                  <p className="text-lg font-bold text-sky-400">
                    Score: {match.finalScoreP1} - {match.finalScoreP2}
                  </p>
                  <button
                    onClick={() => onViewMatchSummary(match)}
                    className="scoreboard-button w-full sm:w-auto text-sm py-1.5 px-3 mt-1 sm:mt-0"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchHistoryScreen;