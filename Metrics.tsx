import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock } from 'lucide-react';

const metrics = [
  {
    icon: Target,
    title: 'Optimized for Scientific Design',
    subtitle: 'De Novo Protein Generation at Scale',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    icon: TrendingUp,
    title: '~95% Folding Confidence',
    subtitle: 'Based on ColabFold or OmegaFold validation',
    color: 'from-green-400 to-emerald-400',
  },
  {
    icon: Clock,
    title: 'Avg. Generation Time: Under 5 Minutes',
    subtitle: 'End‑to‑End pipeline speed',
    color: 'from-purple-400 to-pink-400',
  },
];

export const Metrics: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Powered by Advanced AI
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            State-of-the-art protein design with validated results and lightning-fast generation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/50 hover:border-purple-500/30 transition-all duration-300 group-hover:scale-105">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl" 
                     style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                
                <div className="relative z-10">
                  <motion.div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${metric.color} mb-6`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <metric.icon size={32} className="text-white" />
                  </motion.div>

                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-3`}>
                    {metric.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {metric.subtitle}
                  </p>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${metric.color} opacity-20 animate-pulse`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};