import React from 'react';
import { FiGrid, FiSearch } from 'react-icons/fi'; // Updated icons

const Navbar = () => {
  return (
    // Make the navbar absolute to place it over the hero section
    <nav className="absolute top-0 left-0 right-0 z-50 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          {/* A placeholder for your logo SVG */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#34D399" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="#34D399" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 12V22" stroke="#34D399" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-bold text-white">CardConnect</h1>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-white opacity-80 hover:opacity-100 transition">How It Works</a>
          <a href="#features" className="text-white opacity-80 hover:opacity-100 transition">Compare Cards</a>
          <a href="#contact" className="text-white opacity-80 hover:opacity-100 transition">Community</a>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition text-white">
            <FiGrid size={20} />
          </button>
           <button className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition text-white">
            <FiSearch size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;