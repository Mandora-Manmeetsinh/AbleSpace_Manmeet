"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
const socket_service_1 = __importDefault(require("./socket.service"));
const prisma_1 = __importDefault(require("../utils/prisma"));
class TaskService {
    constructor() {
        this.taskRepository = new task_repository_1.TaskRepository();
    }
    async createTask(data, creatorId) {
        // 1. Validate Due Date
        if (data.dueDate) {
            const dueDate = new Date(data.dueDate);
            if (dueDate < new Date()) {
                throw new Error('Due date must be in the future');
            }
        }
        // 2. Validate Assignee
        if (data.assigneeId) {
            const assignee = await prisma_1.default.user.findUnique({ where: { id: data.assigneeId } });
            if (!assignee) {
                throw new Error('Assignee not found');
            }
        }
        return this.taskRepository.create(data, creatorId);
    }
    async updateTask(taskId, data, userId) {
        const currentTask = await this.taskRepository.findById(taskId);
        if (!currentTask) {
            throw new Error('Task not found');
        }
        // Validate Due Date if updating
        let dueDate;
        if (data.dueDate) {
            dueDate = new Date(data.dueDate);
            if (dueDate < new Date()) {
                throw new Error('Due date must be in the future');
            }
        }
        // Validate Assignee if updating
        if (data.assigneeId) {
            const assignee = await prisma_1.default.user.findUnique({ where: { id: data.assigneeId } });
            if (!assignee) {
                throw new Error('Assignee not found');
            }
        }
        const updateData = { ...data };
        if (dueDate) {
            updateData.dueDate = dueDate;
        }
        const updatedTask = await this.taskRepository.update(taskId, updateData);
        // Emit task:updated to all connected clients
        socket_service_1.default.emitToAll('task:updated', {
            taskId: updatedTask.id,
            title: updatedTask.title,
            status: updatedTask.status,
            priority: updatedTask.priority,
            updatedAt: updatedTask.updatedAt,
            updatedBy: userId,
        });
        // Check if assignee changed and emit task:assigned
        if (data.assigneeId && data.assigneeId !== currentTask.assigneeId) {
            socket_service_1.default.emitToUser(data.assigneeId, 'task:assigned', {
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
exports.TaskService = TaskService;
