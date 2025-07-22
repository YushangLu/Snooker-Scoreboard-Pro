import { useReducer } from 'react';
import { Player, SnookerState, SnookerAction, GamePhase, BallType, FrameData } from '../types';
import { INITIAL_REDS, COLORS_IN_SEQUENCE, ALL_COLORS_VALUE_SUM, RED_BALL } from '../constants';

const opponent = (player: Player): Player => {
  return player === Player.Player1 ? Player.Player2 : Player.Player1;
};

const calculatePointsEffectivelyRemaining = (state: SnookerState): number => {
  if (state.gamePhase === GamePhase.FrameOver || state.gamePhase === GamePhase.MatchOver) return 0;
  
  let points = 0;
  if (state.remainingReds > 0) {
    points += state.remainingReds * 8; 
    points += ALL_COLORS_VALUE_SUM;
  } else { // remainingReds is 0
    if (state.gamePhase === GamePhase.ColorsSequence) {
      // If we are in the color sequence, sum only the remaining colors
      for (let i = state.nextColorInSequenceIndex; i < COLORS_IN_SEQUENCE.length; i++) {
        points += COLORS_IN_SEQUENCE[i].value;
      }
    } else {
      // If reds are gone but we are not in the color sequence yet (i.e., after the last red was potted),
      // then all colors are on the table.
      points = ALL_COLORS_VALUE_SUM;
    }
  }
  return points;
};

const getInitialFrameState = (
  player1Name: string,
  player2Name: string,
  player1ImageUrl: string | undefined,
  player2ImageUrl: string | undefined,
  currentFramesWon: Record<Player, number>,
  bestOfFrames: number,
  framePlayerToBreak: Player,
  existingFrameHistory: FrameData[] // Pass this to preserve history across frames in a match
): SnookerState => {
  const baseState: Omit<SnookerState, 'pointsEffectivelyRemaining' | 'uiMessage'> = {
    player1Name,
    player2Name,
    player1ImageUrl,
    player2ImageUrl,
    scores: { [Player.Player1]: 0, [Player.Player2]: 0 },
    framesWon: { ...currentFramesWon },
    currentTurn: framePlayerToBreak,
    currentBreak: 0,
    currentFrameHighestBreak: { [Player.Player1]: 0, [Player.Player2]: 0 },
    remainingReds: INITIAL_REDS,
    gamePhase: GamePhase.RedsAvailable,
    isWaitingForColorAfterRed: false,
    nextColorInSequenceIndex: 0,
    frameWinner: null,
    matchWinner: null, 
    isFoulDialogOpen: false,
    isMultiRedDialogOpen: false,
    playerToBreakNext: opponent(framePlayerToBreak),
    bestOfFrames,
    frameHistory: existingFrameHistory, // Keep history
    isFreeBallAvailable: false,
    isFreeBallActive: false,
  };
  const pointsRemaining = calculatePointsEffectivelyRemaining({ ...baseState, gamePhase: GamePhase.RedsAvailable, pointsEffectivelyRemaining: 0, uiMessage: '' });
  return {
    ...baseState,
    pointsEffectivelyRemaining: pointsRemaining,
    uiMessage: `${baseState[framePlayerToBreak === Player.Player1 ? 'player1Name' : 'player2Name']}'s turn to break. Pot a Red.`,
  };
};


const snookerReducer = (state: SnookerState, action: SnookerAction): SnookerState => {
  let newState = { ...state };
  const getCurrentPlayerName = () => newState.currentTurn === Player.Player1 ? newState.player1Name : newState.player2Name;

  switch (action.type) {
    case 'SETUP_NEW_MATCH': {
      const { player1Name, player2Name, player1ImageUrl, player2ImageUrl, bestOfFrames, firstPlayerToBreak } = action.payload;
      return getInitialFrameState(
        player1Name,
        player2Name,
        player1ImageUrl,
        player2ImageUrl,
        { [Player.Player1]: 0, [Player.Player2]: 0 }, 
        bestOfFrames,
        firstPlayerToBreak,
        [] // Fresh match, empty frame history
      );
    }
    
    case 'UPDATE_PLAYER_NAME': 
      if (action.payload.player === Player.Player1) {
        newState.player1Name = action.payload.name;
      } else {
        newState.player2Name = action.payload.name;
      }
      break;

    case 'START_FREE_BALL': {
        if (!newState.isFreeBallAvailable) return state;
        newState.isFreeBallActive = true;
        newState.isFreeBallAvailable = false;
        newState.uiMessage = `${getCurrentPlayerName()} has a Free Ball. Pot any color.`;
        break;
    }

    case 'POT_BALL': {
      if (newState.gamePhase === GamePhase.FrameOver || newState.gamePhase === GamePhase.MatchOver) return state;
      newState.isFreeBallAvailable = false; // Opportunity for free ball is lost once any pot is attempted

      const ball = action.payload.ball;
      const currentPlayerName = getCurrentPlayerName();

      if (newState.isFreeBallActive) {
        if (ball.name === RED_BALL.name) return state; // Cannot pot a red as a free ball
        newState.scores[newState.currentTurn] += 1; // Free ball counts as 1 point
        newState.currentBreak += 1;
        newState.isWaitingForColorAfterRed = true;
        newState.isFreeBallActive = false; // Free ball is now used up
        newState.uiMessage = `${currentPlayerName} potted Free Ball. Pot a Color. Break: ${newState.currentBreak}`;
        break;
      }
      
      newState.scores[newState.currentTurn] += ball.value;
      newState.currentBreak += ball.value;
      
      if (newState.currentBreak > newState.currentFrameHighestBreak[newState.currentTurn]) {
        newState.currentFrameHighestBreak[newState.currentTurn] = newState.currentBreak;
      }

      if (newState.gamePhase === GamePhase.RedsAvailable) {
        if (ball.name === RED_BALL.name) {
          newState.remainingReds -= 1;
          newState.isWaitingForColorAfterRed = true;
          newState.uiMessage = `${currentPlayerName} potted Red. Pot a Color. Break: ${newState.currentBreak}`;
          if (newState.remainingReds === 0) {
             newState.uiMessage = `${currentPlayerName} potted final Red. Pot a Color. Break: ${newState.currentBreak}`;
          }
        } else { 
          newState.isWaitingForColorAfterRed = false;
          if (newState.remainingReds > 0) {
            newState.uiMessage = `${currentPlayerName} potted ${ball.name}. Pot a Red. Break: ${newState.currentBreak}`;
          } else { 
            newState.gamePhase = GamePhase.ColorsSequence;
            newState.nextColorInSequenceIndex = 0; 
            newState.uiMessage = `${currentPlayerName} potted ${ball.name}. Pot ${COLORS_IN_SEQUENCE[0].name}. Break: ${newState.currentBreak}`;
          }
        }
      } else if (newState.gamePhase === GamePhase.ColorsSequence) {
        if (ball.name === COLORS_IN_SEQUENCE[newState.nextColorInSequenceIndex].name) {
          newState.nextColorInSequenceIndex += 1;
          if (newState.nextColorInSequenceIndex < COLORS_IN_SEQUENCE.length) {
            newState.uiMessage = `${currentPlayerName} potted ${ball.name}. Pot ${COLORS_IN_SEQUENCE[newState.nextColorInSequenceIndex].name}. Break: ${newState.currentBreak}`;
          } else { 
            newState.uiMessage = `${currentPlayerName} potted Black. Break: ${newState.currentBreak}. Table cleared.`;
          }
        }
      }
      break;
    }

    case 'END_TURN_OR_MISS': {
      if (newState.gamePhase === GamePhase.FrameOver || newState.gamePhase === GamePhase.MatchOver) return state;
      const previousPlayerName = getCurrentPlayerName();
      newState.currentTurn = opponent(newState.currentTurn);
      newState.currentBreak = 0;
      
      if (newState.isWaitingForColorAfterRed && newState.remainingReds === 0 && newState.gamePhase === GamePhase.RedsAvailable) {
        newState.gamePhase = GamePhase.ColorsSequence;
        newState.nextColorInSequenceIndex = 0; 
      }
      newState.isWaitingForColorAfterRed = false;
      newState.isFreeBallActive = false; // Free ball cannot carry over
      newState.isFreeBallAvailable = false; // Free ball opportunity ends with the turn

      const currentPlayerName = getCurrentPlayerName();
      let message = `${previousPlayerName} missed. ${currentPlayerName}'s turn. `;
      if (newState.gamePhase === GamePhase.RedsAvailable) {
        message += `Pot a Red.`;
      } else if (newState.gamePhase === GamePhase.ColorsSequence && newState.nextColorInSequenceIndex < COLORS_IN_SEQUENCE.length) {
        message += `Pot ${COLORS_IN_SEQUENCE[newState.nextColorInSequenceIndex].name}.`;
      }
      newState.uiMessage = message;
      break;
    }
    
    case 'OPEN_FOUL_DIALOG':
      if (newState.gamePhase === GamePhase.FrameOver || newState.gamePhase === GamePhase.MatchOver) return state;
      newState.isFoulDialogOpen = true;
      break;

    case 'CLOSE_FOUL_DIALOG':
      newState.isFoulDialogOpen = false;
      break;
    
    case 'OPEN_MULTI_RED_DIALOG':
      if (newState.gamePhase === GamePhase.FrameOver || newState.gamePhase === GamePhase.MatchOver) return state;
      if (newState.gamePhase === GamePhase.RedsAvailable && !newState.isWaitingForColorAfterRed) {
        newState.isMultiRedDialogOpen = true;
      }
      break;
      
    case 'CLOSE_MULTI_RED_DIALOG':
      newState.isMultiRedDialogOpen = false;
      break;
      
    case 'CONFIRM_MULTI_RED_POT': {
      const { count } = action.payload;
      if (newState.gamePhase !== GamePhase.RedsAvailable || newState.isWaitingForColorAfterRed || count <= 0 || count > newState.remainingReds) return state;
      
      newState.scores[newState.currentTurn] += count;
      newState.currentBreak += count;
      
      if (newState.currentBreak > newState.currentFrameHighestBreak[newState.currentTurn]) {
        newState.currentFrameHighestBreak[newState.currentTurn] = newState.currentBreak;
      }
      
      newState.remainingReds -= count;
      newState.isWaitingForColorAfterRed = true;
      
      const currentPlayerName = getCurrentPlayerName();
      const plural = count > 1 ? 's' : '';
      newState.uiMessage = `${currentPlayerName} potted ${count} Red${plural}. Pot a Color. Break: ${newState.currentBreak}`;
      
      if (newState.remainingReds === 0) {
        newState.uiMessage = `${currentPlayerName} potted final ${count} Red${plural}. Pot a Color. Break: ${newState.currentBreak}`;
      }
      
      newState.isMultiRedDialogOpen = false;
      break;
    }


    case 'CONFIRM_FOUL': {
      if (newState.gamePhase === GamePhase.FrameOver || newState.gamePhase === GamePhase.MatchOver) return state;
      const foulPoints = action.payload.points;
      const foulingPlayerName = getCurrentPlayerName();
      const benefitingPlayer = opponent(newState.currentTurn);
      newState.scores[benefitingPlayer] += foulPoints;
      newState.currentBreak = 0; 
      newState.currentTurn = benefitingPlayer;
      
      if (newState.isWaitingForColorAfterRed && newState.remainingReds === 0 && newState.gamePhase === GamePhase.RedsAvailable) {
        newState.gamePhase = GamePhase.ColorsSequence;
        newState.nextColorInSequenceIndex = 0;
      }
      newState.isWaitingForColorAfterRed = false;
      newState.isFoulDialogOpen = false;
      newState.isFreeBallActive = false; // Cannot be in free ball state after a foul
      newState.isFreeBallAvailable = true; // Incoming player gets a free ball option

      const currentPlayerName = getCurrentPlayerName();
      let message = `${foulingPlayerName} fouled (${foulPoints} points). ${currentPlayerName}'s turn. Free ball available.`;
       if (newState.gamePhase === GamePhase.RedsAvailable && newState.remainingReds > 0) {
        message += ` Pot a Red or take Free Ball.`;
      } else if (newState.gamePhase === GamePhase.ColorsSequence && newState.nextColorInSequenceIndex < COLORS_IN_SEQUENCE.length) {
         message += ` Pot ${COLORS_IN_SEQUENCE[newState.nextColorInSequenceIndex].name} or take Free Ball.`;
      } else if (newState.remainingReds === 0 && newState.gamePhase === GamePhase.RedsAvailable) { 
        newState.gamePhase = GamePhase.ColorsSequence;
        newState.nextColorInSequenceIndex = 0;
        message += ` Pot ${COLORS_IN_SEQUENCE[0].name} or take Free Ball.`;
      }
      newState.uiMessage = message;
      break;
    }

    case 'CONCEDE_FRAME': {
      if (newState.gamePhase === GamePhase.FrameOver || newState.gamePhase === GamePhase.MatchOver) return state;
      const concedingPlayer = newState.currentTurn;
      const winner = opponent(concedingPlayer);
      
      const frameNumber = newState.framesWon[Player.Player1] + newState.framesWon[Player.Player2] + 1;
      const newFrameData: FrameData = {
        frameNumber,
        player1Score: newState.scores[Player.Player1],
        player2Score: newState.scores[Player.Player2],
        player1HighestBreakInFrame: newState.currentFrameHighestBreak[Player.Player1],
        player2HighestBreakInFrame: newState.currentFrameHighestBreak[Player.Player2],
        winner: winner,
      };
      newState.frameHistory = [...newState.frameHistory, newFrameData];
      
      newState.frameWinner = winner;
      newState.framesWon[winner] += 1;
      newState.gamePhase = GamePhase.FrameOver;
      const concedingPlayerName = concedingPlayer === Player.Player1 ? newState.player1Name : newState.player2Name;
      const winningPlayerName = winner === Player.Player1 ? newState.player1Name : newState.player2Name;
      newState.uiMessage = `${concedingPlayerName} conceded. ${winningPlayerName} wins the frame!`;
      break;
    }

    case 'START_NEXT_FRAME': {
      if (newState.gamePhase !== GamePhase.FrameOver || newState.matchWinner) return state; 
      const playerBreakingThisFrame = action.payload?.firstPlayerToBreak || state.playerToBreakNext;
      const frameState = getInitialFrameState(
        state.player1Name,
        state.player2Name,
        state.player1ImageUrl,
        state.player2ImageUrl,
        state.framesWon, 
        state.bestOfFrames,
        playerBreakingThisFrame,
        state.frameHistory // Persist history
      );
      newState = {
        ...frameState,
        // currentFrameHighestBreak is reset in getInitialFrameState
      };
      break;
    }
    
    case 'RESET_MATCH_SCORES_AND_FRAMES': { 
        const firstPlayerToBreak = Player.Player1; 
         return getInitialFrameState(
            state.player1Name, state.player2Name,
            state.player1ImageUrl, state.player2ImageUrl,
            {[Player.Player1]:0, [Player.Player2]:0}, 
            state.bestOfFrames, 
            state.playerToBreakNext,
            [] // Reset frame history too for a full match reset
         );
    }

    default:
      return state; 
  }

  const excludedFromCommonLogic: Array<SnookerAction['type']> = [
    'UPDATE_PLAYER_NAME',
    'OPEN_FOUL_DIALOG',
    'CLOSE_FOUL_DIALOG',
    'OPEN_MULTI_RED_DIALOG',
    'CLOSE_MULTI_RED_DIALOG',
    'SETUP_NEW_MATCH'
  ];

  if (!excludedFromCommonLogic.includes(action.type)) {
    newState.pointsEffectivelyRemaining = calculatePointsEffectivelyRemaining(newState);

    if (newState.gamePhase === GamePhase.ColorsSequence && newState.nextColorInSequenceIndex >= COLORS_IN_SEQUENCE.length && !newState.frameWinner) {
      let winner: Player | null = null;
      if (newState.scores[Player.Player1] > newState.scores[Player.Player2]) {
        winner = Player.Player1;
      } else if (newState.scores[Player.Player2] > newState.scores[Player.Player1]) {
        winner = Player.Player2;
      }
      
      const frameNumber = newState.framesWon[Player.Player1] + newState.framesWon[Player.Player2] + 1;
      const newFrameData: FrameData = {
        frameNumber,
        player1Score: newState.scores[Player.Player1],
        player2Score: newState.scores[Player.Player2],
        player1HighestBreakInFrame: newState.currentFrameHighestBreak[Player.Player1],
        player2HighestBreakInFrame: newState.currentFrameHighestBreak[Player.Player2],
        winner: winner,
      };
      newState.frameHistory = [...newState.frameHistory, newFrameData];

      newState.gamePhase = GamePhase.FrameOver; 
      newState.frameWinner = winner;

      if (winner) {
        newState.framesWon[winner] += 1;
        const winningPlayerName = winner === Player.Player1 ? newState.player1Name : newState.player2Name;
        newState.uiMessage = `Frame Over! ${winningPlayerName} wins the frame! Points: ${newState.scores[Player.Player1]} - ${newState.scores[Player.Player2]}.`;
      } else {
        newState.uiMessage = `All balls potted. Frame scores: ${newState.player1Name} ${newState.scores[Player.Player1]} - ${newState.player2Name} ${newState.scores[Player.Player2]}.`;
        if (newState.scores[Player.Player1] === newState.scores[Player.Player2]) {
          newState.uiMessage += " Scores are level. Re-spot black is not implemented.";
        }
      }
    }

    if (newState.frameWinner && !newState.matchWinner) {
      const framesToWinMatch = Math.ceil(newState.bestOfFrames / 2);
      if (newState.framesWon[Player.Player1] === framesToWinMatch) {
        newState.matchWinner = Player.Player1;
      } else if (newState.framesWon[Player.Player2] === framesToWinMatch) {
        newState.matchWinner = Player.Player2;
      }

      if (newState.matchWinner) {
        newState.gamePhase = GamePhase.MatchOver;
        const matchWinningPlayerName = newState.matchWinner === Player.Player1 ? newState.player1Name : newState.player2Name;
        newState.uiMessage = `MATCH OVER! ${matchWinningPlayerName} wins the match ${newState.framesWon[Player.Player1]} - ${newState.framesWon[Player.Player2]} (Best of ${newState.bestOfFrames})!`;
      }
    }
  }
  
  return newState;
};

const initialSnookerState: SnookerState = {
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    scores: { [Player.Player1]: 0, [Player.Player2]: 0 },
    framesWon: { [Player.Player1]: 0, [Player.Player2]: 0 },
    currentTurn: Player.Player1,
    currentBreak: 0,
    currentFrameHighestBreak: { [Player.Player1]: 0, [Player.Player2]: 0 },
    remainingReds: INITIAL_REDS,
    gamePhase: GamePhase.RedsAvailable, 
    isWaitingForColorAfterRed: false,
    nextColorInSequenceIndex: 0,
    uiMessage: 'Match not started. Go to setup.',
    frameWinner: null,
    matchWinner: null,
    pointsEffectivelyRemaining: calculatePointsEffectivelyRemaining({ 
        remainingReds: INITIAL_REDS, 
        gamePhase: GamePhase.RedsAvailable, 
        nextColorInSequenceIndex: 0
    } as SnookerState),
    isFoulDialogOpen: false,
    isMultiRedDialogOpen: false,
    playerToBreakNext: Player.Player2,
    bestOfFrames: 0, 
    frameHistory: [],
    isFreeBallAvailable: false,
    isFreeBallActive: false,
};

const initializer = (initialState: SnookerState): SnookerState => {
    try {
        const storedState = localStorage.getItem('snookerActiveGameState');
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Simple validation to avoid crashing on malformed data
            if(parsedState.scores && parsedState.gamePhase) {
                // Ensure new state properties exist
                parsedState.isMultiRedDialogOpen = parsedState.isMultiRedDialogOpen || false;
                parsedState.isFreeBallAvailable = parsedState.isFreeBallAvailable || false;
                parsedState.isFreeBallActive = parsedState.isFreeBallActive || false;
                return parsedState;
            }
        }
    } catch (e) {
        console.error("Failed to load active game state from localStorage", e);
        localStorage.removeItem('snookerActiveGameState'); // Clear corrupted data
    }
    return initialState;
};


export const useSnookerReducer = () => {
  const [state, dispatch] = useReducer(snookerReducer, initialSnookerState, initializer);
  return { state, dispatch };
};