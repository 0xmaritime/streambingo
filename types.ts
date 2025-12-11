export type ThemeColor = 'neon-pink' | 'cyber-blue' | 'toxic-green' | 'sunset-orange' | 'royal-purple';

export interface BingoCard {
  id: string;
  title: string;
  description: string;
  items: string[]; // Array of 25 strings
  theme: ThemeColor;
  createdAt: number;
  updatedAt: number;
}

export interface GameProgress {
  cardId: string;
  markedIndices: number[]; // Array of indices (0-24)
  isWon: boolean;
  lastPlayed: number;
}

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgGradient: string;
  tileBg: string;
  tileMarked: string;
}
