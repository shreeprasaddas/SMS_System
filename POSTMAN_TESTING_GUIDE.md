# Backend API Testing Guide - Postman

## ✅ Status
- **Backend Server:** http://localhost:5000 ✅ Running
- **Database:** MongoDB ✅ Connected
- **Phone Field:** 🔧 Now Optional

## Quick Start

### 1. Import Postman Collection
- File: `SMS-Backend-API.postman_collection.json` (in root directory)
- Open Postman → Import → Select the collection file
- All 5 endpoints ready to test

### 2. Test Register WITHOUT Phone
**You can now register without providing a phone number!**

---

## Backend API Endpoints

### 🏥 Health Check
**Endpoint:** `GET http://localhost:5000/health`
**Status:** ✅ Working

**Request:** No body needed
**Response:** 200 OK
```json
{
  "status": "UP",
  "timestamp": "2026-05-05T11:21:46.199Z",
  "uptime": 64.80,
  "environment": "development"
}
```

---

### 🔐 Authentication Endpoints

#### 1. Register User ✅ NOW WORKS WITHOUT PHONE
**Endpoint:** `POST http://localhost:5000/api/v1/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body (Phone is OPTIONAL):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "role": "STUDENT",
  "schoolId": "school_001"
}
```

**Valid Roles:**
- ADMIN
- PRINCIPAL
- VICE_PRINCIPAL
- TEACHER
- STUDENT ✅ (recommended for testing)
- PARENT
- LIBRARIAN
- ACCOUNTANT
- TRANSPORT_MANAGER
- HOSTEL_MANAGER
- HR_MANAGER

**Expected Response:** 201 Created
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "schoolId": "school_001"
    }
  }
}
```

---

#### 2. Login
**Endpoint:** `POST http://localhost:5000/api/v1/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password@123"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "role": "STUDENT"
    }
  }
}
```

---

#### 3. Refresh Token
**Endpoint:** `POST http://localhost:5000/api/v1/auth/refresh-token`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {refreshToken}
```

**Request Body:** `{}`

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 4. Forgot Password
**Endpoint:** `POST http://localhost:5000/api/v1/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

---

#### 5. Reset Password
**Endpoint:** `POST http://localhost:5000/api/v1/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "{resetToken}",
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 🧪 Complete Testing Workflow

Follow these steps in order:

### Step 1: Health Check
1. Open Postman
2. Import `SMS-Backend-API.postman_collection.json`
3. Run **Health Check** → Should return status "UP" ✅

### Step 2: Register New User
1. Click **Register** request
2. Modify email in request body (e.g., `test1@example.com`)
3. Send request
4. ✅ Should return 201 Created with user data

### Step 3: Login
1. Click **Login** request
2. Use same email/password from registration
3. Send request
4. ✅ Copy the `accessToken` from response

### Step 4: Use Access Token (For Protected Routes)
1. Go to any protected endpoint
2. Add header: `Authorization: Bearer {accessToken}`
3. Send request

---

## 🔧 What Changed

### Phone Field - NOW OPTIONAL ✅
- **Before:** Phone was required, registration failed without it
- **After:** Phone is optional, can register without providing it
- **Status:** Backend automatically reloaded with nodemon

---

## 📝 Notes

- **Token Expiry:** 7 days (configurable in `.env`)
- **Password Minimum:** 6 characters
- **Email Format:** Must be valid email
- **Passwords:** Must match (`confirmPassword` = `password`)
- **Timestamps:** ISO 8601 format
- **All requests:** Use `Content-Type: application/json`

---

## ✅ Quick Reference

| Endpoint | Method | Auth Required | Phone Required |
|----------|--------|---------------|----------------|
| /health | GET | ❌ | N/A |
| /auth/register | POST | ❌ | ✅ OPTIONAL |
| /auth/login | POST | ❌ | N/A |
| /auth/refresh-token | POST | ✅ Bearer Token | N/A |
| /auth/forgot-password | POST | ❌ | N/A |
| /auth/reset-password | POST | ❌ | N/A |
