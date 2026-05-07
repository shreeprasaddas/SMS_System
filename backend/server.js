/**
 * Server Entry Point
 * Starts Express server and initializes connections
 */

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');
const env = require('./src/config/environment');
const { redis } = require('./src/config/redis');

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

// ============================================================
// SERVER STARTUP
// ============================================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info('Initializing database connection...');
    await connectDB();

    // Check Redis connection (non-blocking - don't wait for it)
    logger.info('Checking Redis connection...');
    redis.ping().catch((err) => {
      logger.warn('Redis connection failed on startup, will retry automatically:', err.message);
    });

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`Server started successfully`, {
        port: PORT,
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
      });
    });

    // ============================================================
    // SOCKET.IO SETUP
    // ============================================================

    const io = require('socket.io')(server, {
      cors: {
        origin: env.CORS_ORIGIN.split(','),
        credentials: env.CORS_CREDENTIALS,
      },
    });

    // Socket authentication middleware
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('No authentication token'));
      }
      // TODO: Verify token and attach user info to socket
      next();
    });

    // Socket event handlers
    require('./src/sockets/socket.socket')(io);

    logger.info('Socket.IO initialized');

    // ============================================================
    // GRACEFUL SHUTDOWN
    // ============================================================

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        // Close database connection
        try {
          await require('mongoose').connection.close();
          logger.info('MongoDB connection closed');
        } catch (err) {
          logger.error('Error closing MongoDB:', err);
        }

        // Close Redis connection
        try {
          await redis.quit();
          logger.info('Redis connection closed');
        } catch (err) {
          logger.error('Error closing Redis:', err);
        }

        logger.info('Server shutdown complete');
        process.exit(0);
      });

      // Force exit after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown timeout');
        process.exit(1);
      }, 30000);
    };

    // Handle signals for graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ============================================================
    // SCHEDULED JOBS (Cron)
    // ============================================================

    const JobScheduler = require('./src/config/scheduler');
    JobScheduler.initializeJobs();
  } catch (error) {
    logger.error('Failed to start server:', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Start the server
startServer();
