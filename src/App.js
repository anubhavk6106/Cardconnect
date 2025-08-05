import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-white font-sans">
      {/* Navbar and Hero are designed to overlap */}
      <Navbar />
      <HeroSection />

      {/* The rest of the page follows */}
      <main>
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;