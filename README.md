# Collaborative Task Manager

A real-time task management dashboard built with React, Node.js, and Socket.io.

## 🚀 Features
- **Real-Time Updates:** Instant task updates and assignment notifications via Socket.io.
- **Task Management:** Create, update, filter, and sort tasks.
- **Authentication:** Secure JWT-based auth with HttpOnly cookies.
- **Responsive UI:** Mobile-first design using Tailwind CSS.
- **Robust Validation:** Zod schemas shared between frontend and backend.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, React Query, React Hook Form.
- **Backend:** Node.js, Express, TypeScript, Prisma (PostgreSQL).
- **Real-Time:** Socket.io (Server & Client).
- **Testing:** Jest (Backend Unit Tests).

## 🏗️ Architecture
```
[Frontend (React)]  <-- HTTP/REST -->  [Backend (Express)]  <-- Prisma -->  [PostgreSQL]
       ^                                      ^
       |                                      |
       +----------- WebSocket (Socket.io) ----+
```

## 🏃‍♂️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### 1. Clone & Install
```bash
git clone <repo-url>
cd intern_assign
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your DATABASE_URL
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with VITE_API_URL=http://localhost:3000/api
npm run dev
```

## 🔌 API Contract
- `POST /api/auth/login`: Login user.
- `GET /api/tasks/assigned`: Get tasks assigned to current user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update a task.

## 🔒 Authentication
- Uses **HttpOnly Cookies** to store JWTs.
- Prevents XSS attacks from accessing tokens.
- CSRF protection via standard CORS and SameSite cookie policies.

## 📡 Real-Time Implementation
- **Events:**
    - `task:updated`: Broadcasted to all users when a task changes.
    - `task:assigned`: Sent to specific user when they are assigned a task.
- **Room Strategy:** Users join `user:{userId}` room upon connection.

## 🧪 Testing
- Backend unit tests using **Jest**.
- Mocks `PrismaClient` and `SocketService` to isolate business logic.
- Run tests: `cd backend && npm test`

## ⚖️ Trade-offs & Assumptions
- **Auth:** Implemented simple email/password. In production, would use OAuth or a specialized auth provider (Auth0/Clerk).
- **Database:** Used Prisma with Postgres. For simpler setup, SQLite could be used locally.
- **Real-Time:** Socket.io is stateful. For serverless deployment (e.g., Vercel Functions), would need an external adapter (Redis) or service (Pusher).
