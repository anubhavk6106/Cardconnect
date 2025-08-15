import React from 'react';
import { Link } from 'react-router-dom'; // Using Link for better navigation

const ProfilePage = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-teal-500">CardConnect</Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-teal-500">Dashboard</Link>
            <button onClick={handleLogout} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Profile</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="name" type="text" readOnly value="John Doe" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="email" type="email" readOnly value="john.doe@example.com" />
            </div>
          </div>
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Manage Cards</h3>
            <p className="text-gray-600 mb-2">Here you can view and add your saved cards.</p>
            <div className="mb-2 p-3 bg-gray-100 rounded-md border border-gray-300">
              <p className="text-sm text-gray-700">No cards added yet.</p>
            </div>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">Add New Card</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;