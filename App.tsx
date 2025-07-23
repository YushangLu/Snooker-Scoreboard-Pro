import React, { useState, useEffect, useCallback } from 'react';
import { PlayerProfile, MatchSettings, AppStateView, CompletedMatch } from './types';
import PlayerManagementScreen from './components/PlayerManagementScreen';
import MatchSetupScreen from './components/MatchSetupScreen';
import ScoreboardScreen from './components/ScoreboardScreen';
import MatchSummaryScreen from './components/MatchSummaryScreen';
import MatchHistoryScreen from './components/MatchHistoryScreen';
import AppHeader from './components/AppNavigationBar';
import SettingsModal from './components/SettingsModal';
import { useShortcutManager } from './hooks/useShortcutManager';
import WindowControls from './components/WindowControls';
import DashboardScreen from './components/DashboardScreen';
import StatisticsScreen from './components/StatisticsScreen';

// Helper function to generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const App: React.FC = () => {
  const [playerProfiles, setPlayerProfiles] = useState<PlayerProfile[]>([]);
  const [completedMatches, setCompletedMatches] = useState<CompletedMatch[]>([]);
  const [currentMatchSummaryData, setCurrentMatchSummaryData] = useState<CompletedMatch | null>(null);
  const [selectedMatchForSummary, setSelectedMatchForSummary] = useState<CompletedMatch | null>(null);

  const { shortcuts, updateShortcut, resetShortcuts, defaultShortcuts } = useShortcutManager();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load active match settings from localStorage
  const [matchSettings, setMatchSettings] = useState<MatchSettings | null>(() => {
    const savedSettings = localStorage.getItem('snookerActiveMatchSettings');
    try {
      return savedSettings ? JSON.parse(savedSettings) : null;
    } catch (e) {
      console.error("Failed to parse active match settings", e);
      return null;
    }
  });
  
  // Load current view, defaulting to scoreboard if a match is active, otherwise dashboard
  const [currentView, setCurrentView] = useState<AppStateView>(() => {
    const activeMatch = localStorage.getItem('snookerActiveMatchSettings');
    if (activeMatch) {
        return AppStateView.SCOREBOARD;
    }
    // No active match, default to dashboard.
    return AppStateView.DASHBOARD;
  });


  // Load data from localStorage
  useEffect(() => {
    const storedProfiles = localStorage.getItem('snookerPlayerProfiles');
    if (storedProfiles) {
      try {
        setPlayerProfiles(JSON.parse(storedProfiles));
      } catch (e) {
        console.error("Failed to parse player profiles from localStorage", e);
        setPlayerProfiles([]); 
      }
    }
    const storedMatches = localStorage.getItem('snookerMatchHistory');
    if (storedMatches) {
      try {
        const parsedMatches: CompletedMatch[] = JSON.parse(storedMatches);
        // Sort matches by date, most recent first
        parsedMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCompletedMatches(parsedMatches);
      } catch (e) {
        console.error("Failed to parse match history from localStorage", e);
        setCompletedMatches([]);
      }
    }
  }, []);

  // Save player profiles to localStorage
  useEffect(() => {
    localStorage.setItem('snookerPlayerProfiles', JSON.stringify(playerProfiles));
  }, [playerProfiles]);

  // Save completed matches to localStorage
  useEffect(() => {
    localStorage.setItem('snookerMatchHistory', JSON.stringify(completedMatches));
  }, [completedMatches]);

  // Save current view to localStorage
  useEffect(() => {
    // We don't want to save SCOREBOARD view if the user might want to land on Dashboard next time.
    // The startup logic handles this, so we can just save the view as is.
    localStorage.setItem('snookerCurrentView', JSON.stringify(currentView));
  }, [currentView]);

  // Save active match settings to localStorage
  useEffect(() => {
    if (matchSettings) {
      localStorage.setItem('snookerActiveMatchSettings', JSON.stringify(matchSettings));
    } else {
      localStorage.removeItem('snookerActiveMatchSettings');
    }
  }, [matchSettings]);

  const handleAddPlayer = useCallback((player: Omit<PlayerProfile, 'id'>) => {
    setPlayerProfiles(prev => [...prev, { ...player, id: generateId() }]);
  }, []);

  const handleUpdatePlayer = useCallback((updatedPlayer: PlayerProfile) => {
    setPlayerProfiles(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  }, []);

  const handleDeletePlayer = useCallback((playerId: string) => {
    setPlayerProfiles(prev => prev.filter(p => p.id !== playerId));
    if (matchSettings && (matchSettings.player1Id === playerId || matchSettings.player2Id === playerId)) {
        setMatchSettings(null); // Clear match settings if a participating player is deleted
        setCurrentView(AppStateView.MATCH_SETUP); 
    }
  }, [matchSettings]);

  const handleStartMatch = useCallback((settings: MatchSettings) => {
    if (!settings.player1Id || !settings.player2Id) {
        alert("Please select two different players for the match.");
        return;
    }
    if (settings.player1Id === settings.player2Id) {
        alert("Players must be different.");
        return;
    }
    setMatchSettings(settings);
    setCurrentView(AppStateView.SCOREBOARD);
  }, []);

  const handleMatchCompleted = useCallback((completedMatchData: CompletedMatch) => {
    setCompletedMatches(prev => [completedMatchData, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentMatchSummaryData(completedMatchData);
    setSelectedMatchForSummary(null); // Clear any selection from history
    setCurrentView(AppStateView.MATCH_SUMMARY);
    setMatchSettings(null); // Clear the active match
  }, []);
  
  const handleViewMatchSummaryFromHistory = useCallback((match: CompletedMatch) => {
    setSelectedMatchForSummary(match);
    setCurrentMatchSummaryData(null); // Ensure only one summary data source is active
    setCurrentView(AppStateView.MATCH_SUMMARY);
  }, []);

  const navigateToView = (view: AppStateView) => {
    if (view !== AppStateView.MATCH_SUMMARY) {
        setCurrentMatchSummaryData(null);
        setSelectedMatchForSummary(null);
    }
    if (view === AppStateView.SCOREBOARD && !matchSettings) {
      // Don't navigate to scoreboard if no match is active, go to setup instead.
      setCurrentView(AppStateView.MATCH_SETUP);
      return;
    }
    setCurrentView(view);
  };

  const renderContent = () => {
    switch(currentView) {
      case AppStateView.DASHBOARD:
        return <DashboardScreen
                  completedMatches={completedMatches}
                  onNavigate={navigateToView}
                  onViewMatchSummary={handleViewMatchSummaryFromHistory}
              />;
      case AppStateView.PLAYER_MANAGEMENT:
        return <PlayerManagementScreen
                  players={playerProfiles}
                  onAddPlayer={handleAddPlayer}
                  onUpdatePlayer={handleUpdatePlayer}
                  onDeletePlayer={handleDeletePlayer}
              />;
      case AppStateView.MATCH_HISTORY:
        return <MatchHistoryScreen
                  matches={completedMatches}
                  onViewMatchSummary={handleViewMatchSummaryFromHistory}
              />;
      case AppStateView.STATISTICS:
        return <StatisticsScreen
            completedMatches={completedMatches}
            playerProfiles={playerProfiles}
        />;
      case AppStateView.MATCH_SETUP:
         return <MatchSetupScreen
                players={playerProfiles}
                onStartMatch={handleStartMatch}
                currentMatchSettings={matchSettings}
            />;
      case AppStateView.SCOREBOARD:
        if (matchSettings) {
          return <ScoreboardScreen
                    matchSettings={matchSettings}
                    playerProfiles={playerProfiles}
                    onMatchComplete={handleMatchCompleted}
                    onNavigateToMatchSetup={() => navigateToView(AppStateView.MATCH_SETUP)}
                    shortcutSettings={shortcuts}
                />;
        }
        // Fallback if somehow scoreboard is active view without settings
        navigateToView(AppStateView.DASHBOARD);
        return null;
      case AppStateView.MATCH_SUMMARY:
         if(currentMatchSummaryData || selectedMatchForSummary){
            return <MatchSummaryScreen
                matchData={currentMatchSummaryData || selectedMatchForSummary!}
            />;
         }
         // Fallback if summary is active view without data
         navigateToView(AppStateView.MATCH_HISTORY);
         return null;
      default:
        return <DashboardScreen
                    completedMatches={completedMatches}
                    onNavigate={navigateToView}
                    onViewMatchSummary={handleViewMatchSummaryFromHistory}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D242B] text-gray-200 flex flex-col selection:bg-sky-500 selection:text-white">
      <div className="fixed top-0 left-0 w-full h-12 draggable z-10" />
      <WindowControls />

      <header className="relative z-20 w-full flex-shrink-0">
          <AppHeader 
            currentView={currentView} 
            onNavigate={navigateToView} 
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
      </header>

      <main key={currentView} className="w-full max-w-7xl mx-auto flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6 no-draggable">
        {renderContent()}
      </main>
      
      {isSettingsOpen && (
        <SettingsModal
          shortcuts={shortcuts}
          defaultShortcuts={defaultShortcuts}
          onUpdateShortcut={updateShortcut}
          onReset={resetShortcuts}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      <footer className="py-4 text-center text-slate-500 text-sm no-draggable w-full flex-shrink-0">
        <p>&copy; {new Date().getFullYear()} Snooker Scoreboard Pro. Crafted for snooker enthusiasts.</p>
      </footer>
    </div>
  );
};

export default App;