import type { Deck, StudyStats, StudySession } from '../types/flashcard';

const DECKS_KEY = 'ai_flashcard_decks';
const STATS_KEY = 'ai_flashcard_stats';
const DARK_MODE_KEY = 'ai_flashcard_dark_mode';

export function saveDecks(decks: Deck[]): void {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export function loadDecks(): Deck[] {
  try {
    const data = localStorage.getItem(DECKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStats(stats: StudyStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadStats(): StudyStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return {
    totalCards: 0,
    knownCards: 0,
    unknownCards: 0,
    starredCards: 0,
    streak: 0,
    sessions: [],
  };
}

export function saveDarkMode(value: boolean): void {
  localStorage.setItem(DARK_MODE_KEY, JSON.stringify(value));
}

export function loadDarkMode(): boolean {
  try {
    const data = localStorage.getItem(DARK_MODE_KEY);
    if (data !== null) return JSON.parse(data);
  } catch {
    // ignore
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function addStudySession(session: StudySession): void {
  const stats = loadStats();
  stats.sessions.push(session);

  // Update streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastStudied = stats.lastStudied ? new Date(stats.lastStudied).setHours(0, 0, 0, 0) : null;
  if (lastStudied === today) {
    // Already studied today, no streak change
  } else if (lastStudied === today - 86400000) {
    stats.streak += 1;
  } else {
    stats.streak = 1;
  }
  stats.lastStudied = Date.now();
  saveStats(stats);
}
