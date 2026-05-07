/**
 * Test Running Guide
 * Instructions for running backend tests
 */

# SMS Backend Testing Guide

## 🧪 Testing Framework Setup

This project uses **Jest** for unit and integration testing with comprehensive coverage tracking.

---

## 📋 Test Structure

```
__tests__/
├── unit/
│   ├── services/          # Service logic tests
│   ├── models/            # Model schema tests
│   ├── middleware/        # Middleware tests
│   └── controllers/       # Controller tests (optional)
├── integration/
│   ├── api.integration.test.js        # API endpoint tests
│   ├── database.integration.test.js   # Database tests (optional)
│   └── services.integration.test.js   # Service integration (optional)
└── fixtures/
    └── testHelpers.js     # Shared test utilities & mock data
```

---

## 🚀 Running Tests

### Install Test Dependencies
```bash
cd backend
npm install --save-dev jest supertest
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test -- auth.service.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should mark student present"
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

### Run Only Unit Tests
```bash
npm test -- __tests__/unit/
```

### Run Only Integration Tests
```bash
npm test -- __tests__/integration/
```

---

## 📊 Test Files & Coverage

### Unit Tests (Currently Scaffolded)

| File | Purpose | Status |
|------|---------|--------|
| `auth.service.test.js` | Authentication logic | ✅ Scaffolded |
| `student.service.test.js` | Student operations | ✅ Scaffolded |
| `fee.service.test.js` | Fee management | ✅ Scaffolded |
| `attendance.service.test.js` | Attendance tracking | ✅ Scaffolded |
| `middleware.test.js` | Middleware functions | ✅ Scaffolded |
| `model.test.js` | Database models | ✅ Scaffolded |

### Integration Tests

| File | Purpose | Status |
|------|---------|--------|
| `api.integration.test.js` | API endpoints | ✅ Scaffolded |

---

## 🔧 Test Utilities

### Test Helpers (`testHelpers.js`)

#### Mock Data Available:
```javascript
mockUsers       // Admin, Teacher, Student
mockSchool      // Test school data
mockStudent     // Student fixture
mockClass       // Class fixture
mockSubject     // Subject fixture
mockFee         // Fee fixture
```

#### Utility Functions:
```javascript
generateTestToken(user, expiresIn)    // Generate JWT token
clearDatabase(models)                 // Clear collections
setupTestDB()                         // Connect to test DB
teardownTestDB()                      // Close DB connection
createMockRequest(overrides)          // Mock Express request
createMockResponse()                  // Mock Express response
createMockNext()                      // Mock next middleware
```

### Example Usage:
```javascript
const { mockUsers, generateTestToken, setupTestDB } = require('../../fixtures/testHelpers');

beforeAll(async () => {
  await setupTestDB();
});

it('should perform action', async () => {
  const token = generateTestToken(mockUsers.admin);
  // Use token in test
});
```

---

## 🧬 Test Examples

### Authentication Test
```javascript
describe('Auth Service', () => {
  it('should successfully login with valid credentials', async () => {
    const user = await User.create({
      email: 'test@school.com',
      password: 'hashedPassword',
      role: 'TEACHER',
    });
    
    const result = await authService.login('test@school.com', 'password');
    expect(result.accessToken).toBeDefined();
    expect(result.user._id).toEqual(user._id);
  });
});
```

### Service Test
```javascript
describe('Student Service', () => {
  it('should create student with valid data', async () => {
    const student = await studentService.createStudent({
      ...mockStudent,
      schoolId,
    });
    
    expect(student._id).toBeDefined();
    expect(student.rollNumber).toBeDefined();
  });
});
```

### API Integration Test
```javascript
describe('GET /api/v1/students', () => {
  it('should return students for authenticated user', async () => {
    const token = generateTestToken(mockUsers.teacher);
    const response = await request(app)
      .get('/api/v1/students')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

---

## 🎯 Test Coverage Goals

| Module | Target Coverage | Current |
|--------|-----------------|---------|
| Services | 80%+ | 🔄 In Progress |
| Models | 90%+ | 🔄 In Progress |
| Middleware | 85%+ | 🔄 In Progress |
| Routes | 75%+ | 🔄 In Progress |
| Utils | 85%+ | 🔄 In Progress |

---

## ⚙️ Jest Configuration

**jest.config.js:**
- Test environment: Node.js
- Coverage directory: `/coverage`
- Test timeout: 10 seconds
- Test pattern: `**/__tests__/**/*.test.js`

**jest.setup.js:**
- Sets test environment
- Mocks logger
- Configures test database
- Initializes test helpers

---

## 🔍 Debugging Tests

### Run Single Test with Debug
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output
```bash
npm test -- --verbose
```

### Show Test Names Only
```bash
npm test -- --listTests
```

### Debug Failing Test
```bash
npm test -- --detectOpenHandles
```

---

## 📦 Pre-requisites

1. **MongoDB**: Test database running (or use test instance)
2. **Redis**: Optional for caching tests (or mock)
3. **Node.js**: v16+
4. **Dependencies**: `npm install` completed

### Test Database Setup
```bash
# MongoDB test database
mongodb://localhost:27017/sms_test

# Redis test database (optional)
redis://localhost:6379/1
```

---

## ✅ Continuous Integration

To run tests in CI/CD pipeline:

```bash
# Install dependencies
npm ci

# Run tests with coverage
npm test -- --coverage --ci --maxWorkers=2

# Generate JUnit XML report
npm test -- --reporters=default --reporters=jest-junit
```

---

## 📝 Writing New Tests

### Test Template
```javascript
const { setupTestDB, teardownTestDB, clearDatabase, mockData } = 
  require('../../fixtures/testHelpers');

describe('Feature/Module Name', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase([Model]);
  });

  describe('Specific Feature', () => {
    it('should perform expected behavior', async () => {
      // Arrange
      const testData = { ...mockData };
      
      // Act
      const result = await functionUnderTest(testData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.property).toBe(expectedValue);
    });
  });
});
```

---

## 🐛 Common Issues & Solutions

### Issue: Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running or update test DB URI in `.env`

### Issue: Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:** Start Redis or mock Redis in tests

### Issue: Test Timeout
```
Jest did not exit one second after the test run has completed
```
**Solution:** Close database connections in `afterAll` hook

### Issue: Duplicate Key Error
```
MongoError: E11000 duplicate key error
```
**Solution:** Clear database between tests in `beforeEach` hook

---

## 📊 Test Execution Flow

1. Jest configuration loaded
2. Setup file runs (jest.setup.js)
3. Test suite loads
4. beforeAll hook runs
5. beforeEach hook runs
6. Test executes
7. afterEach hook runs (if defined)
8. afterAll hook runs
9. Coverage report generated

---

## 🎓 Best Practices

✅ **DO:**
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Clear database between tests
- Test edge cases
- Use fixtures for common data
- Keep tests isolated and independent

❌ **DON'T:**
- Create interdependent tests
- Use real external APIs
- Test implementation details
- Skip cleanup (teardown)
- Write overly complex tests
- Test multiple features in one test

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Testing Guide](https://docs.mongodb.com/manual/developer/testing/)

---

## 🤝 Contributing Tests

When adding new features:
1. Write tests first (TDD)
2. Implement feature
3. Verify tests pass
4. Maintain >80% coverage
5. Document test cases

---

**Happy Testing! 🧪**
