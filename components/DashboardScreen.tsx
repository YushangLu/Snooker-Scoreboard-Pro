import React, { useMemo } from 'react';
import { CompletedMatch, AppStateView, Player } from '../types';
import PlayerImage from './PlayerImage';
import { SnookerLogoIcon } from './icons/SnookerLogoIcon';

interface DashboardScreenProps {
  completedMatches: CompletedMatch[];
  onNavigate: (view: AppStateView) => void;
  onViewMatchSummary: (match: CompletedMatch) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ completedMatches, onNavigate, onViewMatchSummary }) => {
  const recentMatch = completedMatches.length > 0 ? completedMatches[0] : null;

  const highBreaks = useMemo(() => {
    const allBreaks: {
        playerName: string;
        playerImageUrl?: string;
        breakScore: number;
        date: string;
        matchId: string;
    }[] = [];

    completedMatches.forEach(match => {
      match.frameHistory.forEach(frame => {
        if (frame.player1HighestBreakInFrame >= 50) {
          allBreaks.push({
            playerName: match.player1NameSnapshot,
            playerImageUrl: match.player1ImageUrlSnapshot,
            breakScore: frame.player1HighestBreakInFrame,
            date: match.date,
            matchId: match.id,
          });
        }
        if (frame.player2HighestBreakInFrame >= 50) {
          allBreaks.push({
            playerName: match.player2NameSnapshot,
            playerImageUrl: match.player2ImageUrlSnapshot,
            breakScore: frame.player2HighestBreakInFrame,
            date: match.date,
            matchId: match.id,
          });
        }
      });
    });

    allBreaks.sort((a, b) => {
      if (b.breakScore !== a.breakScore) {
        return b.breakScore - a.breakScore;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return allBreaks.slice(0, 5);
  }, [completedMatches]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center py-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">Welcome to Snooker Scoreboard Pro</h1>
        <p className="mt-4 text-lg text-slate-300">Your digital companion for every frame.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Match Card */}
        <div className="card lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-white mb-4">Recent Match</h2>
            {recentMatch ? (
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-around mb-4 p-4 bg-[#0D242B]/50 rounded-lg">
                            <div className="flex flex-col items-center text-center">
                                <PlayerImage imageUrl={recentMatch.player1ImageUrlSnapshot} altText={recentMatch.player1NameSnapshot} size="h-16 w-16" />
                                <p className="mt-2 text-md font-semibold">{recentMatch.player1NameSnapshot}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold">
                                    {recentMatch.finalScoreP1} <span className="text-2xl text-gray-400 mx-1">-</span> {recentMatch.finalScoreP2}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Frames</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <PlayerImage imageUrl={recentMatch.player2ImageUrlSnapshot} altText={recentMatch.player2NameSnapshot} size="h-16 w-16" />
                                <p className="mt-2 text-md font-semibold">{recentMatch.player2NameSnapshot}</p>
                            </div>
                        </div>
                        <p className="text-sm text-center text-gray-400">Played on {formatDate(recentMatch.date)}</p>
                    </div>
                    <button onClick={() => onViewMatchSummary(recentMatch)} className="scoreboard-button w-full mt-6 py-2">
                        View Details
                    </button>
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-400">No recent matches found.</p>
                    <p className="text-gray-500 text-sm">Play a match to see your history here.</p>
                </div>
            )}
        </div>

        {/* Quick Actions Card */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
            <div className="space-y-4">
                <button onClick={() => onNavigate(AppStateView.MATCH_SETUP)} className="scoreboard-button green w-full text-lg py-3">
                    Start New Match
                </button>
                <button onClick={() => onNavigate(AppStateView.PLAYER_MANAGEMENT)} className="scoreboard-button w-full py-3">
                    Manage Players
                </button>
                 <button onClick={() => onNavigate(AppStateView.MATCH_HISTORY)} className="scoreboard-button w-full py-3">
                    View History
                </button>
            </div>
        </div>

        {/* High Breaks Card */}
        <div className="card lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-2xl font-bold text-white mb-4">High Break Hall of Fame (50+)</h2>
            {highBreaks.length > 0 ? (
                <ul className="space-y-3">
                    {highBreaks.map((b, index) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-[#0D242B]/60 rounded-md">
                            <div className="flex items-center gap-3">
                                <PlayerImage imageUrl={b.playerImageUrl} altText={b.playerName} size="h-10 w-10"/>
                                <div>
                                    <p className="font-semibold text-white">{b.playerName}</p>
                                    <p className="text-xs text-slate-400">{formatDate(b.date)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-2xl font-bold ${b.breakScore >= 100 ? 'text-amber-400' : 'text-sky-400'}`}>{b.breakScore}</p>
                                <p className="text-xs text-slate-400">Break</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400">No breaks over 50 recorded yet.</p>
                    <p className="text-gray-500 text-sm">Keep playing to make the hall of fame!</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen;