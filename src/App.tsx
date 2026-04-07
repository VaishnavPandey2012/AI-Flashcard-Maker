import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { StudyPage } from './pages/StudyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import type { Deck, StudyStats, StudySession } from './types/flashcard';
import { saveDecks, loadDecks, saveStats, loadStats, saveDarkMode, loadDarkMode, addStudySession } from './utils/storage';

type Page = 'home' | 'create' | 'study' | 'analytics';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [stats, setStats] = useState<StudyStats>(() => loadStats());
  const [darkMode, setDarkMode] = useState<boolean>(() => loadDarkMode());
  const [pendingStudyDeck, setPendingStudyDeck] = useState<Deck | null>(null);

  // Load persisted decks on mount
  useEffect(() => {
    setDecks(loadDecks());
  }, []);

  // Apply dark/light mode to root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    saveDarkMode(darkMode);
  }, [darkMode]);

  const handleSaveDeck = (deck: Deck) => {
    const updated = decks.some(d => d.id === deck.id)
      ? decks.map(d => d.id === deck.id ? deck : d)
      : [...decks, deck];
    setDecks(updated);
    saveDecks(updated);
  };

  const handleDeleteDeck = (id: string) => {
    const updated = decks.filter(d => d.id !== id);
    setDecks(updated);
    saveDecks(updated);
  };

  const handleUpdateDeck = (deck: Deck) => {
    handleSaveDeck(deck);
  };

  const handleStudyComplete = (session: StudySession) => {
    addStudySession(session);
    const newStats = loadStats();

    // Update global known/unknown counts
    const allCards = decks.flatMap(d => d.cards);
    newStats.totalCards = allCards.length;
    newStats.knownCards = allCards.filter(c => c.isKnown).length;
    newStats.unknownCards = allCards.filter(c => !c.isKnown).length;
    newStats.starredCards = allCards.filter(c => c.isStarred).length;

    setStats(newStats);
    saveStats(newStats);
  };

  const handleStudyDeck = (deck: Deck) => {
    handleSaveDeck(deck);
    setPendingStudyDeck(deck);
    setPage('study');
  };

  const handleNavigate = (p: Page) => {
    setPage(p);
    if (p !== 'study') setPendingStudyDeck(null);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'app-dark' : 'app-light'}`}>
      <Header
        currentPage={page}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(d => !d)}
      />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {page === 'home' && (
              <HomePage onGetStarted={() => setPage('create')} />
            )}
            {page === 'create' && (
              <CreatePage
                decks={decks}
                onSaveDeck={handleSaveDeck}
                onStudy={handleStudyDeck}
              />
            )}
            {page === 'study' && (
              <StudyPage
                decks={decks}
                activeDeck={pendingStudyDeck}
                onUpdateDeck={handleUpdateDeck}
                onDeleteDeck={handleDeleteDeck}
                onStudyComplete={handleStudyComplete}
                onNavigateCreate={() => setPage('create')}
              />
            )}
            {page === 'analytics' && (
              <AnalyticsPage decks={decks} stats={stats} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {page !== 'study' && <Footer />}
    </div>
  );
}

export default App;
