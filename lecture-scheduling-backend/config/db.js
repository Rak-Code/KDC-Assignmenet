// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Retry logic
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  }
};

module.exports = connectDB;