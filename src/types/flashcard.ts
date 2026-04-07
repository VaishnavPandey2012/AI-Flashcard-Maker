export type CardType = 'qa' | 'mcq' | 'revision' | 'summary';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type InputMethod = 'text' | 'file' | 'topic' | 'url';

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Flashcard {
  id: string;
  type: CardType;
  question: string;
  answer: string;
  options?: MCQOption[];
  difficulty: Difficulty;
  tags: string[];
  isKnown: boolean;
  isStarred: boolean;
  createdAt: number;
  lastStudied?: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
  updatedAt: number;
  totalStudySessions: number;
}

export interface StudySession {
  id: string;
  deckId: string;
  date: number;
  cardsStudied: number;
  cardsKnown: number;
  duration: number;
}

export interface StudyStats {
  totalCards: number;
  knownCards: number;
  unknownCards: number;
  starredCards: number;
  streak: number;
  lastStudied?: number;
  sessions: StudySession[];
}

export interface AppState {
  decks: Deck[];
  currentDeck: Deck | null;
  stats: StudyStats;
  darkMode: boolean;
}
