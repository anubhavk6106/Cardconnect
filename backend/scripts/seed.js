require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Card = require('../models/Card');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Card.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin (password will be hashed by User model pre-save hook)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cardconnect.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '9999999999',
      address: {
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      isActive: true
    });

    console.log('Admin created:', admin.email);

    // Create Card Owners
    const cardOwner1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: 'password123',
      role: 'card_owner',
      phone: '9876543210',
      address: {
        city: 'Delhi',
        state: 'Delhi'
      }
    });

    const cardOwner2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'password123',
      role: 'card_owner',
      phone: '9876543211',
      address: {
        city: 'Bangalore',
        state: 'Karnataka'
      }
    });

    const cardOwner3 = await User.create({
      name: 'Amit Patel',
      email: 'amit@example.com',
      password: 'password123',
      role: 'card_owner',
      phone: '9876543212',
      address: {
        city: 'Pune',
        state: 'Maharashtra'
      }
    });

    console.log('Card owners created');

    // Create Buyers
    const buyer1 = await User.create({
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      password: 'password123',
      role: 'buyer',
      phone: '9876543213',
      address: {
        city: 'Hyderabad',
        state: 'Telangana'
      }
    });

    const buyer2 = await User.create({
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      password: 'password123',
      role: 'buyer',
      phone: '9876543214',
      address: {
        city: 'Chennai',
        state: 'Tamil Nadu'
      }
    });

    console.log('Buyers created');

    // Create Cards with Discounts
    const cards = [
      {
        owner: cardOwner1._id,
        bankName: 'HDFC Bank',
        cardType: 'credit',
        cardNetwork: 'Visa',
        lastFourDigits: '1234',
        usageLimit: 10,
        availableDiscounts: [
          {
            platform: 'Amazon',
            discountPercentage: 10,
            maxDiscount: 1500,
            minPurchase: 3000,
            validUntil: new Date('2026-12-31')
          }
        ],
        rating: 4.5,
        totalTransactions: 25
      },
      {
        owner: cardOwner1._id,
        bankName: 'HDFC Bank',
        cardType: 'credit',
        cardNetwork: 'Mastercard',
        lastFourDigits: '5678',
        usageLimit: 8,
        availableDiscounts: [
          {
            platform: 'Flipkart',
            discountPercentage: 15,
            maxDiscount: 2000,
            minPurchase: 5000,
            validUntil: new Date('2026-12-31')
          }
        ],
        rating: 4.7,
        totalTransactions: 32
      },
      {
        owner: cardOwner2._id,
        bankName: 'ICICI Bank',
        cardType: 'credit',
        cardNetwork: 'Visa',
        lastFourDigits: '9012',
        usageLimit: 12,
        availableDiscounts: [
          {
            platform: 'Amazon',
            discountPercentage: 12,
            maxDiscount: 2000,
            minPurchase: 2500,
            validUntil: new Date('2026-12-31')
          }
        ],
        rating: 4.3,
        totalTransactions: 18
      },
      {
        owner: cardOwner2._id,
        bankName: 'ICICI Bank',
        cardType: 'debit',
        cardNetwork: 'RuPay',
        lastFourDigits: '3456',
        usageLimit: 15,
        availableDiscounts: [
          {
            platform: 'Myntra',
            discountPercentage: 20,
            maxDiscount: 1000,
            minPurchase: 1500,
            validUntil: new Date('2026-12-31')
          }
        ],
        rating: 4.6,
        totalTransactions: 22
      },
      {
        owner: cardOwner3._id,
        bankName: 'SBI Card',
        cardType: 'credit',
        cardNetwork: 'Visa',
        lastFourDigits: '7890',
        usageLimit: 10,
        availableDiscounts: [
          {
            platform: 'Amazon',
            discountPercentage: 8,
            maxDiscount: 1000,
            minPurchase: 2000,
            validUntil: new Date('2026-12-31')
          }
        ],
        rating: 4.4,
        totalTransactions: 15
      },
      {
        owner: cardOwner3._id,
        bankName: 'Axis Bank',
        cardType: 'credit',
        cardNetwork: 'Mastercard',
        lastFourDigits: '2345',
        usageLimit: 8,
        availableDiscounts: [
          {
            platform: 'Flipkart',
            discountPercentage: 10,
            maxDiscount: 1500,
            minPurchase: 4000,
            validUntil: new Date('2026-12-31')
          }
        ],
        rating: 4.8,
        totalTransactions: 40
      },
      {
        owner: cardOwner3._id,
        bankName: 'Axis Bank',
        cardType: 'credit',
        cardNetwork: 'Visa',
        lastFourDigits: '6789',
        usageLimit: 10,
        availableDiscounts: [
          {
            platform: 'Myntra',
            discountPercentage: 25,
            maxDiscount: 2500,
            minPurchase: 3000,
            validUntil: new Date('2026-12-31')
          }
        ],
        rating: 4.9,
        totalTransactions: 50
      }
    ];

    await Card.insertMany(cards);
    console.log(`${cards.length} cards created`);

    console.log('\n=== Seed Data Summary ===');
    console.log(`Admin: ${admin.email} / Admin@123`);
    console.log('\nCard Owners:');
    console.log(`  ${cardOwner1.email} / password123 (2 cards)`);
    console.log(`  ${cardOwner2.email} / password123 (2 cards)`);
    console.log(`  ${cardOwner3.email} / password123 (3 cards)`);
    console.log('\nBuyers:');
    console.log(`  ${buyer1.email} / password123`);
    console.log(`  ${buyer2.email} / password123`);
    console.log('\nTotal Cards: 7');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
