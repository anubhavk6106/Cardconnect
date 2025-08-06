import React from 'react';
import { FiGrid, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // <-- IMPORT LINK

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* ... Logo and middle links are the same ... */}

        <div className="flex items-center space-x-2">
          {/* REPLACE BUTTONS WITH LINKS */}
          <Link to="/login" className="px-4 py-2 text-white text-sm font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition">
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