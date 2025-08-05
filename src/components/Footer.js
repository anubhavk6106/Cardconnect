import React from 'react';
import { FiCreditCard, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FiCreditCard className="h-8 w-8 text-indigo-400 mr-2" />
              <h2 className="text-2xl font-bold">CardConnect</h2>
            </div>
            <p className="text-gray-400">Get the benefits, even without the card.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><FiTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiInstagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CardConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;