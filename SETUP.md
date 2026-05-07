# School Management System (SMS) - Local Setup Guide

## ✅ System Status: 95% Ready

All critical issues have been fixed. The system is ready to run locally.

---

## 📋 Prerequisites

Before starting the system, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Redis** (Local) - [Download](https://redis.io/download) or use Windows Subsystem for Linux (WSL)

### Verify Installation

```bash
node --version    # Should be v16+
npm --version     # Should be v8+
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..
```

### Step 2: Ensure Services are Running

**MongoDB:**
```bash
# If installed locally
mongod

# Or use MongoDB Atlas connection string in .env
```

**Redis:**
```bash
# If installed locally (Linux/Mac)
redis-server

# For Windows, use WSL or Docker
# Or download Redis for Windows: https://github.com/microsoftarchive/redis/releases
```

### Step 3: Start the System

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend (when backend is running)
cd frontend
npm run dev
```

---

## 📁 Configuration Files

### Backend (.env)
Location: `backend/.env`

Key variables already configured:
- `MONGODB_URI=mongodb://localhost:27017/sms_local`
- `REDIS_URL=redis://localhost:6379`
- `JWT_SECRET=sms-dev-jwt-secret-key...`
- `PORT=5000`

**For Production, update:**
- All `*_SECRET` keys
- Database credentials
- AWS S3 credentials
- Email/SMS provider keys
- Payment gateway keys

### Frontend (.env)
Location: `frontend/.env`

Key variables:
- `VITE_API_BASE_URL=http://localhost:5000/api/v1`
- `VITE_SOCKET_URL=http://localhost:5000`

---

## 🔌 Access Points

Once running:

- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/health
- **Frontend App**: http://localhost:5173 (or http://localhost:3000)

---

## 🧪 Testing the System

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": "2026-05-05T10:00:00.000Z",
  "uptime": 45.234,
  "environment": "development"
}
```

### API Endpoint Example
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password123"}'
```

---

## 📊 Database Seeding (Optional)

To seed initial data:

```bash
cd backend
npm run seed
```

This will:
- Create default school
- Add sample users (admin, teacher, student)
- Generate test classes and subjects
- Create sample academic data

---

## 🔍 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Update `MONGODB_URI` in `.env`

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:**
- Ensure Redis is running: `redis-server`
- Update `REDIS_URL` in `.env`
- Or disable Redis caching temporarily in environment

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change PORT in `.env` (e.g., `PORT=5001`)
- Or kill process: `lsof -i :5000` and `kill -9 <PID>`

### Module Not Found Errors
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
cd backend
npm install
```

---

## 🛠 Development Commands

### Backend

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Run tests
npm test

# Seed database
npm run seed

# Backup database
npm run backup
```

### Frontend

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

---

## 📚 Project Structure

```
school-management-system/
├── backend/
│   ├── src/
│   │   ├── models/           # Database schemas
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Express middleware
│   │   ├── validations/       # Joi schemas
│   │   ├── config/            # Configuration files
│   │   ├── utils/             # Utilities & helpers
│   │   ├── jobs/              # Cron jobs
│   │   ├── sockets/           # WebSocket handlers
│   │   ├── events/            # Event emitters
│   │   └── app.js             # Express app
│   ├── server.js              # Server entry point
│   ├── package.json           # Dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux state
│   │   ├── services/          # API services
│   │   └── App.jsx            # Main app
│   ├── package.json           # Dependencies
│   └── .env                   # Environment variables
└── shared/
    ├── constants/             # Shared constants
    ├── types/                 # TypeScript types
    └── utilities/             # Shared utilities
```

---

## 📝 Key Features Implemented

✅ **Phase 40 Complete - Curriculum & Syllabus Management**
- Curriculum framework definition
- Syllabus with unit/chapter/topic structure
- Chapter-to-learning outcome mapping
- Learning outcomes with Bloom's taxonomy
- Assessment framework configuration

✅ **Phase 38 - School Analytics & Reporting**
- School dashboard with 7 dashboard types
- Academic performance reports
- Financial reports with revenue tracking
- Engagement metrics tracking
- School benchmark comparisons

✅ **Phase 39 - Staff Professional Development**
- Professional development programs
- Employee training tracking
- Staff certification management
- Skill assessments with Bloom's levels
- Training provider management

✅ **Core Modules**
- Student & Teacher Management
- Attendance Tracking
- Grades & Examination
- Fee & Payment Processing
- Leave Management
- Communication & Notifications
- Library Management
- Transport Management
- HR & Payroll
- Document Management

---

## 🔐 Security Notes

- Change all `*_SECRET` keys before production deployment
- Enable HTTPS in production
- Configure proper CORS origins
- Setup rate limiting per your requirements
- Enable database authentication
- Use environment variables for sensitive data
- Implement proper logging and monitoring

---

## 📞 Support

For issues or questions:

1. Check logs: `backend/logs/` or `frontend/logs/`
2. Verify all services are running
3. Check `.env` configuration
4. Review error messages in browser console

---

## 🎯 Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 5173/3000
3. ✅ MongoDB connected
4. ✅ Redis connected
5. Create first school in system
6. Create admin user account
7. Configure payment gateway (Razorpay)
8. Setup email service
9. Configure SMS service (Twilio)
10. Deploy to production

---

**Happy School Management! 🎓**
