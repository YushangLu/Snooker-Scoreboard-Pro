import React from 'react';
import { SnookerState, Player } from '../types';

interface FrameInfoDisplayProps {
  state: SnookerState;
}

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="text-center">
    <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-bold text-white mt-1">{value}</p>
  </div>
);

export const FrameInfoDisplay: React.FC<FrameInfoDisplayProps> = ({ state }) => {
  const lead = Math.abs(state.scores.Player1 - state.scores.Player2);
  
  return (
    <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Frame Info</h2>
        <div className="grid grid-cols-3 gap-4">
            <InfoItem label="Points Remaining" value={state.pointsEffectivelyRemaining} />
            <InfoItem label="Reds on Table" value={state.remainingReds} />
            <InfoItem label="Lead" value={lead} />
        </div>
    </div>
  );
};
