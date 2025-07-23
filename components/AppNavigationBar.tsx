import React from 'react';
import { AppStateView } from '../types';
import { SettingsIcon } from './icons/SettingsIcon';
import { SnookerLogoIcon } from './icons/SnookerLogoIcon';

interface AppHeaderProps {
  currentView: AppStateView;
  onNavigate: (view: AppStateView) => void;
  onOpenSettings: () => void;
}

const NavButton: React.FC<{
  label: string;
  view: AppStateView;
  currentView: AppStateView;
  onClick: (view: AppStateView) => void;
  disabled?: boolean;
}> = ({ label, view, currentView, onClick, disabled }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => onClick(view)}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                  }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
       {isActive && <div className="mt-1 h-0.5 w-full bg-sky-500 rounded-full"></div>}
    </button>
  );
};

const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onNavigate, onOpenSettings }) => {
  
  const handleMatchNav = () => {
    const activeMatch = localStorage.getItem('snookerActiveMatchSettings');
    onNavigate(activeMatch ? AppStateView.SCOREBOARD : AppStateView.MATCH_SETUP);
  };

  const isMatchViewActive = currentView === AppStateView.MATCH_SETUP || currentView === AppStateView.SCOREBOARD;

  return (
    <div className="w-full flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8 no-draggable">
      <div className="flex items-center space-x-3">
        <SnookerLogoIcon className="w-8 h-8 text-white"/>
        <h1 className="text-xl font-bold text-white tracking-wide">Snooker Scoreboard</h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <NavButton
            label="Home"
            view={AppStateView.DASHBOARD}
            currentView={currentView}
            onClick={onNavigate}
        />
        <button
          onClick={handleMatchNav}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                      ${isMatchViewActive 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                      }`}
          aria-current={isMatchViewActive ? 'page' : undefined}
        >
          Match
           {isMatchViewActive && <div className="mt-1 h-0.5 w-full bg-sky-500 rounded-full"></div>}
        </button>
        <NavButton
          label="History"
          view={AppStateView.MATCH_HISTORY}
          currentView={currentView}
          onClick={onNavigate}
        />
        <NavButton
          label="Statistics"
          view={AppStateView.STATISTICS}
          currentView={currentView}
          onClick={onNavigate}
        />
        <NavButton
          label="Players"
          view={AppStateView.PLAYER_MANAGEMENT}
          currentView={currentView}
          onClick={onNavigate}
        />
        <button
          onClick={onOpenSettings}
          title="Settings"
          aria-label="Open settings"
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <SettingsIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
