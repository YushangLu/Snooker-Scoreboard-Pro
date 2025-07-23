import React, { useEffect, useCallback } from 'react';
import { useSnookerReducer } from '../hooks/useSnookerReducer';
import { ScoreDisplay } from './ScoreDisplay';
import { GameControls } from './GameControls';
import { FoulDialog } from './FoulDialog';
import { FrameInfoDisplay } from './FrameInfoDisplay';
import { MatchStatisticsDisplay } from './MatchStatisticsDisplay';
import { MatchSettings, PlayerProfile, Player, GamePhase, CompletedMatch, ShortcutSettings, ShortcutAction } from '../types';
import { RED_BALL, YELLOW_BALL, GREEN_BALL, BROWN_BALL, BLUE_BALL, PINK_BALL, BLACK_BALL, COLORS_IN_SEQUENCE, FOUL_OPTIONS } from '../constants';
import MultiRedPotDialog from './MultiRedPotDialog';


// Helper function to generate unique IDs (can be moved to a utils file if used elsewhere)
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
const ACTIVE_GAME_STATE_KEY = 'snookerActiveGameState';

interface ScoreboardScreenProps {
  matchSettings: MatchSettings;
  playerProfiles: PlayerProfile[];
  shortcutSettings: ShortcutSettings;
  onMatchComplete: (completedMatchData: CompletedMatch) => void; 
  onNavigateToMatchSetup: () => void; 
}

const ScoreboardScreen: React.FC<ScoreboardScreenProps> = ({
  matchSettings,
  playerProfiles,
  shortcutSettings,
  onMatchComplete,
  onNavigateToMatchSetup
}) => {
  const { state, dispatch } = useSnookerReducer();

  // Effect to handle new match setup vs resuming
  useEffect(() => {
    const p1Profile = playerProfiles.find(p => p.id === matchSettings.player1Id);
    const p2Profile = playerProfiles.find(p => p.id === matchSettings.player2Id);

    if (p1Profile && p2Profile) {
      // Check if the state in the reducer already corresponds to the current match.
      // This prevents resetting a game that was resumed from localStorage.
      const isMatchAlreadySetup = 
        state.player1Name === p1Profile.name &&
        state.player2Name === p2Profile.name &&
        state.bestOfFrames === matchSettings.bestOfFrames;
        
      if (!isMatchAlreadySetup) {
        // This is a new match, or the loaded state is for a different match.
        // So, we reset the state for the new match.
        dispatch({
          type: 'SETUP_NEW_MATCH',
          payload: {
            player1Name: p1Profile.name,
            player2Name: p2Profile.name,
            player1ImageUrl: p1Profile.imageUrl,
            player2ImageUrl: p2Profile.imageUrl,
            bestOfFrames: matchSettings.bestOfFrames,
            firstPlayerToBreak: Player.Player1, 
          }
        });
      }
    } else {
      console.error("Selected players not found in profiles for scoreboard.");
      onNavigateToMatchSetup(); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchSettings.player1Id, matchSettings.player2Id, matchSettings.bestOfFrames, playerProfiles, dispatch]); 

  // Effect to persist game state to localStorage
  useEffect(() => {
    if (state.matchWinner) {
      // If a match winner is declared, the match is over. Clean up the saved state.
      localStorage.removeItem(ACTIVE_GAME_STATE_KEY);
    } else if (state.bestOfFrames > 0) {
      // Only save state if it's a valid, ongoing match.
      localStorage.setItem(ACTIVE_GAME_STATE_KEY, JSON.stringify(state));
    }
  }, [state]);


  const handleFinishMatchAndShowSummary = useCallback(() => {
    if (state.matchWinner && matchSettings.player1Id && matchSettings.player2Id) {
      const p1Profile = playerProfiles.find(p => p.id === matchSettings.player1Id);
      const p2Profile = playerProfiles.find(p => p.id === matchSettings.player2Id);

      if (p1Profile && p2Profile) {
        const completedMatchData: CompletedMatch = {
          id: generateId(),
          player1Id: matchSettings.player1Id,
          player2Id: matchSettings.player2Id,
          player1NameSnapshot: p1Profile.name,
          player2NameSnapshot: p2Profile.name,
          player1ImageUrlSnapshot: p1Profile.imageUrl,
          player2ImageUrlSnapshot: p2Profile.imageUrl,
          finalScoreP1: state.framesWon[Player.Player1],
          finalScoreP2: state.framesWon[Player.Player2],
          bestOfFrames: state.bestOfFrames,
          date: new Date().toISOString(),
          frameHistory: state.frameHistory,
          matchWinner: state.matchWinner,
        };
        onMatchComplete(completedMatchData);
        // Clean up the active game state from storage as the match is now completed.
        localStorage.removeItem(ACTIVE_GAME_STATE_KEY);
      } else {
         console.error("Could not find player profiles to create match summary.");
         onNavigateToMatchSetup();
      }
    } else {
      console.warn("Attempted to finish match but no match winner determined or player IDs missing.");
      onNavigateToMatchSetup(); 
    }
  }, [state, matchSettings, playerProfiles, onMatchComplete, onNavigateToMatchSetup]);
  
  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key presses if an input field is focused or a modal is open.
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;

      const pressedKey = e.key.toLowerCase();
      const action = (Object.keys(shortcutSettings) as ShortcutAction[]).find(
        (key) => shortcutSettings[key].toLowerCase() === pressedKey
      );

      if (!action) return;

      e.preventDefault();

      const isGameActive = state.gamePhase !== GamePhase.FrameOver && state.gamePhase !== GamePhase.MatchOver;
      const isFrameOver = state.gamePhase === GamePhase.FrameOver;
      const isMatchOver = state.gamePhase === GamePhase.MatchOver;

      const ballMap = {
        potRed: RED_BALL, potYellow: YELLOW_BALL, potGreen: GREEN_BALL, potBrown: BROWN_BALL,
        potBlue: BLUE_BALL, potPink: PINK_BALL, potBlack: BLACK_BALL
      };

      if (action.startsWith('pot')) {
        if (!isGameActive) return;
        const ball = ballMap[action as keyof typeof ballMap];
        if (ball.name === 'Red') {
          if (state.gamePhase === GamePhase.RedsAvailable && !state.isWaitingForColorAfterRed && state.remainingReds > 0) {
            dispatch({ type: 'POT_BALL', payload: { ball } });
          }
        } else { // It's a color
            let isColorEnabled = false;
            if (state.isFreeBallActive) {
                isColorEnabled = true;
            } else if (state.gamePhase === GamePhase.RedsAvailable && state.isWaitingForColorAfterRed) {
                isColorEnabled = true;
            } else if (state.gamePhase === GamePhase.ColorsSequence && ball.name === COLORS_IN_SEQUENCE[state.nextColorInSequenceIndex]?.name) {
                isColorEnabled = true;
            }
          if (isColorEnabled) {
            dispatch({ type: 'POT_BALL', payload: { ball } });
          }
        }
        return;
      }

      if (action.startsWith('foul') && action.length > 4) { // Handles foul4, foul5, etc.
        if (isGameActive) {
            const points = parseInt(action.slice(4), 10);
            if (!isNaN(points) && FOUL_OPTIONS.includes(points)) {
                dispatch({ type: 'CONFIRM_FOUL', payload: { points } });
            }
        }
        return;
      }
      
      switch(action) {
        case 'foul':
          if (isGameActive) dispatch({ type: 'OPEN_FOUL_DIALOG' });
          break;
        case 'endTurn':
          if (isGameActive) dispatch({ type: 'END_TURN_OR_MISS' });
          break;
        case 'concedeFrame':
          if (isGameActive) dispatch({ type: 'CONCEDE_FRAME' });
          break;
        case 'startNextFrame':
          if (isFrameOver && !isMatchOver) {
            dispatch({ type: 'START_NEXT_FRAME', payload: { firstPlayerToBreak: state.playerToBreakNext } });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutSettings, state, dispatch]);


  if (!matchSettings.player1Id || !matchSettings.player2Id) {
    return (
        <div className="text-center p-8">
            <p className="text-xl text-red-400 mb-4">Error: Match settings are incomplete.</p>
            <button onClick={onNavigateToMatchSetup} className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md">
                Return to Match Setup
            </button>
        </div>
    );
  }
  
  const isInitialized = state.player1Name !== 'Player 1' || state.player2Name !== 'Player 2';
  if (state.bestOfFrames === 0 && !isInitialized && state.uiMessage === 'Match not started. Go to setup.') {
     return (
      <div className="text-center p-8 text-gray-300">
        Loading match...
      </div>
    );
  }


  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <ScoreDisplay state={state} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FrameInfoDisplay state={state} />
            <MatchStatisticsDisplay frameHistory={state.frameHistory} player1Name={state.player1Name} player2Name={state.player2Name}/>
        </div>
      </div>
      <div className="lg:col-span-1">
        <GameControls 
          state={state} 
          dispatch={dispatch} 
          onFinishMatchAndShowSummary={handleFinishMatchAndShowSummary} 
          onNavigateToMatchSetup={onNavigateToMatchSetup}
        />
      </div>

      <FoulDialog isOpen={state.isFoulDialogOpen} dispatch={dispatch} />
      <MultiRedPotDialog 
        isOpen={state.isMultiRedDialogOpen} 
        dispatch={dispatch} 
        remainingReds={state.remainingReds} 
      />
    </div>
  );
};

export default ScoreboardScreen;