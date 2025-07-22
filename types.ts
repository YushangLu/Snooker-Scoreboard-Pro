export enum Player {
  Player1 = 'Player1',
  Player2 = 'Player2',
}

export interface BallType {
  name: string;
  value: number;
  colorClass: string; // Tailwind background color class
  textColorClass: string; // Tailwind text color class
  hex: string; // Hex color for styling
}

export enum GamePhase {
  RedsAvailable = 'REDS_AVAILABLE',
  ColorsSequence = 'COLORS_SEQUENCE',
  FrameOver = 'FRAME_OVER',
  MatchOver = 'MATCH_OVER',
}

export type PlayingHand = 'Right' | 'Left' | 'Ambidextrous';

export interface PlayerProfile {
  id: string;
  name: string;
  imageUrl?: string; // base64 string
  countryCode?: string;
  dob?: string; // Date of birth as ISO string
  turnedPro?: number;
  playingHand?: PlayingHand;
}

export interface MatchSettings {
  player1Id: string | null;
  player2Id: string | null;
  bestOfFrames: number; // e.g., 5 for BO5 (first to 3)
}

export enum AppStateView {
  DASHBOARD = 'DASHBOARD',
  PLAYER_MANAGEMENT = 'PLAYER_MANAGEMENT',
  MATCH_HISTORY = 'MATCH_HISTORY',
  MATCH_SETUP = 'MATCH_SETUP',
  SCOREBOARD = 'SCOREBOARD',
  MATCH_SUMMARY = 'MATCH_SUMMARY',
  STATISTICS = 'STATISTICS',
}

export interface FrameData {
  frameNumber: number;
  player1Score: number;
  player2Score: number;
  player1HighestBreakInFrame: number;
  player2HighestBreakInFrame: number;
  winner: Player | null;
}

export interface CompletedMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  player1NameSnapshot: string;
  player2NameSnapshot: string;
  player1ImageUrlSnapshot?: string;
  player2ImageUrlSnapshot?: string;
  finalScoreP1: number; // Frames won by P1
  finalScoreP2: number; // Frames won by P2
  bestOfFrames: number;
  date: string; // ISO string
  frameHistory: FrameData[];
  matchWinner: Player | null;
}

export interface SnookerState {
  player1Name: string;
  player2Name: string;
  player1ImageUrl?: string;
  player2ImageUrl?: string;
  scores: Record<Player, number>;
  framesWon: Record<Player, number>;
  currentTurn: Player;
  currentBreak: number;
  currentFrameHighestBreak: Record<Player, number>;
  remainingReds: number;
  gamePhase: GamePhase;
  isWaitingForColorAfterRed: boolean;
  nextColorInSequenceIndex: number;
  uiMessage: string;
  frameWinner: Player | null;
  matchWinner: Player | null;
  pointsEffectivelyRemaining: number;
  isFoulDialogOpen: boolean;
  isMultiRedDialogOpen: boolean;
  playerToBreakNext: Player;
  bestOfFrames: number;
  frameHistory: FrameData[];
  isFreeBallAvailable: boolean;
  isFreeBallActive: boolean;
}

export type SnookerAction =
  | { type: 'SETUP_NEW_MATCH'; payload: { player1Name: string; player2Name: string; player1ImageUrl?: string; player2ImageUrl?: string; bestOfFrames: number; firstPlayerToBreak: Player } }
  | { type: 'UPDATE_PLAYER_NAME'; payload: { player: Player; name: string } }
  | { type: 'POT_BALL'; payload: { ball: BallType } }
  | { type: 'END_TURN_OR_MISS' }
  | { type: 'OPEN_FOUL_DIALOG' }
  | { type: 'CLOSE_FOUL_DIALOG' }
  | { type: 'CONFIRM_FOUL'; payload: { points: number } }
  | { type: 'OPEN_MULTI_RED_DIALOG' }
  | { type: 'CLOSE_MULTI_RED_DIALOG' }
  | { type: 'CONFIRM_MULTI_RED_POT'; payload: { count: number } }
  | { type: 'CONCEDE_FRAME' }
  | { type: 'START_NEXT_FRAME'; payload?: { firstPlayerToBreak?: Player } }
  | { type: 'RESET_MATCH_SCORES_AND_FRAMES' }
  | { type: 'START_FREE_BALL' };

export type ShortcutAction =
  | 'potRed' | 'potYellow' | 'potGreen' | 'potBrown' | 'potBlue' | 'potPink' | 'potBlack'
  | 'foul' | 'endTurn' | 'concedeFrame' | 'startNextFrame'
  | 'foul4' | 'foul5' | 'foul6' | 'foul7';

export type ShortcutSettings = Record<ShortcutAction, string>;