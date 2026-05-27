/**
 * Database Configuration
 * MongoDB connection setup
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const env = require('./environment');

const connectDB = async () => {
  try {
    logger.info('Connecting to MongoDB...');

    const mongoUri = env.MONGODB_URI;

    const connection = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });

    logger.info(
      `MongoDB connected successfully to ${connection.connection.host}:${connection.connection.port}/${connection.connection.name}`
    );

    return connection;
  } catch (error) {
    logger.error('MongoDB connection failed:', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
  logger.info('SIGINT received, disconnecting MongoDB...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectDB;
