# 🚀 Deploying to Vercel Guide

This guide walks you through deploying both the **Frontend** and **Backend** of the School Management System to **Vercel** with the correct configurations and environment variables.

---

## 📂 Project Structure Overview

```
school-management-system/
├── backend/            <-- Node.js Express App
│   ├── api/
│   │   └── index.js    <-- Serverless Entrypoint
│   └── vercel.json     <-- Backend routing config
└── frontend/           <-- React SPA (Vite)
    └── vercel.json     <-- Frontend SPA router fallback config
```

---

## 1. 🖥️ Frontend Deployment (React Vite)

### Setup Steps on Vercel:
1. Go to the **Vercel Dashboard** and click **Add New Project**.
2. Select your repository.
3. Configure the following project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variables** in Vercel:

| Key | Suggested Production Value | Description |
|---|---|---|
| `VITE_APP_NAME` | `School Management System` | Application title |
| `VITE_APP_ENV` | `production` | Environment mode |
| `VITE_API_BASE_URL` | `https://your-backend-vercel-url.vercel.app/api/v1` | URL of your deployed backend API (no trailing slash) |
| `VITE_SOCKET_URL` | `https://your-backend-vercel-url.vercel.app` | URL of your deployed backend socket root |
| `VITE_JWT_STORAGE_KEY` | `sms_access_token` | JWT Token storage key |
| `VITE_REFRESH_TOKEN_KEY` | `sms_refresh_token` | Refresh Token storage key |
| `VITE_DEBUG` | `false` | Disable console logs in prod |

5. Click **Deploy**.

---

## 2. ⚙️ Backend Deployment (Node.js Express)

### Setup Steps on Vercel:
1. Go to the **Vercel Dashboard** and click **Add New Project**.
2. Select the same repository.
3. Configure the following project settings:
   - **Framework Preset**: `Other` (or None)
   - **Root Directory**: `backend`
   - **Build Command**: Keep empty (Vercel builds serverless functions automatically)
   - **Output Directory**: Keep empty
4. Add the following **Environment Variables** in Vercel:

> [!IMPORTANT]
> You **MUST** use a hosted database (like **MongoDB Atlas**) instead of `localhost:27017` in production. Localhost is not reachable from Vercel.

| Key | Example Production Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Run server in production mode |
| `PORT` | `5000` | Port |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/sms` | Connection string to MongoDB Atlas |
| `CORS_ORIGIN` | `https://your-frontend-vercel-url.vercel.app` | Your deployed frontend Vercel URL (NO trailing slash) |
| `CORS_CREDENTIALS` | `true` | Allows cookies/headers across origins |
| `JWT_SECRET` | `generate-a-secure-random-string` | Used to sign access tokens |
| `JWT_REFRESH_SECRET` | `generate-another-secure-random-string` | Used to sign refresh tokens |
| `ENCRYPTION_KEY` | `your-encryption-key-32-chars-long` | Exactly 32 characters key for field encryption |

5. Click **Deploy**.

---

## 🤝 Troubleshooting CORS & Connections

* **No Trailing Slashes**: Always verify that `CORS_ORIGIN` (in backend env) and `VITE_API_BASE_URL` (in frontend env) do **not** have a trailing slash (e.g. use `.vercel.app` instead of `.vercel.app/`).
* **MongoDB Atlas Whitelist**: Ensure that your MongoDB Atlas cluster has IP Access Whitelist set to `0.0.0.0/0` (Allow access from anywhere), since Vercel's serverless functions use dynamic outgoing IP addresses.
