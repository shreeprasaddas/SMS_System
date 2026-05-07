/**
 * Redis Configuration
 * Cache and job queue setup
 */

const Redis = require('ioredis');
const logger = require('../utils/logger');
const env = require('./environment');

// Parse Redis URL
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const redis = new Redis(redisOptions);

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

redis.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

// Cache helper functions
const redisCache = {
  /**
   * Get value from cache
   */
  get: async (key) => {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      logger.error(`Cache get error for key ${key}:`, err);
      return null;
    }
  },

  /**
   * Set value in cache
   */
  set: async (key, value, expirySeconds = 3600) => {
    try {
      await redis.setex(key, expirySeconds, JSON.stringify(value));
      return true;
    } catch (err) {
      logger.error(`Cache set error for key ${key}:`, err);
      return false;
    }
  },

  /**
   * Delete from cache
   */
  delete: async (key) => {
    try {
      await redis.del(key);
      return true;
    } catch (err) {
      logger.error(`Cache delete error for key ${key}:`, err);
      return false;
    }
  },

  /**
   * Clear all cache matching pattern
   */
  deletePattern: async (pattern) => {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (err) {
      logger.error(`Cache delete pattern error for ${pattern}:`, err);
      return false;
    }
  },

  /**
   * Increment counter
   */
  increment: async (key, expirySeconds = 3600) => {
    try {
      const result = await redis.incr(key);
      if (result === 1) {
        await redis.expire(key, expirySeconds);
      }
      return result;
    } catch (err) {
      logger.error(`Cache increment error for key ${key}:`, err);
      return 0;
    }
  },

  /**
   * Flush all cache
   */
  flushAll: async () => {
    try {
      await redis.flushall();
      logger.info('All cache cleared');
      return true;
    } catch (err) {
      logger.error('Cache flush error:', err);
      return false;
    }
  },
};

module.exports = { redis, cache: redisCache };
