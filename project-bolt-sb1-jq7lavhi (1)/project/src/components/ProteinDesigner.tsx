import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Lightbulb, ChevronRight } from 'lucide-react';
import { ProteinViewer } from './ProteinViewer';
import { useAuth } from '../hooks/useAuth';
import { useProteinGeneration } from '../hooks/useProteinGeneration';
import { ProteinParameters } from '../types';

const suggestions = [
  "Enzyme to degrade plastic",
  "Binder to viral protein",
  "Stable scaffold under 100 aa",
  "Thermostable enzyme for industrial use",
  "Membrane protein for drug transport",
  "Antimicrobial peptide",
  "Protein-protein interaction inhibitor",
  "Fluorescent protein marker"
];

export const ProteinDesigner: React.FC = () => {
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState<ProteinParameters>({
    targetLength: 100,
    foldingType: '',
    stabilityPreference: '',
    solubilityRequirement: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, updateUser, canGenerate } = useAuth();
  const { currentJob, isGenerating, generateProtein, clearJob } = useProteinGeneration();

  const isFormValid = () => {
    return description.trim() && 
           parameters.foldingType && 
           parameters.stabilityPreference && 
           parameters.solubilityRequirement &&
           parameters.targetLength >= 20 && 
           parameters.targetLength <= 500;
  };

  const handleGenerate = async () => {
    if (!isFormValid() || !canGenerate() || isGenerating) return;

    try {
      const result = await generateProtein(description, parameters);
      
      // Update user's generation count
      if (user) {
        updateUser({
          generationsUsed: user.generationsUsed + 1
        });
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(suggestion);
    setShowSuggestions(false);
  };

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
            Design Your Protein
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Describe your protein's function and let our AI generate optimized sequences with predicted 3D structures
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <label className="block text-lg font-medium text-gray-200 mb-3">
                Protein Description
              </label>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Describe the function or properties of your desired protein..."
                  className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 resize-none backdrop-blur-sm"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="absolute top-3 right-3 p-2 text-gray-400 hover:text-purple-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Lightbulb size={20} />
                </motion.button>
              </motion.div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    className="absolute z-10 top-full mt-2 w-full bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 border-b border-gray-600">
                      <div className="text-sm font-medium text-gray-300">Suggested Designs</div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-purple-600/20 hover:text-white transition-all duration-200 flex items-center justify-between group"
                          whileHover={{ x: 4 }}
                        >
                          <span>{suggestion}</span>
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scientific Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Scientific Parameters</h3>
              
              {/* Target Length */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Length (AA) *
                </label>
                <motion.input
                  type="number"
                  min="20"
                  max="500"
                  value={parameters.targetLength}
                  onChange={(e) => setParameters({...parameters, targetLength: parseInt(e.target.value) || 100})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Folding Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Folding Type *
                </label>
                <motion.select
                  value={parameters.foldingType}
                  onChange={(e) => setParameters({...parameters, foldingType: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">Select folding type...</option>
                  <option value="alpha-helix">Alpha helix</option>
                  <option value="beta-sheet">Beta sheet</option>
                  <option value="mixed">Mixed</option>
                  <option value="random-coil">Random coil</option>
                </motion.select>
              </div>

              {/* Stability Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stability Preference *
                </label>
                <motion.select
                  value={parameters.stabilityPreference}
                  onChange={(e) => setParameters({...parameters, stabilityPreference: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">Select stability...</option>
                  <option value="high-thermal">High thermal stability</option>
                  <option value="flexible">Flexible/low-stability</option>
                  <option value="neutral">Neutral</option>
                </motion.select>
              </div>

              {/* Solubility Requirement */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Solubility Requirement *
                </label>
                <motion.select
                  value={parameters.solubilityRequirement}
                  onChange={(e) => setParameters({...parameters, solubilityRequirement: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">Select solubility...</option>
                  <option value="soluble">Soluble</option>
                  <option value="membrane-bound">Membrane-bound</option>
                  <option value="no-preference">Doesn't matter</option>
                </motion.select>
              </div>
            </div>

            {/* Usage Information */}
            {user && (
              <motion.div
                className="bg-gray-800/30 rounded-xl p-4 border border-gray-600/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-300">
                    Generations Used: <span className="font-medium text-white">{user.generationsUsed}</span>
                    {user.plan !== 'pro' && (
                      <span className="text-gray-400"> / {user.generationsLimit}</span>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.plan === 'free' ? 'bg-gray-600 text-gray-200' :
                    user.plan === 'basic' ? 'bg-blue-600 text-blue-100' :
                    'bg-purple-600 text-purple-100'
                  }`}>
                    {user.plan.toUpperCase()} PLAN
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={!isFormValid() || !canGenerate() || isGenerating}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                !isFormValid() || !canGenerate() || isGenerating
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25'
              }`}
              whileHover={{ scale: !isFormValid() || !canGenerate() || isGenerating ? 1 : 1.05 }}
              whileTap={{ scale: !isFormValid() || !canGenerate() || isGenerating ? 1 : 0.95 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap size={24} className={isGenerating ? 'animate-pulse' : ''} />
                <span>
                  {isGenerating ? 'Generating...' : 'Generate Protein'}
                </span>
              </div>
            </motion.button>

            {/* Status Messages */}
            <AnimatePresence>
              {currentJob && (
                <motion.div
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-200">
                      {currentJob.status === 'pending' && 'Initializing AI models...'}
                      {currentJob.status === 'processing' && 'Predicting 3D structure...'}
                      {currentJob.status === 'completed' && 'Generation complete!'}
                      {currentJob.status === 'failed' && 'Generation failed'}
                    </div>
                    {currentJob.status === 'completed' && (
                      <motion.button
                        onClick={clearJob}
                        className="text-sm text-purple-400 hover:text-purple-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        Clear
                      </motion.button>
                    )}
                  </div>
                  {(currentJob.status === 'pending' || currentJob.status === 'processing') && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: currentJob.status === 'pending' ? '30%' : '70%'
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 3D Viewer Section */}
          <motion.div
            className="h-96 lg:h-[500px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ProteinViewer
              sequence={currentJob?.result?.sequence}
              confidence={currentJob?.result?.confidence}
              isPlaceholder={!currentJob?.result}
            />
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {currentJob?.result && (
            <motion.div
              className="mt-12 bg-gray-800/30 rounded-2xl p-8 border border-gray-600/50"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Generated Protein</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-200 mb-3">Sequence</h4>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 break-all max-h-40 overflow-y-auto">
                    {currentJob.result.sequence}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-200 mb-3">Properties</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Length:</span>
                      <span className="text-white font-medium">{currentJob.result.targetLength} AA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Length:</span>
                      <span className="text-white font-medium">{currentJob.result.sequence.length} AA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Folding Type:</span>
                      <span className="text-white font-medium">{currentJob.result.foldingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Stability:</span>
                      <span className="text-white font-medium">{currentJob.result.stabilityPreference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence:</span>
                      <span className={`font-medium ${
                        currentJob.result.confidence >= 90 ? 'text-green-400' :
                        currentJob.result.confidence >= 80 ? 'text-yellow-400' : 'text-orange-400'
                      }`}>
                        {currentJob.result.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Generated:</span>
                      <span className="text-white font-medium">
                        {new Date(currentJob.result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              {user && (user.plan === 'basic' || user.plan === 'pro') && (
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-600/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-lg font-semibold text-gray-200 mb-4">Export Options</h4>
                  <div className="flex flex-wrap gap-3">
                    {['FASTA', 'PDB', 'JSON'].map((format) => (
                      <motion.button
                        key={format}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Export functionality would be implemented here
                          console.log(`Exporting as ${format}`);
                        }}
                      >
                        Export {format}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};