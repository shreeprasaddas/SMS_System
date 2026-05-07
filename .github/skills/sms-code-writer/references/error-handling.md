# Error Handling

## Backend: AppError Class

**Location:** `backend/src/utils/errorHelper.js`

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from programming errors
  }
}

module.exports = AppError;
```

### Usage in Controllers

```javascript
const { AppError } = require('../utils/errorHelper');

// ✅ Correct — throw AppError with message and status
if (!student) {
  throw new AppError('Student not found', 404);
}

if (!req.user.can('DELETE_STUDENT')) {
  throw new AppError('Access denied', 403);
}

if (fee.amount > 0 && !req.body.paymentMethod) {
  throw new AppError('Payment method required for fees', 400);
}

// Always wrap in try/catch
try {
  // ... logic ...
} catch (err) {
  next(err); // Pass to global error middleware
}
```

## Global Error Middleware

**Location:** `backend/src/app.js`

```javascript
const express = require('express');
const app = express();

// ... routes ...

// Global error handler (must be LAST middleware)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : 'Internal server error';

  // Log error
  logger.error({
    error: err.message,
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
});

module.exports = app;
```

## Validation Errors

Joi validation errors should be caught by validation middleware:

```javascript
// middleware/validation.middleware.js
const { AppError } = require('../utils/errorHelper');

exports.validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    // Extract first validation error
    const message = error.details[0].message;
    return next(new AppError(message, 400));
  }

  // Replace body with validated data
  req.body = value;
  next();
};

// Usage in route
router.post('/',
  validate(createStudentSchema),
  studentController.createStudent
);
```

## Frontend: RTK Query Error Handling

### Using Error State

```jsx
import { useGetStudentsQuery } from '../store/api/studentApi';
import toast from 'react-hot-toast';

const StudentList = () => {
  const { data, isLoading, isError, error } = useGetStudentsQuery();

  if (isError) {
    const errorMsg = error?.data?.message || error?.error || 'Failed to load';
    return (
      <EmptyState 
        message={errorMsg} 
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  return <StudentListTable data={data?.data} />;
};
```

### Mutation Error Handling

```jsx
const StudentForm = () => {
  const [createStudent, { isLoading, isError, error }] = useCreateStudentMutation();

  const onSubmit = async (data) => {
    try {
      const result = await createStudent(data).unwrap();
      toast.success('Student created');
    } catch (err) {
      // err.data = { success: false, message: '...' }
      const message = err?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </Button>
      {isError && <div className="text-red-600">{error?.data?.message}</div>}
    </form>
  );
};
```

### Query Auto-Refetch on Error

```javascript
const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: baseQueryWithRetry,
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (params) => ({ url: '/students', params }),
      // Retry failed requests
      queryFn: async (args, api, extraOptions, baseQuery) => {
        let result = await baseQuery(args);
        if (result.error?.status === 429) {
          // Exponential backoff on rate limit
          await new Promise(resolve => setTimeout(resolve, 1000));
          result = await baseQuery(args);
        }
        return result;
      }
    })
  })
});
```

## Logging

**Location:** `backend/src/utils/logger.js`

```javascript
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sms-api' },
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log')
    })
  ]
});

// Console output in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Usage

```javascript
const logger = require('../utils/logger');

// ✅ Use logger instead of console.log
logger.info('Student created', { studentId, schoolId });
logger.warn('Attendance marked late', { studentId, timestamp });
logger.error('Payment failed', { studentId, reason: err.message });

// ❌ Never log sensitive data
logger.info(`User logged in with password ${password}`); // WRONG!
logger.info(`User ${email} logged in`);                   // ✅ Correct

// Mask sensitive fields
const maskedAadhaar = '****' + aadhaar.slice(-4);
logger.info('Student data updated', { maskedAadhaar });
```

## Common Error Patterns

### Not Found (404)

```javascript
const student = await Student.findById(studentId);
if (!student) {
  throw new AppError('Student not found', 404);
}
```

### Access Denied (403)

```javascript
if (!req.user.roles.includes('ADMIN')) {
  throw new AppError('Access denied', 403);
}
```

### Validation Error (400)

```javascript
if (amount <= 0) {
  throw new AppError('Amount must be greater than 0', 400);
}
```

### Duplicate (409)

```javascript
try {
  await Student.create({ ...data, studentId });
} catch (err) {
  if (err.code === 11000) {
    throw new AppError('Student ID already exists', 409);
  }
  throw err;
}
```

### Unauthorized (401)

```javascript
if (!token) {
  throw new AppError('No authentication token', 401);
}

const decoded = jwt.verify(token, secret);
if (!decoded) {
  throw new AppError('Invalid token', 401);
}
```

### Server Error (500)

```javascript
// Only for truly unexpected errors
if (somethingVeryUnexpected) {
  logger.error('Unexpected error:', err);
  throw new AppError('Internal server error', 500);
}
```

## Response Format (Always Consistent)

All responses (success or error) follow the same shape:

### Success Response

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": { "_id": "...", "name": "..." },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed: Email is required"
}
```

### In Development

Error responses also include stack trace:

```json
{
  "success": false,
  "message": "Student not found",
  "error": {
    "stack": "Error: Student not found\n at StudentController..."
  }
}
```

## Error Recovery Strategies

### Retry Logic (Frontend)

```javascript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url, options = {}, attempt = 1) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (attempt < MAX_RETRIES && err.response?.status >= 500) {
      await new Promise(resolve => 
        setTimeout(resolve, RETRY_DELAY * attempt)
      );
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw err;
  }
}
```

### Graceful Degradation

```jsx
// Show cached data while retrying
const StudentList = () => {
  const { data, isLoading, isError, error } = useGetStudentsQuery();

  if (isError) {
    return (
      <div>
        <div className="alert alert-error">
          {error.message}
        </div>
        {data && (
          <div className="alert alert-info">
            Showing cached data — trying to refresh...
          </div>
        )}
        {data && <StudentListTable data={data?.data} />}
      </div>
    );
  }

  return <StudentListTable data={data?.data} />;
};
```

### Circuit Breaker Pattern

```javascript
// For APIs that might be temporarily down
class CircuitBreaker {
  constructor(fn, { threshold = 5, timeout = 60000 } = {}) {
    this.fn = fn;
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED → OPEN → HALF_OPEN → CLOSED
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await this.fn(...args);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      setTimeout(() => {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      }, this.timeout);
    }
  }
}
```

---

**End of Error Handling**
