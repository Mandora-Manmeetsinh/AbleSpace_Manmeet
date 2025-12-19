import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../types/events';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

class SocketService {
    private static instance: SocketService;
    private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(httpServer: HttpServer): void {
        this.io = new Server(httpServer, {
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

    private authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
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

            const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
            socket.data.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    };

    private handleConnection(socket: Socket) {
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

    public emitToUser<T extends keyof ServerToClientEvents>(
        userId: string,
        event: T,
        payload: Parameters<ServerToClientEvents[T]>[0]
    ): void {
        if (this.io) {
            (this.io as any).to(`user:${userId}`).emit(event, payload);
        }
    }

    public emitToAll<T extends keyof ServerToClientEvents>(
        event: T,
        payload: Parameters<ServerToClientEvents[T]>[0]
    ): void {
        if (this.io) {
            (this.io as any).emit(event, payload);
        }
    }
}

export default SocketService.getInstance();
