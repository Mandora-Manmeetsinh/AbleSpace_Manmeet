import { TaskService } from '../src/services/task.service';
import SocketService from '../src/services/socket.service';
import { TaskRepository } from '../src/repositories/task.repository';
import prisma from '../src/utils/prisma';
import { TaskStatus, TaskPriority } from '@prisma/client';

// Mock dependencies
jest.mock('../src/services/socket.service');
jest.mock('../src/repositories/task.repository');
jest.mock('../src/utils/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

describe('TaskService Phase 4 Tests', () => {
    let taskService: TaskService;
    let mockTaskRepository: jest.Mocked<TaskRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
        (TaskRepository as jest.Mock).mockImplementation(() => mockTaskRepository);
        taskService = new TaskService();
    });

    // Test 1: Reject task creation if dueDate is in the past
    it('should throw error if dueDate is in the past', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);

        const taskData = {
            title: 'Past Task',
            dueDate: pastDate.toISOString(),
        };

        await expect(taskService.createTask(taskData, 'creator-id'))
            .rejects
            .toThrow('Due date must be in the future');
    });

    // Test 2: Reject assignment to a non-existent user
    it('should throw error if assigned user does not exist', async () => {
        const taskData = {
            title: 'Task with Invalid Assignee',
            assigneeId: 'non-existent-user',
        };

        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(taskService.createTask(taskData, 'creator-id'))
            .rejects
            .toThrow('Assignee not found');
    });

    // Test 3: Emit task:assigned ONLY when assignedToId changes
    it('should emit task:assigned ONLY when assigneeId changes', async () => {
        const taskId = 'task-1';
        const userId = 'user-1';
        const oldAssigneeId = 'user-2';
        const newAssigneeId = 'user-3';

        const currentTask = {
            id: taskId,
            title: 'Test Task',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            assigneeId: oldAssigneeId,
            createdAt: new Date(),
            updatedAt: new Date(),
            creatorId: 'creator-1',
        };

        const updatedTask = {
            ...currentTask,
            assigneeId: newAssigneeId,
        };

        mockTaskRepository.findById.mockResolvedValue(currentTask as any);
        mockTaskRepository.update.mockResolvedValue(updatedTask as any);
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: newAssigneeId }); // Mock user exists

        await taskService.updateTask(taskId, { assigneeId: newAssigneeId }, userId);

        // Verify task:assigned is emitted
        expect(SocketService.emitToUser).toHaveBeenCalledWith(newAssigneeId, 'task:assigned', expect.anything());

        // Case where assignee does NOT change
        jest.clearAllMocks();
        mockTaskRepository.findById.mockResolvedValue(updatedTask as any); // Current task has newAssigneeId
        mockTaskRepository.update.mockResolvedValue(updatedTask as any);

        await taskService.updateTask(taskId, { assigneeId: newAssigneeId }, userId);

        // Verify task:assigned is NOT emitted
        expect(SocketService.emitToUser).not.toHaveBeenCalledWith(expect.any(String), 'task:assigned', expect.anything());
    });
});
