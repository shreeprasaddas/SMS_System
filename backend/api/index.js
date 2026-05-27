/**
 * Vercel Serverless Function Entry Point
 * Wraps the Express app for Vercel's serverless runtime
 */

require('dotenv').config();

const app = require('../src/app');
const connectDB = require('../src/config/database');
const logger = require('../src/utils/logger');

// Connect to MongoDB once (reused across warm invocations)
let isConnected = false;

const ensureDBConnection = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    logger.info('Database connected for serverless function');
  }
};

// Wrap the Express app for Vercel
module.exports = async (req, res) => {
  if (req.url !== '/health' && req.url !== '/api/v1/health') {
    await ensureDBConnection();
  }
  return app(req, res);
};
