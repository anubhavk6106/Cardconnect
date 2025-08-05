import React from 'react';
import FloatingCardsGraphic from '../assets/cards-graphic.png'; // Import the graphic

const HeroSection = () => {
  return (
    <section className="hero-section text-white relative">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between relative z-10 min-h-screen pt-32 pb-16">
        
        {/* Left Side: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
            CardConnect
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-80 mb-8">
            Credit Offer Sharing Platform
          </p>
          <button className="text-lg font-semibold py-3 px-8 rounded-full bg-teal-400 hover:bg-teal-500 shadow-lg transform hover:scale-105 transition-all duration-300">
            Explore Offers
          </button>
        </div>

        {/* Right Side: The real graphic is now here */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <img 
            src={FloatingCardsGraphic} 
            alt="3D illustration of floating credit cards for CardConnect" 
            className="w-full max-w-lg mx-auto"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;