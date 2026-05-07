/**
 * Environment Configuration
 * Centralized environment variables
 */

module.exports = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  APP_NAME: process.env.APP_NAME || 'SMS Backend',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sms',
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',

  // TOTP/MFA
  TOTP_WINDOW: parseInt(process.env.TOTP_WINDOW || '1'),
  TOTP_TIME_STEP: parseInt(process.env.TOTP_TIME_STEP || '30'),

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:3000',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',

  // AWS S3
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_S3_URL: process.env.AWS_S3_URL,

  // Email
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: parseInt(process.env.MAIL_PORT || '587'),
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || 'School Management System',
  MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL || 'noreply@sms.school',

  // SMS (Twilio)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  // Payments
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY,

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png').split(','),

  // Pagination
  DEFAULT_PAGE_LIMIT: parseInt(process.env.DEFAULT_PAGE_LIMIT || '20'),
  MAX_PAGE_LIMIT: parseInt(process.env.MAX_PAGE_LIMIT || '100'),

  // API
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',

  // Session
  SESSION_EXPIRY: process.env.SESSION_EXPIRY || '24h',
  SESSION_REFRESH_THRESHOLD: process.env.SESSION_REFRESH_THRESHOLD || '1h',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 min
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),

  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  // Scheduler
  ENABLE_SCHEDULER: process.env.ENABLE_SCHEDULER === 'true',
  SCHEDULER_TIMEZONE: process.env.SCHEDULER_TIMEZONE || 'Asia/Kolkata',

  // Backup
  BACKUP_ENABLED: process.env.BACKUP_ENABLED === 'true',
  BACKUP_SCHEDULE: process.env.BACKUP_SCHEDULE || '0 2 * * *', // 2 AM daily

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Maps
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,

  // Error Tracking
  SENTRY_DSN: process.env.SENTRY_DSN,

  // Debug
  DEBUG: process.env.DEBUG === 'true',
  VERBOSE_LOGGING: process.env.VERBOSE_LOGGING === 'true',

  // Utility flags
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test',
};
