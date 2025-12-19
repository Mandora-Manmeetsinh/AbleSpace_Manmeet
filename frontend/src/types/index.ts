export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    creatorId: string;
    assigneeId?: string;
    dueDate?: string; // ISO Date string
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    creator?: User;
    assignee?: User;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
}

export interface AuthResponse {
    user: User;
    // Token is handled via HttpOnly cookie
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
}
