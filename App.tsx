import React, { useState, useEffect } from 'react';
import { BingoCard, ThemeColor } from './types';
import { getSavedCards, saveCard, deleteCard } from './services/storageService';
import Editor from './components/Editor';
import GamePlayer from './components/GamePlayer';
import { THEMES } from './constants';
import { Plus, Play, Edit, Trash2, LayoutGrid, Gamepad2, Dice5 } from 'lucide-react';

type Screen = 'home' | 'editor' | 'play';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [cards, setCards] = useState<BingoCard[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    // Load cards on mount and when returning to home
    if (screen === 'home') {
      setCards(getSavedCards().sort((a, b) => b.updatedAt - a.updatedAt));
    }
  }, [screen]);

  const handleCreateNew = () => {
    setActiveCardId(null);
    setScreen('editor');
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveCardId(id);
    setScreen('editor');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm("Are you sure you want to delete this card? This cannot be undone.")) {
      // Optimistic update for immediate UI feedback
      setCards(prevCards => prevCards.filter(c => c.id !== id));
      deleteCard(id);
    }
  };

  const handlePlay = (id: string) => {
    setActiveCardId(id);
    setScreen('play');
  };

  const handleSaveCard = (card: BingoCard) => {
    saveCard(card);
    setScreen('home');
  };

  // Determine global background based on active card (if playing) or default
  const activeCard = cards.find(c => c.id === activeCardId);
  const bgClass = activeCard && screen !== 'home' 
    ? THEMES[activeCard.theme].bgGradient 
    : 'from-slate-900 via-indigo-950 to-slate-900';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgClass} transition-colors duration-1000 text-white`}>
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* App Title (Only on Home) */}
        {screen === 'home' && (
          <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center p-3 mb-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
                <Dice5 size={40} className="text-indigo-400 mr-3" />
                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    StreamBingo
                </h1>
            </div>
            <p className="text-slate-400 max-w-md mx-auto">
              Design interactive bingo cards for your favorite streaming events, game awards, or watch parties.
            </p>
          </header>
        )}

        {/* Home Screen */}
        {screen === 'home' && (
          <main className="flex-1 max-w-5xl mx-auto w-full animate-in fade-in duration-500 delay-150">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutGrid size={20} className="text-indigo-400"/> Your Library
              </h2>
              <button 
                onClick={handleCreateNew}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-indigo-900/40 hover:shadow-indigo-900/60 transition-all hover:scale-105 flex items-center gap-2 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Card
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <Gamepad2 size={48} className="mx-auto text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No cards yet</h3>
                <p className="text-slate-500 mb-6">Create your first bingo card to get started!</p>
                <button onClick={handleCreateNew} className="text-indigo-400 hover:text-indigo-300 font-medium">Create Now &rarr;</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map(card => {
                  const theme = THEMES[card.theme];
                  return (
                    <div 
                      key={card.id}
                      onClick={() => handlePlay(card.id)}
                      className="group bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                    >
                       <div className={`absolute top-0 left-0 w-1 h-full ${theme.tileMarked.split(' ')[0]}`} />
                       
                       <div className="flex justify-between items-start mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.tileBg} ${theme.primary} text-lg font-bold border border-white/5`}>
                             B
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                             <button 
                                onClick={(e) => handleEdit(card.id, e)}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Edit"
                             >
                                <Edit size={16} />
                             </button>
                             <button 
                                onClick={(e) => handleDelete(card.id, e)}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                title="Delete"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </div>

                       <h3 className="text-xl font-bold mb-1 truncate pr-4">{card.title}</h3>
                       <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                         {card.description || "No description"}
                       </p>
                       
                       <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <span className="text-xs text-slate-500">
                             {new Date(card.updatedAt).toLocaleDateString()}
                          </span>
                          <span className={`text-sm font-medium flex items-center gap-1 ${theme.secondary}`}>
                             Play Now <Play size={14} />
                          </span>
                       </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}

        {/* Editor Screen */}
        {screen === 'editor' && (
          <Editor 
            initialCard={activeCardId ? cards.find(c => c.id === activeCardId) : null}
            onSave={handleSaveCard}
            onCancel={() => setScreen('home')}
          />
        )}

        {/* Play Screen */}
        {screen === 'play' && activeCard && (
          <GamePlayer 
            card={activeCard}
            onBack={() => setScreen('home')}
          />
        )}

      </div>
    </div>
  );
}

export default App;