require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const createAdmin = async () => {
  try {
    await connectDB();

    console.log('\n========================================');
    console.log('       ADMIN USER CREATOR');
    console.log('========================================\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log('\nIf you forgot the password, delete this admin from database first.\n');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Admin',
      email: 'admin@cardconnect.com',
      password: 'admin123',  // Change this to a secure password
      role: 'admin',
      phone: '1234567890',
      address: {
        street: 'Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        pincode: '000000'
      },
      isActive: true
    };

    const admin = await User.create(adminData);

    console.log('✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    admin@cardconnect.com');
    console.log('🔒 Password: admin123');
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
