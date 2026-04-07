import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

const suggestions = [
  'Python Programming',
  'World War II',
  'Organic Chemistry',
  'Machine Learning',
  'Cell Biology',
  'Economics Basics',
  'JavaScript',
  'Ancient History',
  'Calculus',
  'Human Anatomy',
];

export const TopicInput: React.FC<TopicInputProps> = ({ value, onChange, onGenerate }) => {
  const [showSuggestions, setShowSuggestions] = useState(true);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white/70">Enter a topic to study</label>
      <div className="relative">
        <Lightbulb size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/70 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setShowSuggestions(true); }}
          onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onGenerate(); }}
          placeholder="e.g. Photosynthesis, World War II, Python basics..."
          className="w-full pl-10 pr-10 py-3 glass border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
        />
        {value && (
          <button
            onClick={onGenerate}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div>
          <p className="text-xs text-white/40 mb-2">Popular topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onChange(s); setShowSuggestions(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  value === s
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'glass border-white/10 text-white/60 hover:text-white hover:border-white/25'
                }`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
