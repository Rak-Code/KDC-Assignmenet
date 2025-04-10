// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Create default users
const createDefaultUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create instructor user
    const instructor = await User.create({
      name: 'John Doe',
      email: 'instructor@example.com',
      password: 'instructor123',
      role: 'instructor'
    });

    console.log('Default users created:');
    console.log('Admin:', { email: admin.email, password: 'admin123' });
    console.log('Instructor:', { email: instructor.email, password: 'instructor123' });
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run seeder
createDefaultUsers();