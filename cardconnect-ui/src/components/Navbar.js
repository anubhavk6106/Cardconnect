import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    // We added bg-white/5 and backdrop-blur-sm here
    <nav className="absolute top-0 left-0 right-0 z-50 p-6 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#34D399" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="#34D399" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 12V22" stroke="#34D399" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-bold text-white">CardConnect</h1>
        </Link>

        {/* Login/Signup Buttons */}
        <div className="flex items-center space-x-2">
          <Link to="/login" className="px-4 py-2 text-white text-sm font-medium rounded-md hover:bg-white/10 transition">
            Log In
          </Link>
          <Link to="/register" className="px-4 py-2 bg-teal-400 text-white text-sm font-medium rounded-md hover:bg-teal-500 shadow-md transition">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;