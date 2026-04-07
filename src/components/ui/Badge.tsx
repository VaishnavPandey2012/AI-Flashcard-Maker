import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'qa' | 'mcq' | 'revision' | 'summary' | 'default';
  className?: string;
}

const variantClasses = {
  easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  qa: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  mcq: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  revision: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  summary: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  default: 'bg-white/10 text-white/70 border-white/20',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
