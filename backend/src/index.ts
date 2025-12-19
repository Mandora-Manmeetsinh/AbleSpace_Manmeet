import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import SocketService from './services/socket.service';
// Import routes (assuming they exist or will be imported)
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Initialize Socket.io
SocketService.initialize(httpServer);

// Error Handling Middleware
import { errorMiddleware } from './middleware/error.middleware';
app.use(errorMiddleware);

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
