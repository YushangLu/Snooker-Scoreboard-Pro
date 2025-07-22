import { BallType, PlayingHand } from './types';

export const RED_BALL: BallType = { name: 'Red', value: 1, colorClass: 'bg-red-600 hover:bg-red-500', textColorClass: 'text-white', hex: '#DC2626' };
export const YELLOW_BALL: BallType = { name: 'Yellow', value: 2, colorClass: 'bg-yellow-400 hover:bg-yellow-300', textColorClass: 'text-black', hex: '#FBBF24' };
export const GREEN_BALL: BallType = { name: 'Green', value: 3, colorClass: 'bg-green-600 hover:bg-green-500', textColorClass: 'text-white', hex: '#16A34A' };
export const BROWN_BALL: BallType = { name: 'Brown', value: 4, colorClass: 'bg-amber-700 hover:bg-amber-600', textColorClass: 'text-white', hex: '#B45309' };
export const BLUE_BALL: BallType = { name: 'Blue', value: 5, colorClass: 'bg-blue-600 hover:bg-blue-500', textColorClass: 'text-white', hex: '#2563EB' };
export const PINK_BALL: BallType = { name: 'Pink', value: 6, colorClass: 'bg-pink-500 hover:bg-pink-400', textColorClass: 'text-white', hex: '#EC4899' };
export const BLACK_BALL: BallType = { name: 'Black', value: 7, colorClass: 'bg-black hover:bg-gray-700', textColorClass: 'text-white', hex: '#1f2937' };

export const COLORS_IN_SEQUENCE: BallType[] = [
  YELLOW_BALL,
  GREEN_BALL,
  BROWN_BALL,
  BLUE_BALL,
  PINK_BALL,
  BLACK_BALL,
];

export const ALL_BALLS: BallType[] = [
  RED_BALL,
  YELLOW_BALL,
  GREEN_BALL,
  BROWN_BALL,
  BLUE_BALL,
  PINK_BALL,
  BLACK_BALL,
];


export const ALL_COLORS_VALUE_SUM = COLORS_IN_SEQUENCE.reduce((sum, ball) => sum + ball.value, 0); // 27

export const INITIAL_REDS = 15;

export const FOUL_OPTIONS: number[] = [4, 5, 6, 7];

export const PLAYING_HANDS: PlayingHand[] = ['Right', 'Left', 'Ambidextrous'];

// ISO 3166-1 alpha-2 codes. Some nations share a code for flag emoji purposes (e.g., UK nations).
export const COUNTRIES: { name: string; code: string }[] = [
  { name: 'Australia', code: 'AU' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Canada', code: 'CA' },
  { name: 'China', code: 'CN' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'England', code: 'GB-ENG' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'India', code: 'IN' },
  { name: 'Iran', code: 'IR' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Malta', code: 'MT' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Northern Ireland', code: 'GB-NIR' },
  { name: 'Norway', code: 'NO' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Poland', code: 'PL' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Scotland', code: 'GB-SCT' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United States', code: 'US' },
  { name: 'Wales', code: 'GB-WLS' },
];