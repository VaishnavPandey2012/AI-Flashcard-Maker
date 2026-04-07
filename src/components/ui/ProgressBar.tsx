import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'violet' | 'emerald' | 'cyan' | 'pink' | 'amber';
  showLabel?: boolean;
  label?: string;
  height?: string;
}

const colorClasses = {
  violet: 'from-violet-600 to-indigo-600',
  emerald: 'from-emerald-500 to-teal-500',
  cyan: 'from-cyan-500 to-blue-500',
  pink: 'from-pink-500 to-rose-500',
  amber: 'from-amber-500 to-orange-500',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'violet',
  showLabel = false,
  label,
  height = 'h-2',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-white/60">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-white/80">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]} shadow-lg`}
        />
      </div>
    </div>
  );
};
