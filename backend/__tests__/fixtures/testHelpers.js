/**
 * Test Utilities & Fixtures
 * Common test helpers and data
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const env = require('../../src/config/environment');

// Mock user data
const mockUsers = {
  admin: {
    _id: new mongoose.Types.ObjectId(),
    email: 'admin@test.school',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    status: 'ACTIVE',
    schoolId: new mongoose.Types.ObjectId(),
  },
  teacher: {
    _id: new mongoose.Types.ObjectId(),
    email: 'teacher@test.school',
    firstName: 'John',
    lastName: 'Teacher',
    role: 'TEACHER',
    status: 'ACTIVE',
    schoolId: new mongoose.Types.ObjectId(),
  },
  student: {
    _id: new mongoose.Types.ObjectId(),
    email: 'student@test.school',
    firstName: 'Jane',
    lastName: 'Student',
    role: 'STUDENT',
    status: 'ACTIVE',
    schoolId: new mongoose.Types.ObjectId(),
  },
};

// Generate test JWT token
const generateTestToken = (user, expiresIn = '1h') => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      schoolId: user.schoolId.toString(),
    },
    env.JWT_SECRET,
    { expiresIn }
  );
};

// Mock school data
const mockSchool = {
  code: 'TEST-001',
  schoolName: 'Test School',
  shortName: 'TS',
  schoolType: 'SECONDARY',
  affiliation: {
    board: 'CBSE',
    affiliationNumber: 'TEST-12345',
  },
  status: 'ACTIVE',
};

// Mock student data
const mockStudent = {
  firstName: 'Test',
  lastName: 'Student',
  email: 'test.student@school.com',
  dateOfBirth: new Date('2010-01-15'),
  gender: 'MALE',
  status: 'ACTIVE',
};

// Mock class data
const mockClass = {
  className: 'IX-A',
  classNumber: 9,
  section: 'A',
  capacity: 50,
  status: 'ACTIVE',
};

// Mock subject data
const mockSubject = {
  subjectName: 'Mathematics',
  subjectCode: 'MATH-01',
  description: 'Mathematics Subject',
  status: 'ACTIVE',
};

// Mock fee data
const mockFee = {
  feeType: 'TUITION',
  amount: 5000,
  dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
  status: 'PENDING',
};

// Clear test database
const clearDatabase = async (models = []) => {
  const { redis } = require('../../src/config/redis');
  
  try {
    // Clear Redis
    await redis.flushdb();
    
    // Clear MongoDB collections
    if (models.length > 0) {
      for (const model of models) {
        if (model.collection) {
          await model.collection.deleteMany({});
        }
      }
    }
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

// Setup test database
const setupTestDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
};

// Teardown test database
const teardownTestDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('Error closing test database:', error);
  }
};

// Mock request object
const createMockRequest = (overrides = {}) => {
  return {
    body: {},
    query: {},
    params: {},
    headers: { authorization: `Bearer ${generateTestToken(mockUsers.admin)}` },
    user: mockUsers.admin,
    ...overrides,
  };
};

// Mock response object
const createMockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
};

// Mock next function
const createMockNext = () => jest.fn();

module.exports = {
  mockUsers,
  mockSchool,
  mockStudent,
  mockClass,
  mockSubject,
  mockFee,
  generateTestToken,
  clearDatabase,
  setupTestDB,
  teardownTestDB,
  createMockRequest,
  createMockResponse,
  createMockNext,
};
