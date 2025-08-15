import React from 'react';
import { Link } from 'react-router-dom';

const NavbarAuth = () => {
  // This function handles the logout process
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Redirect the user to the homepage
    window.location.href = '/';
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo (Same as your original Navbar) */}
        <Link to="/" className="text-2xl font-bold text-white">
          CardConnect
        </Link>

        {/* NEW: Links for logged-in users */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="px-4 py-2 text-white text-sm font-medium rounded-md hover:bg-white/10 transition">
            Dashboard
          </Link>
          <Link to="/profile" className="px-4 py-2 text-white text-sm font-medium rounded-md hover:bg-white/10 transition">
            My Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAuth;