import React from'react';
import { useState } from 'react'; // <-- Import useState
import { Link } from 'react-router-dom'; // <-- Import Link for navigation

const LoginPage = () => {
  // Step 2: Create state variables to hold email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 3: Create a function to handle form submission
  const handleLogin = (e) => {
    // Prevent the default browser refresh on form submission
    e.preventDefault(); 

    // For now, we'll just log the data to the console.
    // Later, we will send this data to our backend server.
    console.log('Attempting to log in with:');
    console.log({ email, password });
    
    // Here you would typically make an API call
    alert('Login functionality is not connected yet. See console for data.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="mt-2 text-sm text-gray-600">Log in to your CardConnect account</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email} // <-- Bind the input value to our state
              onChange={(e) => setEmail(e.target.value)} // <-- Update state on change
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password} // <-- Bind the input value to our state
              onChange={(e) => setPassword(e.target.value)} // <-- Update state on change
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log In
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;