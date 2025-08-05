import React from 'react';
import { FiShield, FiUsers, FiStar, FiMessageSquare } from 'react-icons/fi';

const features = [
  {
    icon: <FiShield className="h-8 w-8 text-white" />,
    title: 'Secure Escrow Payments',
    description: 'Your money is held safely until you confirm the transaction is complete. 100% risk-free.',
  },
  {
    icon: <FiUsers className="h-8 w-8 text-white" />,
    title: 'Instant Matching',
    description: 'Our smart algorithm connects you with the perfect cardholder in seconds.',
  },
  {
    icon: <FiStar className="h-8 w-8 text-white" />,
    title: 'Ratings & Reviews',
    description: 'Build community trust by rating your experience and reading reviews of others.',
  },
  {
    icon: <FiMessageSquare className="h-8 w-8 text-white" />,
    title: 'In-App Chat',
    description: 'Communicate securely with the cardholder to finalize deal details without leaving the platform.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">Why You'll Love CardConnect</h2>
          <p className="mt-4 text-gray-600">Packed with features to make sharing benefits simple and secure.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;