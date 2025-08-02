import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Mail, MessageCircle } from 'lucide-react';
import { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    period: 'forever',
    features: [
      '3 total generations',
      'Low processing speed',
      'Watermarked low-res preview',
      'No export options',
      'Basic support'
    ],
    generations: 3,
    speed: 'low',
    watermark: true,
    exports: false,
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 19,
    period: 'month',
    features: [
      '10 generations per month',
      'Medium processing speed',
      'Full-resolution preview',
      'Export permissions',
      'Email support',
      'Structure validation'
    ],
    generations: 10,
    speed: 'medium',
    watermark: false,
    exports: true,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 49,
    period: 'month',
    features: [
      'Unlimited generations',
      'Fastest processing speed',
      'Full export (FASTA, PDB, JSON)',
      'No watermarks',
      'Priority queue',
      'Advanced analytics',
      'Priority support'
    ],
    generations: 'unlimited',
    speed: 'high',
    watermark: false,
    exports: true,
  },
];

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-600"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Let's Chat</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tell us about your needs
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Pricing: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handlePlanSelect = (planId: string) => {
    if (planId === 'custom') {
      setIsContactOpen(true);
    } else {
      // Handle Stripe integration for paid plans
      console.log(`Selected plan: ${planId}`);
      // In production, this would redirect to Stripe checkout
    }
  };

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the perfect plan for your protein design needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                plan.id === 'pro'
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/20 scale-105'
                  : 'border-gray-600/50 hover:border-purple-500/30'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.id === 'pro'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : plan.id === 'free'
                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {plan.id === 'free' ? 'Get Started' : 'Choose Plan'}
              </motion.button>
            </motion.div>
          ))}

          {/* Custom Plan Card */}
          <motion.div
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/50 hover:border-purple-500/30 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -10 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Custom Plan</h3>
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">Contact Us</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Custom generation limits',
                'Dedicated infrastructure',
                'API access',
                'Custom integrations',
                'SLA guarantees',
                'Dedicated support',
                'Training & onboarding'
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <Check size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => setIsContactOpen(true)}
              className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Let's Chat
            </motion.button>
          </motion.div>
        </div>
      </div>

      <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};