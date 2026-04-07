import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, BarChart3, PlusCircle } from 'lucide-react';
import { DarkModeToggle } from '../ui/DarkModeToggle';

type Page = 'home' | 'create' | 'study' | 'analytics';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Brain size={16} /> },
  { id: 'create', label: 'Create', icon: <PlusCircle size={16} /> },
  { id: 'study', label: 'Study', icon: <Zap size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
];

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, darkMode, onToggleDarkMode }) => {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-bold text-white hidden sm:block">
            <span className="gradient-text">AI</span> Flashcards
          </span>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/15"
                  transition={{ type: 'spring', bounce: 0.2 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 hidden sm:block">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        </div>
      </div>
    </motion.header>
  );
};
