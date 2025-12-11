import React, { useState, useEffect } from 'react';
import { BingoCard, ThemeColor } from '../types';
import { THEMES, CENTER_INDEX } from '../constants';
import BingoGrid from './BingoGrid';
import { generateBingoItems } from '../services/geminiService';
import { Wand2, Save, ArrowLeft, Loader2, RotateCcw } from 'lucide-react';

interface EditorProps {
  initialCard?: BingoCard | null;
  onSave: (card: BingoCard) => void;
  onCancel: () => void;
}

const Editor: React.FC<EditorProps> = ({ initialCard, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialCard?.title || '');
  const [description, setDescription] = useState(initialCard?.description || '');
  const [theme, setTheme] = useState<ThemeColor>(initialCard?.theme || 'neon-pink');
  
  // 24 items, center is skipped in data array but handled in grid
  const [items, setItems] = useState<string[]>(
    initialCard?.items || Array(24).fill('')
  );
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptTopic, setPromptTopic] = useState('');

  const handleCellChange = (dataIndex: number, value: string) => {
    const newItems = [...items];
    newItems[dataIndex] = value;
    setItems(newItems);
  };

  const handleGenerate = async () => {
    if (!promptTopic.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateBingoItems(promptTopic);
      setItems(generated);
    } catch (e) {
      alert("Failed to generate items. Ensure API Key is set.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    
    const newCard: BingoCard = {
      id: initialCard?.id || crypto.randomUUID(),
      title,
      description,
      items,
      theme,
      createdAt: initialCard?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(newCard);
  };

  const currentTheme = THEMES[theme];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-2xl font-bold">
            {initialCard ? 'Edit Bingo Card' : 'Create New Card'}
        </h1>
        <button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg shadow-green-900/20 transition-all hover:scale-105"
        >
          <Save size={18} /> Save Card
        </button>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        {/* Sidebar Controls */}
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl border border-white/5 h-fit">
            
            {/* Meta Info */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Game Awards 2025"
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Description (Optional)</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A short description..."
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none text-sm"
                    />
                </div>
            </div>

            <hr className="border-white/10" />

            {/* AI Generator */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-medium">
                    <Wand2 size={16} />
                    <span>AI Auto-Fill</span>
                </div>
                <p className="text-xs text-slate-400">Enter a topic and let AI generate 24 bingo squares for you.</p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={promptTopic}
                        onChange={(e) => setPromptTopic(e.target.value)}
                        placeholder="e.g. Elden Ring DLC"
                        className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !promptTopic}
                        className="bg-purple-600 disabled:opacity-50 hover:bg-purple-500 text-white p-2 rounded-lg transition-colors flex items-center justify-center min-w-[44px]"
                    >
                        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                    </button>
                </div>
            </div>

             <hr className="border-white/10" />

            {/* Theme Selector */}
            <div>
                <label className="block text-xs font-medium text-slate-400 mb-3">Color Theme</label>
                <div className="grid grid-cols-5 gap-2">
                    {(Object.keys(THEMES) as ThemeColor[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${theme === t ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            style={{ 
                                background: t === 'neon-pink' ? '#db2777' : 
                                           t === 'cyber-blue' ? '#0891b2' :
                                           t === 'toxic-green' ? '#65a30d' :
                                           t === 'sunset-orange' ? '#ea580c' : '#9333ea' 
                            }}
                            title={THEMES[t].name}
                        />
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">{THEMES[theme].name}</p>
            </div>
            
             <hr className="border-white/10" />

            {/* Manual Reset */}
             <button 
                onClick={() => setItems(Array(24).fill(''))}
                className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2"
             >
                <RotateCcw size={14} /> Clear Grid
             </button>

        </div>

        {/* Grid Preview/Edit */}
        <div className="flex flex-col items-center">
            <h2 className={`text-2xl font-bold mb-4 ${currentTheme.primary}`}>Preview</h2>
            <BingoGrid 
                items={items}
                mode="edit"
                onCellChange={handleCellChange}
                themeClass={theme}
                tileBgClass={currentTheme.tileBg}
                tileMarkedClass={currentTheme.tileMarked}
            />
        </div>

      </div>
    </div>
  );
};

export default Editor;
