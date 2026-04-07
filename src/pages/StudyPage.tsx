import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Trash2, Download, Plus } from 'lucide-react';
import type { Deck } from '../types/flashcard';
import { QuizMode } from '../components/flashcard/QuizMode';
import { FlashCardDeck } from '../components/flashcard/FlashCardDeck';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { exportDeckAsPDF } from '../utils/pdfExport';
import type { StudySession } from '../types/flashcard';

interface StudyPageProps {
  decks: Deck[];
  activeDeck: Deck | null;
  onUpdateDeck: (deck: Deck) => void;
  onDeleteDeck: (id: string) => void;
  onStudyComplete: (session: StudySession) => void;
  onNavigateCreate: () => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export const StudyPage: React.FC<StudyPageProps> = ({
  decks,
  activeDeck,
  onUpdateDeck,
  onDeleteDeck,
  onStudyComplete,
  onNavigateCreate,
}) => {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(activeDeck);
  const [inQuiz, setInQuiz] = useState(false);

  const handleQuizComplete = (known: number, total: number) => {
    if (!selectedDeck) return;
    const session: StudySession = {
      id: generateId(),
      deckId: selectedDeck.id,
      date: Date.now(),
      cardsStudied: total,
      cardsKnown: known,
      duration: 0,
    };
    onStudyComplete(session);
  };

  if (inQuiz && selectedDeck) {
    return (
      <QuizMode
        cards={selectedDeck.cards}
        onClose={() => setInQuiz(false)}
        onComplete={handleQuizComplete}
        onUpdate={(cards) => onUpdateDeck({ ...selectedDeck, cards })}
      />
    );
  }

  if (decks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-white mb-3">No Decks Yet</h2>
        <p className="text-white/50 mb-6">Create your first flashcard deck to start studying</p>
        <Button variant="primary" size="lg" icon={<Plus size={18} />} onClick={onNavigateCreate}>
          Create Your First Deck
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Study</h1>
        <p className="text-white/50 text-sm">Select a deck and start studying</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Deck list */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider px-1">Your Decks</h2>
          {decks.map((deck, i) => {
            const knownCount = deck.cards.filter(c => c.isKnown).length;
            const pct = deck.cards.length > 0 ? (knownCount / deck.cards.length) * 100 : 0;
            return (
              <motion.button
                key={deck.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDeck(deck)}
                className={`w-full text-left glass-card p-4 transition-colors ${
                  selectedDeck?.id === deck.id ? 'border border-violet-500/50 bg-violet-500/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-white text-sm truncate flex-1">{deck.title}</p>
                  <span className="text-xs text-white/40 ml-2 flex-shrink-0">{deck.cards.length}</span>
                </div>
                <ProgressBar value={knownCount} max={deck.cards.length} color="emerald" height="h-1" />
                <p className="text-xs text-white/30 mt-1">{Math.round(pct)}% mastered</p>
              </motion.button>
            );
          })}

          <button
            onClick={onNavigateCreate}
            className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Plus size={16} /> New Deck
          </button>
        </div>

        {/* Deck content */}
        <div className="lg:col-span-3">
          {selectedDeck ? (
            <div className="space-y-5">
              <div className="glass-card">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedDeck.title}</h2>
                    <p className="text-white/40 text-sm">{selectedDeck.cards.length} cards · {selectedDeck.cards.filter(c => c.isKnown).length} mastered</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download size={14} />}
                      onClick={() => exportDeckAsPDF(selectedDeck)}
                    >
                      Export
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      onClick={() => { onDeleteDeck(selectedDeck.id); setSelectedDeck(null); }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Play size={14} />}
                      onClick={() => setInQuiz(true)}
                    >
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </div>

              <FlashCardDeck
                cards={selectedDeck.cards}
                onUpdate={(cards) => onUpdateDeck({ ...selectedDeck, cards })}
                onStudy={() => setInQuiz(true)}
                onExport={() => exportDeckAsPDF(selectedDeck)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen size={48} className="text-white/20 mb-4" />
              <p className="text-white/40">Select a deck to start studying</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
