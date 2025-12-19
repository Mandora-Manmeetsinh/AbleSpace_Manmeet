"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
class SocketService {
    constructor() {
        this.io = null;
        this.authMiddleware = (socket, next) => {
            try {
                const cookieHeader = socket.handshake.headers.cookie;
                if (!cookieHeader) {
                    return next(new Error('Authentication error: No cookies found'));
                }
                // Simple cookie parsing to find 'token'
                const token = cookieHeader
                    .split(';')
                    .map((c) => c.trim())
                    .find((c) => c.startsWith('token='))
                    ?.split('=')[1];
                if (!token) {
                    return next(new Error('Authentication error: Token not found'));
                }
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                socket.data.userId = decoded.id;
                next();
            }
            catch (error) {
                next(new Error('Authentication error: Invalid token'));
            }
        };
    }
    static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }
    initialize(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                credentials: true,
            },
        });
        this.io.use(this.authMiddleware);
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });
        console.log('Socket.io initialized');
    }
    handleConnection(socket) {
        const userId = socket.data.userId;
        if (userId) {
            const roomName = `user:${userId}`;
            socket.join(roomName);
            console.log(`User ${userId} connected and joined room ${roomName}`);
            socket.on('disconnect', () => {
                console.log(`User ${userId} disconnected`);
            });
        }
    }
    emitToUser(userId, event, payload) {
        if (this.io) {
            this.io.to(`user:${userId}`).emit(event, payload);
        }
    }
    emitToAll(event, payload) {
        if (this.io) {
            this.io.emit(event, payload);
        }
    }
}
exports.default = SocketService.getInstance();
