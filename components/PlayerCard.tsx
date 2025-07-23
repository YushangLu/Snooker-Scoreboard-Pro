import React, { useState, useEffect } from 'react';
import { PlayerProfile } from '../types';
import PlayerImage from './PlayerImage';
import { COUNTRIES } from '../constants';

interface PlayerCardProps {
  player: PlayerProfile;
  onEdit: () => void;
  onDelete: () => void;
}

const Flag: React.FC<{ countryCode?: string, countryName?: string }> = ({ countryCode, countryName }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [countryCode]);

  if (!countryCode || error) {
    return <span className="text-4xl" title={countryName || "Unknown"}>🏳️</span>;
  }

  let code = countryCode.toLowerCase();
  // flagcdn uses 'gb' for the UK, which is a good fallback for Northern Ireland.
  if (code === 'gb-nir') {
    code = 'gb';
  }

  const flagUrl = `https://flagcdn.com/${code}.svg`;

  return (
    <img
      src={flagUrl}
      alt={countryName || countryCode}
      title={countryName || countryCode}
      className="w-16 object-contain rounded-sm shadow-md"
      onError={() => setError(true)}
    />
  );
};

const calculateAge = (dob?: string) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete }) => {
  const countryName = COUNTRIES.find(c => c.code === player.countryCode)?.name || player.countryCode;
  const age = calculateAge(player.dob);

  return (
    <div className="card flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <PlayerImage imageUrl={player.imageUrl} altText={player.name} size="h-24 w-24" />
          <Flag countryCode={player.countryCode} countryName={countryName} />
        </div>
        <h3 className="text-2xl font-bold text-white truncate">{player.name}</h3>
        <p className="text-sm text-slate-400">{countryName}</p>

        <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Age:</span>
            <span className="font-medium text-white">{age ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Turned Pro:</span>
            <span className="font-medium text-white">{player.turnedPro ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Playing Hand:</span>
            <span className="font-medium text-white">{player.playingHand ?? 'N/A'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-6">
        <button
          onClick={onEdit}
          className="scoreboard-button yellow flex-1 text-sm py-2"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="scoreboard-button red flex-1 text-sm py-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
