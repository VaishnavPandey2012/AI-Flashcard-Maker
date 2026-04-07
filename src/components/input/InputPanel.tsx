import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { TextInput } from './TextInput';
import { FileUpload } from './FileUpload';
import { TopicInput } from './TopicInput';
import { Button } from '../ui/Button';
import type { InputMethod } from '../../types/flashcard';

interface InputPanelProps {
  onGenerate: (method: InputMethod, value: string) => void;
  isGenerating: boolean;
}

const tabs: { id: InputMethod; label: string; emoji: string }[] = [
  { id: 'text', label: 'Paste Text', emoji: '📝' },
  { id: 'topic', label: 'Topic Name', emoji: '💡' },
  { id: 'file', label: 'Upload File', emoji: '📄' },
  { id: 'url', label: 'URL', emoji: '🔗' },
];

export const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<InputMethod>('text');
  const [value, setValue] = useState('');

  const handleGenerate = () => {
    if (value.trim()) onGenerate(activeTab, value);
  };

  const handleTabChange = (tab: InputMethod) => {
    setActiveTab(tab);
    setValue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Input content */}
      <div className="min-h-[200px]">
        {activeTab === 'text' && (
          <TextInput value={value} onChange={setValue} />
        )}
        {activeTab === 'topic' && (
          <TopicInput value={value} onChange={setValue} onGenerate={handleGenerate} />
        )}
        {activeTab === 'file' && (
          <FileUpload onTextExtracted={setValue} />
        )}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70">Study Material URL</label>
            <input
              type="url"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
            />
            <p className="text-xs text-white/40">Enter a URL to a study resource, Wikipedia article, or blog post</p>
          </div>
        )}
      </div>

      {/* Generate button */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center"
          onClick={handleGenerate}
          disabled={!value.trim() || isGenerating}
          loading={isGenerating}
          icon={isGenerating ? undefined : <Sparkles size={16} />}
        >
          {isGenerating ? 'Generating Flashcards...' : 'Generate Flashcards with AI'}
        </Button>
        {isGenerating && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <RefreshCw size={12} className="text-violet-400 animate-spin" />
            <span className="text-xs text-white/40">Analyzing content and creating cards...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
