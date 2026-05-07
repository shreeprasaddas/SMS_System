# Quick Reference

## Common Backend Imports

```javascript
// Database & ORM
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Express
const express = require('express');
const router = express.Router();

// Validation
const Joi = require('joi');

// Utilities
const { responseHelper } = require('../utils/responseHelper');
const { AppError } = require('../utils/errorHelper');
const logger = require('../utils/logger');

// Middleware
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');

// Services
const studentService = require('../services/student.service');
const feeService = require('../services/fee.service');

// Jobs & Queues
const Queue = require('bull');
const cron = require('node-cron');

// Hashing & JWT
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

// File Upload
const multer = require('multer');
const AWS = require('aws-sdk');

// Email & SMS
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Socket.IO
const io = require('socket.io');

// Environment
const env = require('../config/environment');
```

## Common Frontend Imports

```javascript
// React
import React, { useState, useEffect, useCallback } from 'react';
import { ReactNode } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// React Router
import { useNavigate, useParams, Link, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// Forms
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

// RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// UI & Styling
import clsx from 'clsx'; // className utilities
import tailwindcss from 'tailwindcss'; // CSS framework

// Icons
import { User, Edit, Delete, Plus, Search, Download } from 'lucide-react';

// Notifications
import toast from 'react-hot-toast';

// Date/Time
import dayjs from 'dayjs';

// HTTP Client
import axios from 'axios';

// Charts
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

// Tables
import { useTable, usePagination, useFilters } from '@tanstack/react-table';

// Custom Hooks
import { usePermission } from '../hooks/usePermission';
import { useAuth } from '../hooks/useAuth';
```

## Common API Patterns

### List with Pagination, Filters, Search

```javascript
// Backend
GET /api/v1/students?page=1&limit=20&classId=507f1f77&status=ACTIVE&search=john

// Controller
const { page = 1, limit = 20, classId, status, search } = req.query;
const filter = { schoolId: req.user.schoolId };
if (classId) filter.classId = classId;
if (status) filter.status = status;
if (search) filter.$text = { $search: search };

const skip = (page - 1) * limit;
const [students, total] = await Promise.all([
  Student.find(filter).skip(skip).limit(limit).lean(),
  Student.countDocuments(filter)
]);

return responseHelper.paginated(res, students, { page, limit, total });

// Frontend
const [filters, setFilters] = useState({ page: 1, limit: 20 });
const { data, isLoading } = useGetStudentsQuery(filters);
```

### Create with Validation

```javascript
// Backend
POST /api/v1/students
Body: { firstName: 'John', lastName: 'Doe', classId: '...', ... }

// Controller
const student = await Student.create({ ...req.body, schoolId: req.user.schoolId });
return responseHelper.created(res, student);

// Frontend
const [createStudent] = useCreateStudentMutation();
const onSubmit = async (data) => {
  try {
    await createStudent(data).unwrap();
    toast.success('Created');
  } catch (err) {
    toast.error(err?.data?.message);
  }
};
```

### Update with Partial Fields

```javascript
// Backend
PATCH /api/v1/students/:id
Body: { status: 'INACTIVE' }

// Controller
const student = await Student.findOneAndUpdate(
  { _id: req.params.id, schoolId: req.user.schoolId },
  req.body,
  { new: true, runValidators: true }
);

return responseHelper.success(res, student, 'Updated');

// Frontend
const [updateStudent] = useUpdateStudentMutation();
const onSubmit = async (data) => {
  try {
    await updateStudent({ id: studentId, ...data }).unwrap();
    toast.success('Updated');
  } catch (err) {
    toast.error(err?.data?.message);
  }
};
```

### Delete

```javascript
// Backend
DELETE /api/v1/students/:id

// Controller
const student = await Student.findOneAndDelete({
  _id: req.params.id,
  schoolId: req.user.schoolId
});

if (!student) throw new AppError('Not found', 404);
return responseHelper.success(res, null, 'Deleted');

// Frontend
const [deleteStudent] = useDeleteStudentMutation();
const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  try {
    await deleteStudent(id).unwrap();
    toast.success('Deleted');
  } catch (err) {
    toast.error(err?.data?.message);
  }
};
```

### Nested Resource

```javascript
// Backend
GET /api/v1/students/:id/attendance

// Controller
const student = await Student.findOne({
  _id: req.params.id,
  schoolId: req.user.schoolId
});

if (!student) throw new AppError('Not found', 404);

const attendance = await StudentAttendance.find({
  studentId: student._id,
  schoolId: req.user.schoolId
});

return responseHelper.success(res, attendance);

// Frontend
const { data: attendance } = useGetStudentAttendanceQuery(studentId);
```

### Bulk Operations

```javascript
// Backend
POST /api/v1/attendance/bulk-mark
Body: [
  { studentId: '...', status: 'PRESENT' },
  { studentId: '...', status: 'ABSENT' }
]

// Controller
const records = req.body.map(r => ({
  ...r,
  schoolId: req.user.schoolId,
  date: new Date()
}));

await StudentAttendance.insertMany(records);
return responseHelper.success(res, records, 'Attendance marked');

// Frontend
const [markAttendanceBulk] = useMarkAttendanceBulkMutation();
const onSubmit = async (attendanceData) => {
  try {
    await markAttendanceBulk(attendanceData).unwrap();
    toast.success('Marked for all');
  } catch (err) {
    toast.error(err?.data?.message);
  }
};
```

### Upload File

```javascript
// Backend
POST /api/v1/students/:id/documents
Body: FormData with file

// Middleware
router.post('/:id/documents',
  authenticate,
  authorize(['ADMIN']),
  upload.single('file'),
  studentController.uploadDocument
);

// Controller
const file = req.file;
const s3 = new AWS.S3();
const params = {
  Bucket: process.env.AWS_S3_BUCKET,
  Key: `documents/${Date.now()}-${file.originalname}`,
  Body: file.buffer
};

const result = await s3.upload(params).promise();
const document = await StudentDocument.create({
  studentId: req.params.id,
  schoolId: req.user.schoolId,
  filename: file.originalname,
  url: result.Location
});

return responseHelper.created(res, document);

// Frontend
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(
      `/api/v1/students/${studentId}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    toast.success('Uploaded');
  } catch (err) {
    toast.error('Upload failed');
  }
};
```

## Common Status Codes

| Code | Usage | Example |
|------|-------|---------|
| 200 | GET success, PATCH success | `{ success: true, data: {...} }` |
| 201 | POST success (created) | `{ success: true, message: 'Created', data: {...} }` |
| 204 | DELETE success (no content) | Empty response |
| 400 | Validation error, bad request | `{ success: false, message: 'Email is required' }` |
| 401 | Not authenticated | `{ success: false, message: 'No token' }` |
| 403 | Not authorized | `{ success: false, message: 'Access denied' }` |
| 404 | Not found | `{ success: false, message: 'Student not found' }` |
| 409 | Conflict (duplicate) | `{ success: false, message: 'Email already exists' }` |
| 422 | Unprocessable entity | `{ success: false, message: 'Invalid data' }` |
| 429 | Too many requests (rate limited) | Retry later |
| 500 | Server error | `{ success: false, message: 'Internal error' }` |
| 503 | Service unavailable | Temporarily down |

## Useful CLI Commands

### Backend

```bash
# Start server
npm start
npm run dev      # with nodemon

# Run tests
npm test
npm test -- --watch

# Seed database
npm run seed

# Backup database
npm run backup:db

# Generate API docs
npm run docs
```

### Frontend

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
npm test -- --watch

# Lint
npm run lint

# Format code
npm run format
```

### Docker

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Clean up
docker-compose down -v  # removes volumes too
```

## Environment Setup (.env)

```bash
# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sms
JWT_SECRET=your-secret-key-12345
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh-secret
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
AWS_S3_BUCKET=sms-files
RAZORPAY_KEY=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret
TWILIO_SID=your-twilio-sid
TWILIO_TOKEN=your-twilio-token
MAIL_USER=noreply@school.com
MAIL_PASSWORD=email-password
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_KEY=your-key
REACT_APP_ENV=development
```

---

**End of Quick Reference**
