import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Filter, Download, Play } from 'lucide-react';
import type { Flashcard, Difficulty, CardType } from '../../types/flashcard';
import { FlashCard } from './FlashCard';
import { CardEditor } from './CardEditor';
import { SearchBar } from '../ui/SearchBar';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface FlashCardDeckProps {
  cards: Flashcard[];
  onUpdate: (cards: Flashcard[]) => void;
  onStudy: () => void;
  onExport: () => void;
}

export const FlashCardDeck: React.FC<FlashCardDeckProps> = ({ cards, onUpdate, onStudy, onExport }) => {
  const [search, setSearch] = useState('');
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');
  const [filterType, setFilterType] = useState<CardType | 'all'>('all');

  const knownCount = cards.filter(c => c.isKnown).length;

  const filtered = cards.filter(c => {
    const matchSearch = !search ||
      c.question.toLowerCase().includes(search.toLowerCase()) ||
      c.answer.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.includes(search.toLowerCase()));
    const matchDiff = filterDifficulty === 'all' || c.difficulty === filterDifficulty;
    const matchType = filterType === 'all' || c.type === filterType;
    return matchSearch && matchDiff && matchType;
  });

  const handleKnown = (id: string) => {
    onUpdate(cards.map(c => c.id === id ? { ...c, isKnown: true } : c));
  };
  const handleUnknown = (id: string) => {
    onUpdate(cards.map(c => c.id === id ? { ...c, isKnown: false } : c));
  };
  const handleStar = (id: string) => {
    onUpdate(cards.map(c => c.id === id ? { ...c, isStarred: !c.isStarred } : c));
  };
  const handleShuffle = () => {
    onUpdate([...cards].sort(() => Math.random() - 0.5));
  };
  const handleSaveEdit = (updated: Flashcard) => {
    onUpdate(cards.map(c => c.id === updated.id ? updated : c));
    setEditingCard(null);
  };

  const difficulties: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];
  const types: (CardType | 'all')[] = ['all', 'qa', 'mcq', 'revision', 'summary'];

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/70">Progress</span>
          <span className="text-sm font-bold text-white">{knownCount}/{cards.length} known</span>
        </div>
        <ProgressBar value={knownCount} max={cards.length} color="emerald" showLabel />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<Shuffle size={14} />} onClick={handleShuffle}>
            Shuffle
          </Button>
          <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={onExport}>
            Export
          </Button>
          <Button variant="primary" size="sm" icon={<Play size={14} />} onClick={onStudy}>
            Study
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-1">
          <Filter size={14} className="text-white/40 self-center" />
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterDifficulty === d ? 'bg-violet-600 text-white' : 'glass text-white/50 hover:text-white/80'
              }`}
            >
              {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === t ? 'bg-indigo-600 text-white' : 'glass text-white/50 hover:text-white/80'
              }`}
            >
              {t === 'all' ? 'All Types' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/40"
          >
            <p>No cards match your filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((card, i) => (
              <FlashCard
                key={card.id}
                card={card}
                index={i}
                onKnown={handleKnown}
                onUnknown={handleUnknown}
                onStar={handleStar}
                onEdit={setEditingCard}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editingCard && (
        <CardEditor
          card={editingCard}
          onSave={handleSaveEdit}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
};
