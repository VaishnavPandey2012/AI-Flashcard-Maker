import React from 'react';
import { Brain, Github, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="text-white/60 text-sm">AI Flashcard Maker</span>
          </div>
          <div className="flex items-center gap-1 text-white/40 text-sm">
            <span>Made with</span>
            <Heart size={12} className="text-pink-400 fill-pink-400" />
            <span>for learners everywhere</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="text-white/40 hover:text-white/70 transition-colors">
              <Github size={16} />
            </a>
            <a href="#" className="text-white/40 hover:text-white/70 transition-colors">
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
