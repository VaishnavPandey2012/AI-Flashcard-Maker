import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, TrendingUp, Trophy } from 'lucide-react';
import type { StudyStats } from '../../types/flashcard';

interface StreakTrackerProps {
  stats: StudyStats;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ stats }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  // 0=Sun, map to Mon-first display
  const todayIdx = today === 0 ? 6 : today - 1;

  const sessionsByDay = new Array(7).fill(0);
  const now = Date.now();
  stats.sessions.forEach(s => {
    const d = new Date(s.date);
    const diff = Math.floor((now - s.date) / 86400000);
    if (diff < 7) {
      const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
      sessionsByDay[dayIdx] += s.cardsStudied;
    }
  });

  const maxSessions = Math.max(...sessionsByDay, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Flame size={18} className="text-orange-400" /> Study Streak
        </h3>
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-400" />
          <span className="text-amber-400 font-bold text-lg">{stats.streak}</span>
          <span className="text-white/40 text-xs">days</span>
        </div>
      </div>

      {/* Week view */}
      <div>
        <div className="flex items-end justify-between gap-1 h-16">
          {days.map((day, i) => {
            const height = Math.max((sessionsByDay[i] / maxSessions) * 100, 4);
            const isToday = i === todayIdx;
            const hasActivity = sessionsByDay[i] > 0;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`w-full rounded-lg transition-colors ${
                    isToday
                      ? 'bg-gradient-to-t from-violet-600 to-indigo-500'
                      : hasActivity
                      ? 'bg-gradient-to-t from-violet-800/60 to-indigo-800/60'
                      : 'bg-white/5'
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          {days.map((day, i) => (
            <span
              key={day}
              className={`flex-1 text-center text-xs ${i === todayIdx ? 'text-violet-400 font-bold' : 'text-white/30'}`}
            >
              {day[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{stats.sessions.length}</div>
          <div className="text-xs text-white/40 flex items-center justify-center gap-1">
            <Calendar size={10} /> Sessions
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-400">{stats.knownCards}</div>
          <div className="text-xs text-white/40">Mastered</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">
            {stats.sessions.length > 0
              ? Math.round(stats.sessions.reduce((acc, s) => acc + s.cardsStudied, 0) / stats.sessions.length)
              : 0}
          </div>
          <div className="text-xs text-white/40 flex items-center justify-center gap-1">
            <TrendingUp size={10} /> Avg/session
          </div>
        </div>
      </div>
    </motion.div>
  );
};
