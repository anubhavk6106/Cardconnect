import React from 'react';
import Navbar from '../components/Navbar';
import NavbarAuth from '../components/NavbarAuth'; // <-- 1. Import the new navbar
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Footer from '../components/Footer';
import FadeInOnScroll from '../components/FadeInOnScroll';

const HomePage = () => {
  // 2. Check for a login token in local storage
  const token = localStorage.getItem('token');

  return (
    <div className="font-sans">
      {/* 3. Conditionally render the correct navbar */}
      {token ? <NavbarAuth /> : <Navbar />}
      
      <HeroSection />
      <main>
        <FadeInOnScroll>
          <HowItWorks />
        </FadeInOnScroll>
        <FadeInOnScroll>
          <Features />
        </FadeInOnScroll>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;