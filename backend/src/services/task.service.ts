import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { Task } from '@prisma/client';
import SocketService from './socket.service';
import prisma from '../utils/prisma';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async createTask(data: CreateTaskDto, creatorId: string): Promise<Task> {
        // 1. Validate Due Date
        if (data.dueDate) {
            const dueDate = new Date(data.dueDate);
            if (dueDate < new Date()) {
                throw new Error('Due date must be in the future');
            }
        }

        // 2. Validate Assignee
        if (data.assigneeId) {
            const assignee = await prisma.user.findUnique({ where: { id: data.assigneeId } });
            if (!assignee) {
                throw new Error('Assignee not found');
            }
        }

        return this.taskRepository.create(data, creatorId);
    }

    async updateTask(taskId: string, data: UpdateTaskDto, userId: string): Promise<Task> {
        const currentTask = await this.taskRepository.findById(taskId);
        if (!currentTask) {
            throw new Error('Task not found');
        }

        // Validate Due Date if updating
        let dueDate: Date | undefined;
        if (data.dueDate) {
            dueDate = new Date(data.dueDate);
            if (dueDate < new Date()) {
                throw new Error('Due date must be in the future');
            }
        }

        // Validate Assignee if updating
        if (data.assigneeId) {
            const assignee = await prisma.user.findUnique({ where: { id: data.assigneeId } });
            if (!assignee) {
                throw new Error('Assignee not found');
            }
        }

        const updateData: any = { ...data };
        if (dueDate) {
            updateData.dueDate = dueDate;
        }

        const updatedTask = await this.taskRepository.update(taskId, updateData);

        // Emit task:updated to all connected clients
        SocketService.emitToAll('task:updated', {
            taskId: updatedTask.id,
            title: updatedTask.title,
            status: updatedTask.status,
            priority: updatedTask.priority,
            updatedAt: updatedTask.updatedAt,
            updatedBy: userId,
        });

        // Check if assignee changed and emit task:assigned
        if (data.assigneeId && data.assigneeId !== currentTask.assigneeId) {
            SocketService.emitToUser(data.assigneeId, 'task:assigned', {
                taskId: updatedTask.id,
                title: updatedTask.title,
                assignedToId: data.assigneeId,
                assignedById: userId,
                assignedAt: new Date(),
            });
        }

        return updatedTask;
    }
}

