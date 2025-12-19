import { TaskPriority, TaskStatus } from '@prisma/client';

export interface TaskUpdatedPayload {
    taskId: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    updatedAt: Date;
    updatedBy: string; // userId
}

export interface TaskAssignedPayload {
    taskId: string;
    title: string;
    assignedToId: string;
    assignedById: string; // userId
    assignedAt: Date;
}

export interface ServerToClientEvents {
    'task:updated': (payload: TaskUpdatedPayload) => void;
    'task:assigned': (payload: TaskAssignedPayload) => void;
}

export interface ClientToServerEvents {
    // No client-to-server events for now as per requirements (business logic via REST)
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userId: string;
}
