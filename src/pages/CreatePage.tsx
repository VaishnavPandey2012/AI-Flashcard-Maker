import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Save, Trash2, RefreshCw, BookOpen } from 'lucide-react';
import { InputPanel } from '../components/input/InputPanel';
import { FlashCardDeck } from '../components/flashcard/FlashCardDeck';
import { Button } from '../components/ui/Button';
import type { Deck, Flashcard, InputMethod } from '../types/flashcard';
import { generateFromText, generateFromTopic, generateFromURL } from '../utils/aiGenerator';
import { exportDeckAsPDF } from '../utils/pdfExport';

interface CreatePageProps {
  decks: Deck[];
  onSaveDeck: (deck: Deck) => void;
  onStudy: (deck: Deck) => void;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export const CreatePage: React.FC<CreatePageProps> = ({ decks, onSaveDeck, onStudy }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deckTitle, setDeckTitle] = useState('');
  const [savedDeckId, setSavedDeckId] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<{ method: InputMethod; value: string } | null>(null);

  const handleGenerate = async (method: InputMethod, value: string) => {
    setIsGenerating(true);
    setLastInput({ method, value });

    // Simulate async AI generation
    await new Promise(r => setTimeout(r, 1200));

    let generated: Flashcard[] = [];
    switch (method) {
      case 'text': generated = generateFromText(value); break;
      case 'topic': generated = generateFromTopic(value); break;
      case 'file': generated = generateFromText(value); break;
      case 'url': generated = generateFromURL(value); break;
    }

    setCards(generated);
    if (!deckTitle) {
      const autoTitle = method === 'topic'
        ? value
        : method === 'url'
        ? new URL(value.startsWith('http') ? value : 'https://' + value).hostname.replace('www.', '')
        : `My Deck ${decks.length + 1}`;
      setDeckTitle(autoTitle);
    }
    setSavedDeckId(null);
    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    if (lastInput) handleGenerate(lastInput.method, lastInput.value);
  };

  const handleSave = () => {
    if (!cards.length) return;
    const deck: Deck = {
      id: savedDeckId || generateId(),
      title: deckTitle || `My Deck ${decks.length + 1}`,
      description: `${cards.length} flashcards`,
      cards,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      totalStudySessions: 0,
    };
    onSaveDeck(deck);
    setSavedDeckId(deck.id);
  };

  const handleExport = () => {
    if (!cards.length) return;
    const deck: Deck = {
      id: 'export',
      title: deckTitle || 'Flashcard Deck',
      description: `${cards.length} cards`,
      cards,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      totalStudySessions: 0,
    };
    exportDeckAsPDF(deck);
  };

  const handleStudy = () => {
    if (!cards.length) return;
    const deck: Deck = {
      id: savedDeckId || generateId(),
      title: deckTitle || 'My Deck',
      description: '',
      cards,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      totalStudySessions: 0,
    };
    onStudy(deck);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl font-black text-white mb-1">Create Flashcards</h1>
            <p className="text-white/50 text-sm">Choose an input method and generate AI-powered flashcards</p>
          </motion.div>
          <InputPanel onGenerate={handleGenerate} isGenerating={isGenerating} />

          {/* Saved decks */}
          {decks.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-violet-400" /> Saved Decks
              </h3>
              <div className="space-y-2">
                {decks.slice(-4).map(deck => (
                  <button
                    key={deck.id}
                    onClick={() => { setCards(deck.cards); setDeckTitle(deck.title); setSavedDeckId(deck.id); }}
                    className="w-full text-left px-3 py-2 glass rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm text-white/80 truncate">{deck.title}</span>
                    <span className="text-xs text-white/40 ml-2 flex-shrink-0">{deck.cards.length} cards</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Cards Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {cards.length === 0 && !isGenerating ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="text-7xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-white mb-2">No cards yet</h3>
                <p className="text-white/40 text-sm max-w-xs">Enter a topic, paste text, or upload a file to generate your first set of flashcards</p>
              </motion.div>
            ) : isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Generating Flashcards...</h3>
                <p className="text-white/40 text-sm">AI is analyzing your content</p>
                <div className="flex gap-1.5 mt-4">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-violet-500"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Deck header */}
                <div className="flex items-center gap-3 mb-5">
                  <input
                    value={deckTitle}
                    onChange={e => setDeckTitle(e.target.value)}
                    className="flex-1 text-xl font-bold bg-transparent text-white border-b border-white/20 focus:border-violet-500 focus:outline-none pb-1 transition-colors"
                    placeholder="Deck title..."
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={handleRegenerate}>
                      <span className="hidden sm:inline">Regen</span>
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => setCards([])}>
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                    <Button
                      variant={savedDeckId ? 'success' : 'primary'}
                      size="sm"
                      icon={<Save size={14} />}
                      onClick={handleSave}
                    >
                      {savedDeckId ? 'Saved!' : 'Save'}
                    </Button>
                  </div>
                </div>

                <FlashCardDeck
                  cards={cards}
                  onUpdate={setCards}
                  onStudy={handleStudy}
                  onExport={handleExport}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
