# Testing Quick Reference Card

## 🚀 Start Here

```bash
# 1. Install test dependencies
npm install --save-dev jest supertest

# 2. Verify setup
node verify-tests.js

# 3. Run all tests (scaffolded - will show pending)
npm test
```

---

## 📋 Common Commands

### Run Tests
```bash
npm test                              # Run all tests once
npm run test:watch                   # Run in watch mode
npm run test:coverage                # Generate coverage report
```

### Filter Tests
```bash
npm run test:unit                    # Run unit tests only
npm run test:integration             # Run integration tests only
npm test -- auth.service.test.js    # Run specific file
npm test -- --testNamePattern="login" # Run matching pattern
```

### Debug & Development
```bash
npm run test:debug                   # Debug with Node inspector
npm test -- --verbose                # Detailed output
npm test -- --listTests              # Show all test files
npm test -- --detectOpenHandles      # Find unclosed handles
```

### Interactive Menu (Recommended)
```bash
# Windows
run-tests.bat

# Linux/Mac
bash run-tests.sh
```

---

## 📊 Test Files

| File | Tests | Focus |
|------|-------|-------|
| auth.service.test.js | 11 | Login, tokens, MFA |
| student.service.test.js | 16 | CRUD, attendance, grades |
| fee.service.test.js | 12 | Fees, payments, refunds |
| attendance.service.test.js | 13 | Marking, reports, sync |
| grade.service.test.js | 16 | Recording, analysis, GPA |
| curriculum.service.test.js | 18 | Syllabus, outcomes, assessment |
| analytics.service.test.js | 25 | Dashboard, reports, benchmarks |
| middleware.test.js | 22 | Auth, validation, errors |
| model.test.js | 18 | Schema, indexes, virtuals |
| api.integration.test.js | 18 | Endpoints, CORS, validation |
| database.integration.test.js | 24 | Connection, CRUD, transactions |
| **TOTAL** | **163+** | **All areas** |

---

## 🧪 Test Structure

```javascript
describe('Feature Area', () => {
  beforeAll(async () => {
    // Setup for all tests in suite
  });

  afterAll(async () => {
    // Cleanup after all tests
  });

  beforeEach(async () => {
    // Setup before each test
  });

  describe('Specific Feature', () => {
    it('should behave as expected', async () => {
      // Arrange: Setup test data
      const input = { };
      
      // Act: Execute function
      const result = await functionUnderTest(input);
      
      // Assert: Verify results
      expect(result).toBeDefined();
    });
  });
});
```

---

## 🛠️ Test Utilities

### Available Mock Data
```javascript
const { 
  mockUsers,      // { admin, teacher, student }
  mockSchool,     // School object
  mockStudent,    // Student with enrollment
  mockClass,      // Class configuration
  mockSubject,    // Subject details
  mockFee,        // Fee record
  generateTestToken,
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createMockRequest,
  createMockResponse,
  createMockNext,
} = require('../../fixtures/testHelpers');
```

### Usage Example
```javascript
it('should login successfully', async () => {
  // Generate token
  const token = generateTestToken(mockUsers.teacher);
  
  // Clear DB
  await clearDatabase([User]);
  
  // Create test data
  const user = await User.create(mockUsers.teacher);
  
  // Run test
  // ...
});
```

---

## 📖 Documentation Files

- **TESTING.md** - Complete testing guide (300+ lines)
- **TESTING-SETUP.md** - Setup & quick start (400+ lines)
- **COMPLETE-TESTING-SUMMARY.md** - Full status report
- **TESTING-IMPLEMENTATION-STATUS.md** - Implementation guide

---

## ✅ Test Coverage Areas

### Authentication (11 tests)
- ✅ User login
- ✅ Token generation & refresh
- ✅ Password hashing & verification
- ✅ MFA/TOTP
- ✅ Account locking

### Students (16 tests)
- ✅ Create/Read/Update/Delete
- ✅ Auto roll number generation
- ✅ Attendance tracking
- ✅ Grade retrieval
- ✅ Status management

### Finance (12 tests)
- ✅ Fee recording
- ✅ Payment processing
- ✅ Receipt generation
- ✅ Refund handling
- ✅ Defaulter identification

### Attendance (13 tests)
- ✅ Manual marking
- ✅ Biometric sync
- ✅ Percentage calculation
- ✅ Reports generation
- ✅ Bulk operations

### Grades (16 tests)
- ✅ Grade recording
- ✅ Letter grade assignment
- ✅ GPA calculation
- ✅ Transcript generation
- ✅ Performance analysis

### Curriculum (18 tests)
- ✅ Curriculum creation
- ✅ Syllabus mapping
- ✅ Learning outcomes
- ✅ Assessment framework
- ✅ Validation

### Analytics (25 tests)
- ✅ Dashboard metrics
- ✅ Academic analysis
- ✅ Financial reports
- ✅ Engagement scoring
- ✅ Benchmarking

### Middleware (22 tests)
- ✅ Authentication
- ✅ Authorization
- ✅ Validation
- ✅ Error handling
- ✅ Rate limiting

### Models (18 tests)
- ✅ Schema validation
- ✅ Index verification
- ✅ Virtual fields
- ✅ Pre-save hooks
- ✅ Relationships

### API (18 tests)
- ✅ Health checks
- ✅ Authentication routes
- ✅ CORS handling
- ✅ Rate limiting
- ✅ Error responses

### Database (24 tests)
- ✅ Connection management
- ✅ CRUD operations
- ✅ Validation enforcement
- ✅ Index effectiveness
- ✅ Transactions

---

## 🔍 Debugging Tips

### Test Fails - What to Check
1. **MongoDB not running?**
   ```bash
   # Start MongoDB (Windows)
   mongod
   ```

2. **Redis not running?**
   ```bash
   # Start Redis
   redis-server
   ```

3. **Test timeout?**
   ```bash
   # Increase timeout in jest.config.js or add cleanup
   await clearDatabase([Model]);
   ```

4. **Port in use?**
   ```bash
   # Change port in .env or kill process
   lsof -ti:5000 | xargs kill -9  # Linux/Mac
   netstat -ano | findstr :5000    # Windows
   ```

### Debug Single Test
```bash
npm run test:debug
# Opens Chrome DevTools at chrome://inspect
```

---

## 📊 Coverage Reports

### Generate Report
```bash
npm run test:coverage
```

### View Report
```bash
# Open in browser
# Linux/Mac:
open coverage/lcov-report/index.html

# Windows:
start coverage/lcov-report/index.html
```

### Coverage Goals
- Services: 80%+
- Models: 90%+
- Middleware: 85%+
- Routes: 75%+
- Utils: 85%

---

## 🚦 Test Status Indicators

### ✅ Passing
```
 PASS  __tests__/unit/models/model.test.js
```

### ⏳ Pending (Scaffolded - Needs Implementation)
```
 PASS  __tests__/unit/services/auth.service.test.js
  Auth Service
    User Login
      ○ should successfully login with valid credentials
```

### ❌ Failing
```
 FAIL  __tests__/unit/services/student.service.test.js
  ● Create Student › should create student with valid data
    Error: expected to be defined
```

### ⚠️ Skipped
```
  Auth Service
    ○ should skip this test for now
```

---

## 📝 Implementation Workflow

### Step 1: Choose Test File
```bash
cd __tests__/unit/services/
ls -la
# Pick one, e.g., auth.service.test.js
```

### Step 2: Replace TODO with Implementation
```javascript
// BEFORE:
it('should successfully login', async () => {
  // Implement test
});

// AFTER:
it('should successfully login', async () => {
  const user = await User.create({
    email: 'test@school.com',
    password: 'hashedPassword',
  });
  
  const result = await authService.login(
    'test@school.com',
    'password'
  );
  
  expect(result.accessToken).toBeDefined();
  expect(result.user._id).toEqual(user._id);
});
```

### Step 3: Run Test
```bash
npm test -- auth.service.test.js
```

### Step 4: Make It Pass
- If test fails, implement the feature
- If test passes, move to next

### Step 5: Repeat
- Continue with next test
- Track progress
- Commit regularly

---

## 🎯 Recommended Implementation Order

1. **Models First** (Easy)
   - `model.test.js` - 18 tests

2. **Middleware Next** (Medium)
   - `middleware.test.js` - 22 tests

3. **Services** (Longest)
   - `auth.service.test.js` - 11 tests ⭐ Start here
   - `student.service.test.js` - 16 tests
   - `fee.service.test.js` - 12 tests
   - `attendance.service.test.js` - 13 tests
   - `grade.service.test.js` - 16 tests
   - `curriculum.service.test.js` - 18 tests
   - `analytics.service.test.js` - 25 tests

4. **Integration Last** (Medium)
   - `api.integration.test.js` - 18 tests
   - `database.integration.test.js` - 24 tests

---

## ⚡ Performance Tips

### Optimize Test Runs
```bash
# Run only changed tests
npm test -- --onlyChanged

# Run tests in parallel (faster)
npm test -- --maxWorkers=4

# Skip coverage (faster)
npm test -- --no-coverage
```

### Faster Test Database
- Use in-memory MongoDB if available
- Or use test instance with less data

---

## 🐛 Common Errors & Fixes

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Start MongoDB/Redis |
| `Jest timeout` | Increase timeout or cleanup |
| `Cannot find module` | Run `npm install` |
| `Duplicate key error` | Run `clearDatabase()` in beforeEach |
| `Port in use` | Kill process or change port |

---

## 📞 Help

```bash
# Show Jest help
npm test -- --help

# Show available tests
npm test -- --listTests

# Show configuration
npm test -- --showConfig
```

---

## ✨ Quick Stats

- **Total Tests:** 163+
- **Test Suites:** 11
- **Documentation:** 1000+ lines
- **Mock Objects:** 5+
- **Helper Functions:** 7+
- **npm Scripts:** 6
- **Coverage Target:** 80%+
- **Time to Implement:** ~30-40 hours

---

**Happy Testing! 🧪**

Last Updated: May 5, 2026
