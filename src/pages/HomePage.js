import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <HeroSection />
      <main>
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;