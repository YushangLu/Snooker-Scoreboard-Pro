import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, PlayingHand } from '../types';
import { COUNTRIES, PLAYING_HANDS } from '../constants';
import PlayerImage from './PlayerImage';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playerData: Omit<PlayerProfile, 'id'>) => void;
  initialData: PlayerProfile | null;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = useState<string | undefined>('');
  const [dob, setDob] = useState<string>('');
  const [turnedPro, setTurnedPro] = useState<number | ''>('');
  const [playingHand, setPlayingHand] = useState<PlayingHand>('Right');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setImageUrl(initialData.imageUrl);
      setCountryCode(initialData.countryCode || '');
      setDob(initialData.dob ? initialData.dob.split('T')[0] : '');
      setTurnedPro(initialData.turnedPro || '');
      setPlayingHand(initialData.playingHand || 'Right');
    } else {
      // Reset for new player
      setName('');
      setImageUrl(undefined);
      setCountryCode('');
      setDob('');
      setTurnedPro('');
      setPlayingHand('Right');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const base64 = await toBase64(file);
        setImageUrl(base64);
      } catch (error) {
        console.error("Error converting image to base64", error);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Player name is required.');
      return;
    }
    onSubmit({
      name: name.trim(),
      imageUrl,
      countryCode: countryCode || undefined,
      dob: dob || undefined,
      turnedPro: turnedPro ? Number(turnedPro) : undefined,
      playingHand,
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-[#132D34] border border-[#314B52] p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          {initialData ? 'Edit Player' : 'Add New Player'}
        </h3>
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 -mr-2 flex-grow">
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group shrink-0"
              >
                <PlayerImage imageUrl={imageUrl} altText={name || 'Player'} size="h-24 w-24" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              </button>
              <div className="flex flex-col gap-2">
                 <button type="button" onClick={() => fileInputRef.current?.click()} className="scoreboard-button text-sm py-1 px-3">Upload Image</button>
                 {imageUrl && <button type="button" onClick={handleRemoveImage} className="scoreboard-button red text-sm py-1 px-3">Remove</button>}
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-1">Player Name</label>
              <input id="playerName" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none" required />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Country / Region</label>
                <select id="country" value={countryCode} onChange={e => setCountryCode(e.target.value)} className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none">
                  <option value="">Select Country...</option>
                  {COUNTRIES.sort((a,b) => a.name.localeCompare(b.name)).map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                <input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="turnedPro" className="block text-sm font-medium text-gray-300 mb-1">Turned Pro (Year)</label>
                  <input id="turnedPro" type="number" placeholder="e.g. 2005" value={turnedPro} onChange={e => setTurnedPro(e.target.value ? parseInt(e.target.value, 10) : '')} className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                 <div>
                  <label htmlFor="playingHand" className="block text-sm font-medium text-gray-300 mb-1">Playing Hand</label>
                  <select id="playingHand" value={playingHand} onChange={e => setPlayingHand(e.target.value as PlayingHand)} className="w-full px-3 py-2 bg-[#0D242B] text-gray-100 border border-[#314B52] rounded-md focus:ring-2 focus:ring-sky-500 outline-none">
                    {PLAYING_HANDS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
            </div>
          </div>
        </form>
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-[#314B52] pt-6">
          <button type="button" onClick={onClose} className="scoreboard-button">Cancel</button>
          <button type="button" onClick={handleSubmit} className="scoreboard-button green">{initialData ? 'Save Changes' : 'Add Player'}</button>
        </div>
      </div>
    </div>
  );
};

export default PlayerFormModal;