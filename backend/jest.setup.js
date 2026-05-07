/**
 * Jest Setup File
 * Global configuration and helpers for tests
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/sms_test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Mock logger
jest.mock('./src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Increase timeout for database operations
jest.setTimeout(30000);

// Global teardown
afterAll(async () => {
  // Cleanup
  jest.clearAllMocks();
});
