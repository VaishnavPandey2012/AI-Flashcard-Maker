import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X, Edit2, RotateCcw } from 'lucide-react';
import type { Flashcard } from '../../types/flashcard';
import { Badge } from '../ui/Badge';

interface FlashCardProps {
  card: Flashcard;
  onKnown: (id: string) => void;
  onUnknown: (id: string) => void;
  onStar: (id: string) => void;
  onEdit: (card: Flashcard) => void;
  index?: number;
}

const difficultyGlow = {
  easy: 'hover:shadow-emerald-500/20',
  medium: 'hover:shadow-amber-500/20',
  hard: 'hover:shadow-red-500/20',
};

const difficultyBorder = {
  easy: 'from-emerald-500/30 to-teal-500/30',
  medium: 'from-amber-500/30 to-orange-500/30',
  hard: 'from-red-500/30 to-rose-500/30',
};

export const FlashCard: React.FC<FlashCardProps> = ({ card, onKnown, onUnknown, onStar, onEdit, index = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleFlip = () => {
    if (card.type !== 'mcq') setIsFlipped(f => !f);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setTimeout(() => setIsFlipped(true), 400);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setSelectedOption(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`flashcard-container relative ${difficultyGlow[card.difficulty]}`}
      style={{ perspective: '1200px', minHeight: '280px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="flashcard-inner relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', minHeight: '280px' }}
      >
        {/* Front */}
        <div
          className={`flashcard-face absolute inset-0 cursor-pointer rounded-2xl p-5 flex flex-col`}
          style={{ backfaceVisibility: 'hidden' }}
          onClick={handleFlip}
        >
          {/* Gradient border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${difficultyBorder[card.difficulty]} p-[1px]`}>
            <div className="absolute inset-[1px] rounded-2xl bg-card" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1.5 flex-wrap">
                <Badge variant={card.difficulty}>{card.difficulty}</Badge>
                <Badge variant={card.type}>{card.type === 'mcq' ? 'MCQ' : card.type}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onStar(card.id); }}
                  className={`p-1 rounded-lg transition-colors ${card.isStarred ? 'text-amber-400' : 'text-white/30 hover:text-amber-400'}`}
                >
                  <Star size={14} fill={card.isStarred ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onEdit(card); }}
                  className="p-1 rounded-lg text-white/30 hover:text-white/70 transition-colors"
                >
                  <Edit2 size={14} />
                </motion.button>
              </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Question</p>
              <p className="text-white font-medium leading-relaxed text-base">{card.question}</p>
            </div>

            {/* MCQ Options */}
            {card.type === 'mcq' && card.options && !isFlipped && (
              <div className="mt-3 space-y-2">
                {card.options.map(option => (
                  <button
                    key={option.id}
                    onClick={(e) => { e.stopPropagation(); handleOptionSelect(option.id); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all border ${
                      selectedOption === option.id
                        ? option.isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'glass border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {/* Tags */}
            {card.tags.length > 0 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {card.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 rounded-md text-xs text-white/30 bg-white/5">#{tag}</span>
                ))}
              </div>
            )}

            {/* Flip hint */}
            {card.type !== 'mcq' && (
              <p className="text-center text-xs text-white/25 mt-2">Click to reveal answer</p>
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className="flashcard-face absolute inset-0 rounded-2xl p-5 flex flex-col"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 p-[1px]">
            <div className="absolute inset-[1px] rounded-2xl bg-card" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <Badge variant="qa">Answer</Badge>
              <button onClick={handleReset} className="p-1 rounded-lg text-white/30 hover:text-white/70 transition-colors">
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Answer */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-white/80 leading-relaxed text-sm">{card.answer}</p>
              {card.type === 'mcq' && card.options && (
                <p className="mt-3 text-emerald-400 text-xs font-semibold">
                  ✓ Correct: {card.options.find(o => o.isCorrect)?.text}
                </p>
              )}
            </div>

            {/* Actions */}
            {card.isKnown ? (
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                  <Check size={14} /> Marked as Known
                </span>
                <button
                  onClick={() => onUnknown(card.id)}
                  className="text-xs text-white/40 hover:text-white/70 underline"
                >
                  Undo
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onUnknown(card.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                >
                  <X size={14} /> Still Learning
                </button>
                <button
                  onClick={() => onKnown(card.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                >
                  <Check size={14} /> Got It!
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
