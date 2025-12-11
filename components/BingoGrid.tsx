import React from 'react';
import { CENTER_INDEX, TOTAL_CELLS } from '../constants';

interface BingoGridProps {
  items: string[];
  markedIndices?: number[];
  onCellClick?: (index: number) => void;
  onCellChange?: (index: number, value: string) => void;
  mode: 'edit' | 'play' | 'view';
  themeClass: string;
  tileBgClass: string;
  tileMarkedClass: string;
}

const BingoGrid: React.FC<BingoGridProps> = ({
  items,
  markedIndices = [],
  onCellClick,
  onCellChange,
  mode,
  themeClass,
  tileBgClass,
  tileMarkedClass,
}) => {
  const cells = Array.from({ length: TOTAL_CELLS });

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4 w-full max-w-2xl mx-auto p-4 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 shadow-2xl">
      {cells.map((_, index) => {
        const isCenter = index === CENTER_INDEX;
        const isMarked = markedIndices.includes(index) || (isCenter && mode === 'play');
        const content = isCenter ? "БЕСПЛАТНЫЙ ПУНКТ" : items[index < CENTER_INDEX ? index : index - 1] || "";

        if (mode === 'edit' && !isCenter) {
          return (
            <div key={index} className="aspect-square relative group">
              <textarea
                value={content}
                onChange={(e) => onCellChange && onCellChange(index < CENTER_INDEX ? index : index - 1, e.target.value)}
                className={`w-full h-full p-2 text-xs sm:text-sm text-center resize-none rounded-lg
                  bg-slate-800 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                  transition-all outline-none flex items-center justify-center`}
                placeholder="Enter text..."
              />
              <span className="absolute top-1 left-1 text-[10px] text-slate-500 pointer-events-none">
                {index + 1}
              </span>
            </div>
          );
        }

        return (
          <button
            key={index}
            onClick={() => mode === 'play' && !isCenter && onCellClick && onCellClick(index)}
            disabled={mode === 'view' || (isCenter && mode === 'play')}
            className={`
              aspect-square rounded-lg flex items-center justify-center p-1 sm:p-2 text-center select-none transition-all duration-300
              ${isCenter ? 'font-black text-yellow-400 border-2 border-yellow-500/50 bg-yellow-900/20 text-[10px] sm:text-xs' : ''}
              ${isMarked && !isCenter ? `${tileMarkedClass} scale-[0.98] text-white font-bold` : `${tileBgClass} hover:bg-white/10`}
              ${mode === 'play' && !isMarked && !isCenter ? 'cursor-pointer active:scale-95' : 'cursor-default'}
              shadow-lg relative overflow-hidden
            `}
          >
            <span className={`${isCenter ? 'text-[10px] sm:text-xs' : 'text-[10px] sm:text-xs md:text-sm'} leading-tight break-words line-clamp-4 ${isMarked ? 'opacity-100' : 'opacity-80'}`}>
              {content}
            </span>
            {isMarked && (
              <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BingoGrid;
