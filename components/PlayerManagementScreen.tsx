import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import PlayerCard from './PlayerCard';
import PlayerFormModal from './PlayerFormModal';
import ConfirmationModal from './ConfirmationModal';

interface PlayerManagementScreenProps {
  players: PlayerProfile[];
  onAddPlayer: (player: Omit<PlayerProfile, 'id'>) => void;
  onUpdatePlayer: (player: PlayerProfile) => void;
  onDeletePlayer: (playerId: string) => void;
}

const PlayerManagementScreen: React.FC<PlayerManagementScreenProps> = ({
  players,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerProfile | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<PlayerProfile | null>(null);

  const handleOpenAddModal = () => {
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (player: PlayerProfile) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const requestDeletePlayer = (player: PlayerProfile) => {
    setPlayerToDelete(player);
  };

  const handleConfirmDelete = () => {
    if (playerToDelete) {
      onDeletePlayer(playerToDelete.id);
      setPlayerToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
      setPlayerToDelete(null);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  const handleFormSubmit = (playerData: Omit<PlayerProfile, 'id'>) => {
    if (editingPlayer) {
      onUpdatePlayer({ ...editingPlayer, ...playerData });
    } else {
      onAddPlayer(playerData);
    }
    handleModalClose();
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-3xl font-bold text-white">Players</h2>
        <button
          onClick={handleOpenAddModal}
          className="scoreboard-button green"
        >
          Add New Player
        </button>
      </div>

      {players.length === 0 ? (
        <div className="card text-center py-16">
          <h3 className="text-xl text-white">No Players Found</h3>
          <p className="text-slate-400 mt-2">Click "Add New Player" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player, index) => (
            <div key={player.id} className="animate-fade-in-up" style={{ animationDelay: `${100 + index * 100}ms`}}>
                <PlayerCard
                    player={player}
                    onEdit={() => handleOpenEditModal(player)}
                    onDelete={() => requestDeletePlayer(player)}
                />
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <PlayerFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          initialData={editingPlayer}
        />
      )}

      {playerToDelete && (
        <ConfirmationModal
          isOpen={!!playerToDelete}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Player"
          message={`Are you sure you want to delete ${playerToDelete.name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default PlayerManagementScreen;