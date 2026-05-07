/**
 * Express Application Setup
 * Middleware registration and route mounting
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const env = require('./config/environment');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');

const app = express();

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Helmet: Set security headers
app.use(helmet());

// CORS: Cross-origin requests
const corsOptions = {
  origin: env.CORS_ORIGIN.split(','),
  credentials: env.CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};
app.use(cors(corsOptions));

// Rate Limiting: Prevent abuse
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ============================================================
// BODY PARSING MIDDLEWARE
// ============================================================

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// ============================================================
// REQUEST LOGGING
// ============================================================

app.use((req, res, next) => {
  logger.debug('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// ============================================================
// ROUTE MOUNTING
// ============================================================

// Mount all routes via aggregator
require('./routes/index')(app);

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler (must be after all route handlers)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================================
// SERVER STARTUP
// ============================================================

logger.info('Express app configured', {
  nodeEnv: env.NODE_ENV,
  apiPrefix: '/api/v1',
  corsOrigin: env.CORS_ORIGIN,
});

module.exports = app;
