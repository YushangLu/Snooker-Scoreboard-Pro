import React, { useMemo } from 'react';
import { CompletedMatch, PlayerProfile, Player } from '../types';
import PlayerImage from './PlayerImage';

interface StatisticsScreenProps {
  completedMatches: CompletedMatch[];
  playerProfiles: PlayerProfile[];
}

interface PlayerStats {
  id: string;
  name: string;
  imageUrl?: string;
  matchesPlayed: number;
  matchesWon: number;
  winRate: number;
  framesWon: number;
  highestBreak: number;
  centuryBreaks: number;
}

const StatCard: React.FC<{ label: string; value: string | number; subValue?: string }> = ({ label, value, subValue }) => (
  <div className="card text-center flex flex-col justify-between p-4">
    <div>
      <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-4xl md:text-5xl font-bold text-white mt-1">{value}</p>
    </div>
    {subValue && <p className="text-xs text-slate-400 mt-2">{subValue}</p>}
  </div>
);


const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ completedMatches, playerProfiles }) => {

  const stats = useMemo(() => {
    const playerStats: Record<string, PlayerStats> = {};

    playerProfiles.forEach(p => {
      playerStats[p.id] = {
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        matchesPlayed: 0,
        matchesWon: 0,
        winRate: 0,
        framesWon: 0,
        highestBreak: 0,
        centuryBreaks: 0,
      };
    });

    let totalFrames = 0;
    let overallHighestBreak = { score: 0, playerName: '' };
    let totalCenturies = 0;

    completedMatches.forEach(match => {
      const p1Id = match.player1Id;
      const p2Id = match.player2Id;

      if (playerStats[p1Id]) {
        playerStats[p1Id].matchesPlayed += 1;
      }
      if (playerStats[p2Id]) {
        playerStats[p2Id].matchesPlayed += 1;
      }

      if (match.matchWinner === Player.Player1 && playerStats[p1Id]) {
        playerStats[p1Id].matchesWon += 1;
      } else if (match.matchWinner === Player.Player2 && playerStats[p2Id]) {
        playerStats[p2Id].matchesWon += 1;
      }

      match.frameHistory.forEach(frame => {
        totalFrames += 1;

        if (frame.winner === Player.Player1 && playerStats[p1Id]) {
          playerStats[p1Id].framesWon += 1;
        } else if (frame.winner === Player.Player2 && playerStats[p2Id]) {
          playerStats[p2Id].framesWon += 1;
        }
        
        if (playerStats[p1Id]) {
            if(frame.player1HighestBreakInFrame > playerStats[p1Id].highestBreak) {
                playerStats[p1Id].highestBreak = frame.player1HighestBreakInFrame;
            }
            if(frame.player1HighestBreakInFrame >= 100) {
                playerStats[p1Id].centuryBreaks += 1;
            }
        }
        
        if (playerStats[p2Id]) {
            if(frame.player2HighestBreakInFrame > playerStats[p2Id].highestBreak) {
                playerStats[p2Id].highestBreak = frame.player2HighestBreakInFrame;
            }
            if(frame.player2HighestBreakInFrame >= 100) {
                playerStats[p2Id].centuryBreaks += 1;
            }
        }
      });
    });

    const leaderboard = Object.values(playerStats).map(p => {
      p.winRate = p.matchesPlayed > 0 ? Math.round((p.matchesWon / p.matchesPlayed) * 100) : 0;
      if (p.highestBreak > overallHighestBreak.score) {
          overallHighestBreak = { score: p.highestBreak, playerName: p.name };
      }
      totalCenturies += p.centuryBreaks;
      return p;
    }).sort((a, b) => b.matchesWon - a.matchesWon || b.winRate - a.winRate || b.highestBreak - a.highestBreak);

    return {
      totalMatches: completedMatches.length,
      totalFrames,
      overallHighestBreak,
      totalCenturies,
      leaderboard
    };

  }, [completedMatches, playerProfiles]);

  if (playerProfiles.length === 0) {
    return (
        <div className="w-full max-w-2xl mx-auto card text-center animate-fade-in">
            <h2 className="text-2xl font-semibold text-white mb-4">Statistics</h2>
            <p className="text-gray-300">No players found. Please add players to see statistics.</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white text-center">Match Statistics</h1>
      
      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <StatCard label="Total Matches" value={stats.totalMatches} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <StatCard label="Total Frames" value={stats.totalFrames} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <StatCard 
                label="Highest Break" 
                value={stats.overallHighestBreak.score > 0 ? stats.overallHighestBreak.score : '-'} 
                subValue={stats.overallHighestBreak.score > 0 ? `by ${stats.overallHighestBreak.playerName}` : 'N/A'}
            />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <StatCard label="Total Centuries" value={stats.totalCenturies} />
        </div>
      </div>

      {/* Player Leaderboard */}
      <div className="card">
         <h2 className="text-2xl font-bold text-white mb-4 text-center">Player Leaderboard</h2>
         <div className="overflow-x-auto rounded-lg shadow-md border border-[#314B52]">
            <table className="w-full min-w-[700px] text-sm text-left text-gray-300 bg-[#132D34]">
                <thead className="text-xs text-gray-300 uppercase bg-[#0D242B]/50">
                    <tr>
                        <th scope="col" className="px-3 py-3 text-center">Rank</th>
                        <th scope="col" className="px-6 py-3 text-left">Player</th>
                        <th scope="col" className="px-3 py-3 text-center">Wins</th>
                        <th scope="col" className="px-3 py-3 text-center">Win %</th>
                        <th scope="col" className="px-3 py-3 text-center">Frames Won</th>
                        <th scope="col" className="px-3 py-3 text-center">Highest Break</th>
                        <th scope="col" className="px-3 py-3 text-center">Centuries</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.leaderboard.length > 0 ? stats.leaderboard.map((player, index) => (
                        <tr key={player.id} className="border-b border-[#314B52] hover:bg-[#0D242B]/40 transition-colors animate-fade-in-up" style={{ animationDelay: `${500 + index * 100}ms` }}>
                            <td className="px-3 py-3 text-center font-bold text-lg text-sky-400">{index + 1}</td>
                            <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                    <PlayerImage imageUrl={player.imageUrl} altText={player.name} size="h-10 w-10"/>
                                    <span className="font-semibold text-white">{player.name}</span>
                                </div>
                            </td>
                            <td className="px-3 py-3 text-center font-medium">{player.matchesWon}</td>
                            <td className="px-3 py-3 text-center font-medium">{player.winRate}%</td>
                            <td className="px-3 py-3 text-center font-medium">{player.framesWon}</td>
                            <td className={`px-3 py-3 text-center font-bold ${player.highestBreak >= 100 ? 'text-amber-400' : player.highestBreak >= 50 ? 'text-yellow-400' : ''}`}>
                                {player.highestBreak > 0 ? player.highestBreak : '-'}
                            </td>
                            <td className="px-3 py-3 text-center font-medium text-amber-500">{player.centuryBreaks > 0 ? player.centuryBreaks : '-'}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={7} className="text-center py-6 text-gray-400">No match data available to generate leaderboard.</td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>

    </div>
  );
};

export default StatisticsScreen;