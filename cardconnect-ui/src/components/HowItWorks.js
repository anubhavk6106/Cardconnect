import React from 'react';
import { FiUserPlus, FiSend, FiCheckSquare, FiAward } from 'react-icons/fi';

const steps = [
  {
    icon: <FiUserPlus className="h-10 w-10 text-indigo-600" />,
    title: 'Post a Request',
    description: 'Tell us the e-commerce site, offer details, and purchase amount you need.',
  },
  {
    icon: <FiSend className="h-10 w-10 text-indigo-600" />,
    title: 'Get Matched',
    description: 'Our platform instantly finds cardholders with the required card who can help.',
  },
  {
    icon: <FiCheckSquare className="h-10 w-10 text-indigo-600" />,
    title: 'Secure the Deal',
    description: 'The cardholder makes the purchase for you. Your payment is held securely in escrow.',
  },
  {
    icon: <FiAward className="h-10 w-10 text-indigo-600" />,
    title: 'Confirm & Reward',
    description: 'Once you confirm your item, the payment is released to the cardholder with a small fee.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">Get Your Discount in 4 Easy Steps</h2>
          <p className="mt-4 text-gray-600">A seamless process designed for your security and convenience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center items-center h-20 w-20 mx-auto bg-indigo-100 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;