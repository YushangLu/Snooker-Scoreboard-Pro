import React from 'react';
import { PlayerProfile } from '../types';
import PlayerImage from './PlayerImage';
import { COUNTRIES } from '../constants';

interface PlayerCardProps {
  player: PlayerProfile;
  onEdit: () => void;
  onDelete: () => void;
}

const getFlagEmoji = (countryCode?: string) => {
  if (!countryCode) return '🏳️';
  
  // Handle special cases for UK nations
  const ukMap: {[key: string]: string} = {
    'GB-ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'GB-WLS': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'GB-SCT': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'GB-NIR': '🇬🇧', // No official N.Ireland emoji flag
  };
  if(ukMap[countryCode]) return ukMap[countryCode];
  
  // Standard ISO 3166-1 alpha-2 codes
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
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
          <span className="text-5xl" title={countryName}>{getFlagEmoji(player.countryCode)}</span>
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