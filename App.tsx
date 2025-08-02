import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProteinDesigner } from './components/ProteinDesigner';
import { Metrics } from './components/Metrics';
import { Pricing } from './components/Pricing';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header />
      <main>
        <Hero />
        <div id="design">
          <ProteinDesigner />
        </div>
        <div id="metrics">
          <Metrics />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
      </main>
    </div>
  );
}

export default App;