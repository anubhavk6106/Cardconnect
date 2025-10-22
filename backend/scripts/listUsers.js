require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Card = require('../models/Card');
const Transaction = require('../models/Transaction');
const connectDB = require('../config/database');

const listAllData = async () => {
  try {
    await connectDB();

    console.log('\n========================================');
    console.log('       DATABASE USERS & DATA');
    console.log('========================================\n');

    // Get all users
    const users = await User.find({}).select('-password');
    
    console.log(`📊 Total Users: ${users.length}\n`);

    // Group by role
    const admins = users.filter(u => u.role === 'admin');
    const buyers = users.filter(u => u.role === 'buyer');
    const cardOwners = users.filter(u => u.role === 'card_owner');

    // Display Admins
    console.log('👑 ADMINS:');
    console.log('─────────────────────────────────────');
    if (admins.length === 0) {
      console.log('  No admins found');
    } else {
      admins.forEach(admin => {
        console.log(`  Name: ${admin.name}`);
        console.log(`  Email: ${admin.email}`);
        console.log(`  Phone: ${admin.phone}`);
        console.log(`  Created: ${admin.createdAt.toLocaleDateString()}`);
        console.log('  ─────────────────────');
      });
    }

    // Display Buyers
    console.log('\n🛒 BUYERS:');
    console.log('─────────────────────────────────────');
    if (buyers.length === 0) {
      console.log('  No buyers found');
    } else {
      for (const buyer of buyers) {
        const transactions = await Transaction.countDocuments({ buyer: buyer._id });
        console.log(`  Name: ${buyer.name}`);
        console.log(`  Email: ${buyer.email}`);
        console.log(`  Phone: ${buyer.phone}`);
        console.log(`  Transactions: ${transactions}`);
        console.log(`  Total Savings: ₹${buyer.stats?.totalSavings || 0}`);
        console.log(`  Created: ${buyer.createdAt.toLocaleDateString()}`);
        if (buyer.profileImage) console.log(`  Profile Image: ${buyer.profileImage}`);
        console.log('  ─────────────────────');
      }
    }

    // Display Card Owners
    console.log('\n💳 CARD OWNERS:');
    console.log('─────────────────────────────────────');
    if (cardOwners.length === 0) {
      console.log('  No card owners found');
    } else {
      for (const owner of cardOwners) {
        const cards = await Card.countDocuments({ owner: owner._id });
        const transactions = await Transaction.countDocuments({ cardOwner: owner._id });
        console.log(`  Name: ${owner.name}`);
        console.log(`  Email: ${owner.email}`);
        console.log(`  Phone: ${owner.phone}`);
        console.log(`  Cards: ${cards}`);
        console.log(`  Transactions: ${transactions}`);
        console.log(`  Total Earnings: ₹${owner.stats?.totalEarnings || 0}`);
        console.log(`  Created: ${owner.createdAt.toLocaleDateString()}`);
        if (owner.profileImage) console.log(`  Profile Image: ${owner.profileImage}`);
        console.log('  ─────────────────────');
      }
    }

    // Display Cards
    const cards = await Card.find({}).populate('owner', 'name email');
    console.log(`\n💳 TOTAL CARDS: ${cards.length}`);
    console.log('─────────────────────────────────────');
    if (cards.length > 0) {
      cards.forEach(card => {
        console.log(`  ${card.bankName} - ${card.cardType} (****${card.lastFourDigits})`);
        console.log(`  Owner: ${card.owner.name} (${card.owner.email})`);
        console.log(`  Network: ${card.cardNetwork}`);
        console.log(`  Usage: ${card.currentUsage}/${card.usageLimit}`);
        console.log(`  Rating: ${card.rating}/5`);
        console.log(`  Discounts: ${card.availableDiscounts.length} platform(s)`);
        if (card.cardImage) console.log(`  Image: ${card.cardImage}`);
        console.log('  ─────────────────────');
      });
    }

    // Display Transactions
    const transactions = await Transaction.find({})
      .populate('buyer', 'name email')
      .populate('cardOwner', 'name email')
      .populate('card', 'bankName lastFourDigits');
    
    console.log(`\n📝 TOTAL TRANSACTIONS: ${transactions.length}`);
    console.log('─────────────────────────────────────');
    if (transactions.length > 0) {
      transactions.forEach(trans => {
        console.log(`  Product: ${trans.product.name}`);
        console.log(`  Buyer: ${trans.buyer?.name || 'N/A'}`);
        console.log(`  Card Owner: ${trans.cardOwner?.name || 'N/A'}`);
        console.log(`  Card: ${trans.card?.bankName} ****${trans.card?.lastFourDigits}`);
        console.log(`  Amount: ₹${trans.product.originalPrice}`);
        console.log(`  Discount: ₹${trans.discountAmount}`);
        console.log(`  Status: ${trans.status}`);
        console.log(`  Date: ${trans.createdAt.toLocaleDateString()}`);
        console.log('  ─────────────────────');
      });
    }

    console.log('\n========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listAllData();
