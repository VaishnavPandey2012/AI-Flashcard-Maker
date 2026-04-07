import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, BookOpen, Star, CheckCircle, XCircle } from 'lucide-react';
import type { StudyStats, Deck } from '../../types/flashcard';
import { ProgressBar } from '../ui/ProgressBar';
import { StreakTracker } from './StreakTracker';

interface AnalyticsPanelProps {
  stats: StudyStats;
  decks: Deck[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="glass-card"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</p>
        <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>{icon}</div>
    </div>
  </motion.div>
);

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats, decks }) => {
  const totalCards = decks.reduce((acc, d) => acc + d.cards.length, 0);
  const totalKnown = decks.reduce((acc, d) => acc + d.cards.filter(c => c.isKnown).length, 0);
  const totalStarred = decks.reduce((acc, d) => acc + d.cards.filter(c => c.isStarred).length, 0);
  const masteryRate = totalCards > 0 ? Math.round((totalKnown / totalCards) * 100) : 0;

  const recentSessions = stats.sessions.slice(-7).reverse();

  // Category breakdown from tags
  const tagFreq: Record<string, number> = {};
  decks.forEach(d => d.cards.forEach(c => c.tags.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1; })));
  const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Difficulty breakdown
  const diffBreakdown = { easy: 0, medium: 0, hard: 0 };
  decks.forEach(d => d.cards.forEach(c => { diffBreakdown[c.difficulty]++; }));

  if (decks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-white mb-2">No Analytics Yet</h3>
        <p className="text-white/50 text-sm">Create some flashcard decks and start studying to see your analytics here.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cards" value={totalCards} icon={<BookOpen size={18} />} color="text-violet-400" index={0} />
        <StatCard title="Mastered" value={totalKnown} subtitle={`${masteryRate}% rate`} icon={<CheckCircle size={18} />} color="text-emerald-400" index={1} />
        <StatCard title="Starred" value={totalStarred} icon={<Star size={18} />} color="text-amber-400" index={2} />
        <StatCard title="Decks" value={decks.length} icon={<BarChart3 size={18} />} color="text-cyan-400" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mastery donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h3 className="font-bold text-white mb-5 flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" /> Overall Mastery
          </h3>

          {/* Donut chart via SVG */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - masteryRate }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-white">{masteryRate}%</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Known</span>
                  <span className="text-emerald-400 font-semibold">{totalKnown}</span>
                </div>
                <ProgressBar value={totalKnown} max={totalCards} color="emerald" height="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Learning</span>
                  <span className="text-red-400 font-semibold">{totalCards - totalKnown}</span>
                </div>
                <ProgressBar value={totalCards - totalKnown} max={totalCards} color="pink" height="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Starred</span>
                  <span className="text-amber-400 font-semibold">{totalStarred}</span>
                </div>
                <ProgressBar value={totalStarred} max={totalCards} color="amber" height="h-1.5" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Difficulty breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 className="font-bold text-white mb-5">Difficulty Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-emerald-400 font-semibold">Easy</span>
                <span className="text-white/60">{diffBreakdown.easy} cards</span>
              </div>
              <ProgressBar value={diffBreakdown.easy} max={totalCards} color="emerald" height="h-2.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-amber-400 font-semibold">Medium</span>
                <span className="text-white/60">{diffBreakdown.medium} cards</span>
              </div>
              <ProgressBar value={diffBreakdown.medium} max={totalCards} color="amber" height="h-2.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-red-400 font-semibold">Hard</span>
                <span className="text-white/60">{diffBreakdown.hard} cards</span>
              </div>
              <ProgressBar value={diffBreakdown.hard} max={totalCards} color="pink" height="h-2.5" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Streak tracker */}
      <StreakTracker stats={stats} />

      {/* Per-deck performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <h3 className="font-bold text-white mb-5">Deck Performance</h3>
        <div className="space-y-4">
          {decks.map((deck, i) => {
            const deckKnown = deck.cards.filter(c => c.isKnown).length;
            const pct = deck.cards.length > 0 ? Math.round((deckKnown / deck.cards.length) * 100) : 0;
            return (
              <div key={deck.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/80 font-medium truncate">{deck.title}</span>
                  <span className="text-white/50 text-xs ml-2 flex-shrink-0">{deckKnown}/{deck.cards.length}</span>
                </div>
                <ProgressBar
                  value={deckKnown}
                  max={deck.cards.length}
                  color={pct >= 80 ? 'emerald' : pct >= 50 ? 'cyan' : 'violet'}
                  showLabel
                />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
        >
          <h3 className="font-bold text-white mb-5">Recent Sessions</h3>
          <div className="space-y-2">
            {recentSessions.map((session, i) => {
              const deck = decks.find(d => d.id === session.deckId);
              const score = Math.round((session.cardsKnown / session.cardsStudied) * 100);
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-sm text-white/80 font-medium">{deck?.title || 'Unknown Deck'}</p>
                    <p className="text-xs text-white/40">{new Date(session.date).toLocaleDateString()} · {session.cardsStudied} cards</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {score}%
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle size={10} className="text-emerald-400" />
                      <span className="text-xs text-white/40">{session.cardsKnown}</span>
                      <XCircle size={10} className="text-red-400 ml-1" />
                      <span className="text-xs text-white/40">{session.cardsStudied - session.cardsKnown}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Top tags */}
      {topTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
        >
          <h3 className="font-bold text-white mb-4">Top Study Topics</h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl border border-white/10">
                <span className="text-sm text-white/70">#{tag}</span>
                <span className="text-xs text-violet-400 font-bold">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
