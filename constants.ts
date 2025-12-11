import { ThemeConfig, ThemeColor } from './types';

export const GRID_SIZE = 5;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
export const CENTER_INDEX = 12;

export const THEMES: Record<ThemeColor, ThemeConfig> = {
  'neon-pink': {
    id: 'neon-pink',
    name: 'Neon Pink',
    primary: 'text-pink-500',
    secondary: 'text-pink-300',
    accent: 'border-pink-500',
    bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
    tileBg: 'bg-slate-800/80',
    tileMarked: 'bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.6)]',
  },
  'cyber-blue': {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    primary: 'text-cyan-400',
    secondary: 'text-cyan-200',
    accent: 'border-cyan-400',
    bgGradient: 'from-slate-900 via-slate-800 to-cyan-900',
    tileBg: 'bg-slate-800/80',
    tileMarked: 'bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.6)]',
  },
  'toxic-green': {
    id: 'toxic-green',
    name: 'Toxic Green',
    primary: 'text-lime-400',
    secondary: 'text-lime-200',
    accent: 'border-lime-400',
    bgGradient: 'from-slate-950 via-green-950 to-slate-950',
    tileBg: 'bg-zinc-900/80',
    tileMarked: 'bg-lime-600 shadow-[0_0_15px_rgba(101,163,13,0.6)]',
  },
  'sunset-orange': {
    id: 'sunset-orange',
    name: 'Sunset',
    primary: 'text-orange-500',
    secondary: 'text-yellow-300',
    accent: 'border-orange-500',
    bgGradient: 'from-slate-900 via-orange-950 to-red-950',
    tileBg: 'bg-slate-800/80',
    tileMarked: 'bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_15px_rgba(234,88,12,0.6)]',
  },
  'royal-purple': {
    id: 'royal-purple',
    name: 'Royal',
    primary: 'text-purple-400',
    secondary: 'text-fuchsia-300',
    accent: 'border-purple-500',
    bgGradient: 'from-indigo-950 via-purple-950 to-slate-900',
    tileBg: 'bg-indigo-950/50',
    tileMarked: 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.6)]',
  },
};

export const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];
