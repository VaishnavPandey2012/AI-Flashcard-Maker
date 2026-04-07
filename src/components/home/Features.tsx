import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, BarChart3, Shuffle, Star, Download, Moon, Search } from 'lucide-react';

const features = [
  { icon: <Brain size={22} />, title: 'Smart AI Generation', desc: 'Paste text or enter a topic and watch AI create perfectly structured flashcards in seconds.', color: 'from-violet-500 to-indigo-500' },
  { icon: <Zap size={22} />, title: '3D Card Flip', desc: 'Beautiful 3D flip animations with question on front, detailed answer on back.', color: 'from-pink-500 to-rose-500' },
  { icon: <Shuffle size={22} />, title: 'Quiz Mode', desc: 'Full-screen study mode with keyboard navigation, progress tracking, and confetti celebrations.', color: 'from-cyan-500 to-blue-500' },
  { icon: <BarChart3 size={22} />, title: 'Performance Analytics', desc: 'Track mastery rates, study streaks, and performance trends with beautiful charts.', color: 'from-emerald-500 to-teal-500' },
  { icon: <Star size={22} />, title: 'Smart Organization', desc: 'Star favorites, filter by difficulty, search cards, and organize by topic tags.', color: 'from-amber-500 to-orange-500' },
  { icon: <Download size={22} />, title: 'PDF Export', desc: 'Export any deck as a beautifully formatted PDF to study offline or share.', color: 'from-purple-500 to-violet-500' },
  { icon: <Moon size={22} />, title: 'Dark & Light Mode', desc: 'Gorgeous glassmorphism design that looks stunning in both dark and light modes.', color: 'from-indigo-500 to-purple-500' },
  { icon: <Search size={22} />, title: 'Smart Search', desc: 'Instantly search through all your flashcards by question, answer, or topic tag.', color: 'from-rose-500 to-pink-500' },
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-black text-white mb-4">
            Everything you need to <span className="gradient-text">ace your exams</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">Packed with powerful features designed to make studying more effective and enjoyable.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="glass-card group cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-1.5 text-sm">{f.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
