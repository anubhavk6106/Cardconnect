import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  // State for the new request form
  const [platform, setPlatform] = useState('');
  const [offerDetails, setOfferDetails] = useState('');
  const [amount, setAmount] = useState('');

  // State to hold the list of all open requests
  const [requests, setRequests] = useState([]);

  // This function fetches all open requests from the backend
  const fetchRequests = async () => {
    try {
      // UPDATED: Using the live Render URL
      const { data } = await axios.get('https://cardconnect-l6lq.onrender.com/api/requests');
      setRequests(data);
    } catch (error) {
      console.error('Could not fetch requests', error);
    }
  };

  // useEffect runs once when the component loads to fetch the initial data
  useEffect(() => {
    fetchRequests();
  }, []);

  // This function handles creating a new request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post a request.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // UPDATED: Using the live Render URL
      const { data } = await axios.post(
        'https://cardconnect-l6lq.onrender.com/api/requests',
        { platform, offerDetails, amount },
        config
      );

      // Add the new request to the top of our list and clear the form
      setRequests([data, ...requests]);
      setPlatform('');
      setOfferDetails('');
      setAmount('');

    } catch (error) {
      console.error('Error creating request:', error.response.data);
      alert('Failed to create request.');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">CardConnect Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Section to Create a New Request */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post a New Offer Request</h2>
          <form onSubmit={handleCreateRequest} className="space-y-4">
            <input
              type="text"
              placeholder="Platform (e.g., Amazon, Flipkart)"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Offer Details (e.g., 10% off with HDFC Card)"
              value={offerDetails}
              onChange={(e) => setOfferDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Purchase Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
              Post Request
            </button>
          </form>
        </section>

        {/* Section to View Open Requests */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Open Requests</h2>
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{request.platform} - ₹{request.amount}</h3>
                    <p className="text-gray-600">{request.offerDetails}</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600">
                    Accept Deal
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No open requests at the moment.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;