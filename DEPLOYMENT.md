# Deployment Guide

## 1. Database (PostgreSQL) - Railway/Render/Neon
1.  Create a new PostgreSQL project.
2.  Copy the `DATABASE_URL` connection string.
3.  **Important:** Ensure the database is accessible from the internet (or at least from your backend service).

## 2. Backend - Render/Railway
1.  Connect your GitHub repository.
2.  Set **Build Command**: `npm install && npx prisma generate && npm run build`
3.  Set **Start Command**: `npm start`
4.  **Environment Variables:**
    - `DATABASE_URL`: (From Step 1)
    - `JWT_SECRET`: Generate a strong random string.
    - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://my-task-app.vercel.app`).
    - `NODE_ENV`: `production`

## 3. Frontend - Vercel
1.  Connect your GitHub repository.
2.  Set **Root Directory**: `frontend`
3.  **Build Command**: `npm run build` (Default)
4.  **Output Directory**: `dist` (Default)
5.  **Environment Variables:**
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://my-task-api.onrender.com/api`).
        - **Note:** Ensure you include `/api` if your backend routes are prefixed.

## 4. Critical Configuration
### CORS & Cookies
- The backend `cors` configuration in `src/index.ts` must match `FRONTEND_URL`.
- `credentials: true` is required for HttpOnly cookies to work.
- Ensure your backend and frontend are on **HTTPS** in production. Cookies with `SameSite=None; Secure` (often default for cross-site) require HTTPS.

### Socket.io
- The frontend `socket.ts` connects to `VITE_API_URL` (stripped of `/api`).
- Ensure your backend hosting provider supports WebSockets (Render and Railway do).
