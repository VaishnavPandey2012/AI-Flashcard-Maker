import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, RotateCcw, Check, Keyboard } from 'lucide-react';
import type { Flashcard } from '../../types/flashcard';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { launchConfetti } from '../../utils/confetti';

interface QuizModeProps {
  cards: Flashcard[];
  onClose: () => void;
  onComplete: (known: number, total: number) => void;
  onUpdate: (cards: Flashcard[]) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ cards, onClose, onComplete, onUpdate }) => {
  const [current, setCurrent] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [unknownIds, setUnknownIds] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const card = cards[current];
  const progress = ((current + (isFlipped ? 0.5 : 0)) / cards.length) * 100;

  const handleNext = useCallback(() => {
    if (current < cards.length - 1) {
      setCurrent(c => c + 1);
      setIsFlipped(false);
      setSelectedOption(null);
    } else {
      setCompleted(true);
      launchConfetti();
      onComplete(knownIds.size, cards.length);
    }
  }, [current, cards.length, knownIds.size, onComplete]);

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
      setIsFlipped(false);
      setSelectedOption(null);
    }
  };

  const handleKnown = () => {
    const newKnown = new Set(knownIds);
    newKnown.add(card.id);
    setKnownIds(newKnown);
    onUpdate(cards.map(c => c.id === card.id ? { ...c, isKnown: true } : c));
    handleNext();
  };

  const handleUnknown = () => {
    const newUnknown = new Set(unknownIds);
    newUnknown.add(card.id);
    setUnknownIds(newUnknown);
    handleNext();
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setTimeout(() => setIsFlipped(true), 300);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (completed) return;
      switch (e.key) {
        case ' ': e.preventDefault(); if (card.type !== 'mcq') setIsFlipped(f => !f); break;
        case 'ArrowRight': handleNext(); break;
        case 'ArrowLeft': handlePrev(); break;
        case 'k': if (isFlipped) handleKnown(); break;
        case 'u': if (isFlipped) handleUnknown(); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [card, isFlipped, completed, handleNext]);

  if (completed) {
    const score = Math.round((knownIds.size / cards.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-app"
        style={{ background: 'linear-gradient(135deg, #0F0A1E 0%, #1A0F3C 100%)' }}
      >
        <div className="text-center space-y-6 p-8 max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.2 }}
            className="text-8xl"
          >
            {score >= 80 ? '🏆' : score >= 60 ? '🎯' : '📚'}
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Session Complete!</h2>
            <p className="text-white/60">You've studied all {cards.length} cards</p>
          </div>
          <div className="glass-card p-6 space-y-4">
            <div className="text-5xl font-black gradient-text">{score}%</div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{knownIds.size}</div>
                <div className="text-xs text-white/50">Known</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{unknownIds.size}</div>
                <div className="text-xs text-white/50">Learning</div>
              </div>
            </div>
            <ProgressBar value={knownIds.size} max={cards.length} color="emerald" showLabel />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setCurrent(0); setIsFlipped(false); setCompleted(false); setKnownIds(new Set()); setUnknownIds(new Set()); }}
              className="flex-1 py-3 rounded-xl glass border border-white/15 text-white/80 font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Restart
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0F0A1E 0%, #1A0F3C 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <span className="text-white/60 text-sm font-medium">{current + 1} / {cards.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHints(h => !h)}
            className="p-2 rounded-xl hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
          >
            <Keyboard size={16} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 pb-4">
        <ProgressBar value={progress} max={100} color="violet" />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-emerald-400">{knownIds.size} known</span>
          <span className="text-xs text-red-400">{unknownIds.size} learning</span>
        </div>
      </div>

      {/* Keyboard hints */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-6 mb-3 glass-card p-3 text-xs text-white/50 grid grid-cols-2 gap-1"
          >
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">Space</kbd> Flip card</span>
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">←/→</kbd> Navigate</span>
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">K</kbd> Mark known</span>
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">U</kbd> Mark unknown</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div className="w-full max-w-2xl" style={{ perspective: '1200px' }}>
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring', damping: 20 }}
            style={{ transformStyle: 'preserve-3d', minHeight: '360px' }}
            className="relative w-full"
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-3xl p-8 flex flex-col cursor-pointer"
              style={{ backfaceVisibility: 'hidden' }}
              onClick={() => card.type !== 'mcq' && setIsFlipped(true)}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-white/10" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex gap-2 mb-4">
                  <Badge variant={card.difficulty}>{card.difficulty}</Badge>
                  <Badge variant={card.type}>{card.type === 'mcq' ? 'Multiple Choice' : card.type}</Badge>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Question</p>
                  <p className="text-white text-xl font-medium leading-relaxed">{card.question}</p>
                </div>
                {card.type === 'mcq' && card.options && (
                  <div className="space-y-2 mt-4">
                    {card.options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                          selectedOption === opt.id
                            ? opt.isCorrect
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-red-500/20 border-red-500/40 text-red-300'
                            : 'glass border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                )}
                {card.type !== 'mcq' && (
                  <p className="text-center text-xs text-white/25 mt-4">Press Space or tap to flip</p>
                )}
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-3xl p-8 flex flex-col"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', minHeight: '360px' }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600/15 to-purple-600/15 border border-violet-500/20" />
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-xs font-semibold text-violet-400/70 uppercase tracking-widest mb-4">Answer</p>
                <div className="flex-1 flex items-center">
                  <p className="text-white/90 text-lg leading-relaxed">{card.answer}</p>
                </div>
                {card.type === 'mcq' && card.options && (
                  <p className="text-emerald-400 text-sm font-semibold mt-3">
                    ✓ {card.options.find(o => o.isCorrect)?.text}
                  </p>
                )}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUnknown}
                    className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Still Learning
                  </button>
                  <button
                    onClick={handleKnown}
                    className="flex-1 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Got It!
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nav buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="p-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => { setIsFlipped(false); setSelectedOption(null); }}
              className="p-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-xl glass border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
