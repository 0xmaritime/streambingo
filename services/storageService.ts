import { BingoCard, GameProgress } from '../types';

const CARDS_KEY = 'bingo_maker_cards';
const PROGRESS_KEY = 'bingo_maker_progress';
const INIT_KEY = 'bingo_maker_initialized';

const TGA_CARD: BingoCard = {
  id: 'tga-2025-official',
  title: 'The Game Awards 2025',
  description: 'Official Bingo for the biggest night in gaming.',
  theme: 'royal-purple',
  createdAt: 1735689600000, // Jan 1 2025
  updatedAt: 1735689600000,
  items: [
    "Появление Хидео Кодзимы", "Тизер \"World Premiere\"", "Джефф разогревает \"one more thing\"", "Звезда ошибётся в названии игры",
    "Трейлер/упоминание GTA 6", "Оркестр играет медляк", "Expedition 33 выиграет награду", "\"Уже доступно!\" — внезапный релиз", "Сюрприз от Nintendo",
    "Неловкий момент с со-ведущим", "Анонс кроссовера с Fortnite", "Упоминание сокращений в геймдеве", "Контент про Death Stranding 2", "Тизер DLC для Elden Ring",
    "Случайное появление звезды", "Упоминание \"глобальной аудитории\"", "Показ игры от Insomniac", "Разработчик расплачется", "Проблемы со звуком",
    "Речь о \"будущем игр\"", "Обсуждение ИИ в играх", "Мем/упоминание Луиджи", "Реакция зрителей в зале", "Музыкальное выступление"
  ]
};

export const getSavedCards = (): BingoCard[] => {
  try {
    const data = localStorage.getItem(CARDS_KEY);
    const initialized = localStorage.getItem(INIT_KEY);

    if (!data && !initialized) {
        // First time load, inject TGA card
        const initialCards = [TGA_CARD];
        localStorage.setItem(CARDS_KEY, JSON.stringify(initialCards));
        localStorage.setItem(INIT_KEY, 'true');
        return initialCards;
    }

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load cards", error);
    return [];
  }
};

export const saveCard = (card: BingoCard): void => {
  const cards = getSavedCards();
  const existingIndex = cards.findIndex(c => c.id === card.id);
  
  if (existingIndex >= 0) {
    cards[existingIndex] = card;
  } else {
    cards.push(card);
  }
  
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
};

export const deleteCard = (cardId: string): void => {
  const cards = getSavedCards();
  const newCards = cards.filter(c => c.id !== cardId);
  localStorage.setItem(CARDS_KEY, JSON.stringify(newCards));
  // Also clear progress for this card
  clearGameProgress(cardId);
};

export const getGameProgress = (cardId: string): GameProgress | null => {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    const allProgress: Record<string, GameProgress> = data ? JSON.parse(data) : {};
    return allProgress[cardId] || null;
  } catch (error) {
    console.error("Failed to load progress", error);
    return null;
  }
};

export const saveGameProgress = (progress: GameProgress): void => {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    const allProgress: Record<string, GameProgress> = data ? JSON.parse(data) : {};
    allProgress[progress.cardId] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Failed to save progress", error);
  }
};

export const clearGameProgress = (cardId: string): void => {
    try {
        const data = localStorage.getItem(PROGRESS_KEY);
        if(!data) return;
        const allProgress: Record<string, GameProgress> = JSON.parse(data);
        if (allProgress[cardId]) {
            delete allProgress[cardId];
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
        }
    } catch(error) {
        console.error("Failed to clear progress", error);
    }
}
