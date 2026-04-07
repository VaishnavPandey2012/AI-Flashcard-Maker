import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Flashcard, Difficulty, CardType } from '../../types/flashcard';
import { Badge } from '../ui/Badge';

interface CardEditorProps {
  card: Flashcard;
  onSave: (card: Flashcard) => void;
  onClose: () => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({ card, onSave, onClose }) => {
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);
  const [difficulty, setDifficulty] = useState<Difficulty>(card.difficulty);
  const [type, setType] = useState<CardType>(card.type);
  const [tagsInput, setTagsInput] = useState(card.tags.join(', '));

  const handleSave = () => {
    onSave({
      ...card,
      question: question.trim(),
      answer: answer.trim(),
      difficulty,
      type,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <Modal isOpen onClose={onClose} title="Edit Flashcard" maxWidth="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">Question</label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={3}
            className="w-full glass border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
            placeholder="Enter question..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">Answer</label>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={4}
            className="w-full glass border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
            placeholder="Enter answer..."
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">Difficulty</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`transition-opacity ${difficulty === d ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <Badge variant={d}>{d}</Badge>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">Type</label>
            <div className="flex gap-2 flex-wrap">
              {(['qa', 'mcq', 'revision', 'summary'] as CardType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`transition-opacity ${type === t ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <Badge variant={t}>{t.toUpperCase()}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
          <input
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            className="w-full glass border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
            placeholder="e.g. math, algebra, equations"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};
