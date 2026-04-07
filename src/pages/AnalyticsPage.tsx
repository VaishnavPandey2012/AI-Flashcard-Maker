import React from 'react';
import { motion } from 'framer-motion';
import { AnalyticsPanel } from '../components/analytics/AnalyticsPanel';
import type { Deck, StudyStats } from '../types/flashcard';

interface AnalyticsPageProps {
  decks: Deck[];
  stats: StudyStats;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ decks, stats }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Analytics</h1>
        <p className="text-white/50 text-sm">Track your learning progress and performance</p>
      </motion.div>
      <AnalyticsPanel decks={decks} stats={stats} />
    </div>
  );
};
