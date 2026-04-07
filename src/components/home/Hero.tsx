import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Zap, Trophy } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden px-4">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass border border-violet-500/30 rounded-full px-4 py-2 mb-8"
        >
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm text-white/70">AI-Powered Flashcard Generation</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
        >
          <span className="text-white">Study Smarter</span>
          <br />
          <span className="gradient-text">Not Harder</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Transform any text, topic, or document into intelligent flashcards instantly.
          Master anything with AI-powered spaced repetition.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" size="lg" onClick={onGetStarted} icon={<Sparkles size={18} />}>
            Create Flashcards Free
          </Button>
          <Button variant="secondary" size="lg" onClick={onGetStarted} icon={<ArrowRight size={18} />}>
            See Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center gap-8 mt-16"
        >
          {[
            { label: 'Cards Generated', value: '2M+', icon: <Brain size={16} /> },
            { label: 'Topics Covered', value: '500+', icon: <Zap size={16} /> },
            { label: 'Students', value: '50K+', icon: <Trophy size={16} /> },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center gap-1 text-violet-400 mb-1">
                {stat.icon}
                <span className="text-2xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Floating card preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 relative max-w-lg mx-auto"
        >
          <div className="glass-card text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />
            <div className="relative z-10">
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">easy</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30">Q&A</span>
              </div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Question</p>
              <p className="text-white font-medium mb-4">What is photosynthesis and why is it important?</p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Answer</p>
                <p className="text-white/70 text-sm">Photosynthesis converts sunlight, CO₂ and water into glucose and oxygen, providing the foundation of most food chains on Earth.</p>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 glass border border-violet-500/30 rounded-xl px-3 py-1.5 text-xs text-violet-300"
          >
            ✨ AI Generated
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-4 -left-4 glass border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-emerald-300"
          >
            🧠 Spaced Repetition
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
