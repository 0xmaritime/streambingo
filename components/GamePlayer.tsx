import React, { useState, useEffect, useRef } from 'react';
import { BingoCard, GameProgress } from '../types';
import { THEMES, WINNING_COMBINATIONS, CENTER_INDEX } from '../constants';
import { getGameProgress, saveGameProgress, clearGameProgress } from '../services/storageService';
import BingoGrid from './BingoGrid';
import { Trophy, RotateCcw, ArrowLeft, Share2 } from 'lucide-react';

interface GamePlayerProps {
  card: BingoCard;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ card, onBack }) => {
  const [markedIndices, setMarkedIndices] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  
  const currentTheme = THEMES[card.theme];

  // Load progress on mount
  useEffect(() => {
    const progress = getGameProgress(card.id);
    if (progress) {
      setMarkedIndices(progress.markedIndices);
      setIsWon(progress.isWon);
    }
  }, [card.id]);

  // Check win condition
  const checkWin = (currentMarks: number[]) => {
    // Include center in checks (index 12)
    const allMarks = new Set([...currentMarks, CENTER_INDEX]);
    
    for (const combo of WINNING_COMBINATIONS) {
      if (combo.every(index => allMarks.has(index))) {
        return true;
      }
    }
    return false;
  };

  const handleCellClick = (index: number) => {
    let newMarks: number[];
    if (markedIndices.includes(index)) {
      newMarks = markedIndices.filter(i => i !== index);
    } else {
      newMarks = [...markedIndices, index];
    }
    
    setMarkedIndices(newMarks);
    
    const hasWon = checkWin(newMarks);
    
    // If newly won
    if (hasWon && !isWon) {
        setIsWon(true);
        setShowWinAnimation(true);
        setTimeout(() => setShowWinAnimation(false), 5000); // Hide confetti after 5s
    } else if (!hasWon) {
        setIsWon(false);
    }

    // Save
    saveGameProgress({
        cardId: card.id,
        markedIndices: newMarks,
        isWon: hasWon,
        lastPlayed: Date.now()
    });
  };

  const handleReset = () => {
    if (confirm("Clear this card's progress?")) {
        setMarkedIndices([]);
        setIsWon(false);
        clearGameProgress(card.id);
    }
  };

  return (
    <div className="relative pb-20 animate-in fade-in duration-500">
      
      {/* Confetti Overlay (CSS based simple particles could be here, or just a celebration modal) */}
      {showWinAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-bounce drop-shadow-2xl z-10">
                BINGO!
            </h1>
            {/* Simple confetti dots */}
            {Array.from({length: 50}).map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-3 h-3 rounded-full animate-ping"
                    style={{
                        backgroundColor: ['#f00', '#0f0', '#00f', '#ff0', '#0ff'][i % 5],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${1 + Math.random()}s`,
                        animationDelay: `${Math.random()}s`
                    }}
                />
            ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors self-start md:self-auto">
          <ArrowLeft size={20} /> Exit
        </button>
        
        <div className="text-center">
            <h1 className={`text-3xl font-bold ${currentTheme.primary} mb-1`}>{card.title}</h1>
            {card.description && <p className="text-slate-400 text-sm">{card.description}</p>}
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors self-end md:self-auto text-sm"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* Stats / Win Status */}
      <div className="flex justify-center mb-6">
        <div className={`
            px-6 py-2 rounded-full border border-white/10 bg-slate-800/50 backdrop-blur 
            flex items-center gap-3 transition-all duration-500
            ${isWon ? 'shadow-[0_0_30px_rgba(234,179,8,0.3)] border-yellow-500/50' : ''}
        `}>
            <Trophy size={20} className={isWon ? 'text-yellow-400 animate-bounce' : 'text-slate-600'} />
            <span className={`font-semibold ${isWon ? 'text-yellow-400' : 'text-slate-400'}`}>
                {isWon ? 'BINGO ACHIEVED!' : 'Keep Watching...'}
            </span>
        </div>
      </div>

      {/* The Board */}
      <BingoGrid 
        items={card.items}
        markedIndices={markedIndices}
        mode="play"
        onCellClick={handleCellClick}
        themeClass={card.theme}
        tileBgClass={currentTheme.tileBg}
        tileMarkedClass={currentTheme.tileMarked}
      />

    </div>
  );
};

export default GamePlayer;
