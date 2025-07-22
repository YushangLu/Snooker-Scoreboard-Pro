import React from 'react';
import { FrameData, Player } from '../types';

interface MatchStatisticsDisplayProps {
    frameHistory: FrameData[];
    player1Name: string;
    player2Name: string;
}

export const MatchStatisticsDisplay: React.FC<MatchStatisticsDisplayProps> = ({ frameHistory, player1Name, player2Name }) => {
    const reversedHistory = [...frameHistory].reverse();

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Match Statistics</h2>
            <div className="overflow-x-auto max-h-60">
                 <table className="w-full min-w-[500px] text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase sticky top-0 bg-[#132D34]">
                        <tr>
                        <th scope="col" className="px-3 py-3 text-center">H.Break</th>
                        <th scope="col" className="px-3 py-3 text-center">Points</th>
                        <th scope="col" className="px-3 py-3 text-center font-bold text-lg text-white">Frame</th>
                        <th scope="col" className="px-3 py-3 text-center">Points</th>
                        <th scope="col" className="px-3 py-3 text-center">H.Break</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reversedHistory.length > 0 ? reversedHistory.map((frame, index) => (
                        <tr key={index} className="border-b border-[#314B52] hover:bg-[#0D242B]/50">
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
                        )) : (
                             <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-400">No frames completed yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
