import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white/70">Paste your study material</label>
        <span className="text-xs text-white/30">{value.length} chars</span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={10}
        className="w-full glass border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none leading-relaxed"
        placeholder={`Paste your notes, textbook content, or any study material here...

Example:
The mitochondria is the powerhouse of the cell. It generates ATP through cellular respiration.

Photosynthesis is the process by which plants convert sunlight, water, and CO2 into glucose and oxygen.

DNA (Deoxyribonucleic acid) carries the genetic instructions for all living organisms.`}
      />
      <p className="text-xs text-white/40">
        💡 Tip: Include definitions, key facts, Q&A pairs, or any structured content for best results
      </p>
    </div>
  );
};
