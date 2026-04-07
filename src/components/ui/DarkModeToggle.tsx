import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="relative w-12 h-6 rounded-full glass border border-white/20 flex items-center px-1 transition-colors"
      aria-label="Toggle dark mode"
    >
      <motion.div
        animate={{ x: darkMode ? 0 : 22 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 shadow-sm flex items-center justify-center"
      >
        {darkMode ? (
          <Moon size={9} className="text-white" />
        ) : (
          <Sun size={9} className="text-white" />
        )}
      </motion.div>
    </motion.button>
  );
};
