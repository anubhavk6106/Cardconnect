import React from 'react';
// Step 1: Import the new PNG image from your assets folder
import FloatingCardsGraphic from '../assets/freepik__background__96616.png';

const HeroSection = () => {
  return (
    <section className="hero-section text-white relative min-h-screen flex items-center">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between relative z-10">
        
        {/* Left Side: Text Content with Animations */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 animate-on-load animate-fade-in-up"
          >
            CardConnect
          </h1>
          <p 
            className="text-xl md:text-2xl text-white opacity-80 mb-8 animate-on-load animate-fade-in-up"
            style={{ animationDelay: '0.3s' }} 
          >
            Credit Offer Sharing Platform
          </p>
          <button 
            className="text-lg font-semibold py-3 px-8 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50 hover:bg-teal-300 hover:shadow-xl hover:shadow-teal-400/80 transform hover:-translate-y-1 transition-all duration-300 animate-on-load animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            Explore Offers
          </button>
        </div>

        {/* Right Side: Graphic - NO LONGER A PLACEHOLDER! */}
        <div className="lg:w-1/2 flex justify-center items-center animate-on-load animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          {/* Step 2: Use the imported image in the <img> tag */}
          <img 
            src={FloatingCardsGraphic} 
            alt="3D illustration of floating credit cards" 
            className="w-full max-w-lg" 
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;