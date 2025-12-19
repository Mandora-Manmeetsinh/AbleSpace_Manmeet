import { TaskService } from '../src/services/task.service';
import SocketService from '../src/services/socket.service';
import { TaskRepository } from '../src/repositories/task.repository';
import { TaskStatus, TaskPriority } from '@prisma/client';

// Mock dependencies
jest.mock('../src/services/socket.service');
jest.mock('../src/repositories/task.repository');

describe('TaskService Real-Time Updates', () => {
    let taskService: TaskService;
    let mockTaskRepository: jest.Mocked<TaskRepository>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup mocks
        mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
        (TaskRepository as jest.Mock).mockImplementation(() => mockTaskRepository);

        taskService = new TaskService();
    });

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

        // Mock repository behavior
        mockTaskRepository.findById.mockResolvedValue(currentTask as any);
        mockTaskRepository.update.mockResolvedValue(updatedTask as any);

        // Call updateTask
        await taskService.updateTask(taskId, { assigneeId: newAssigneeId }, userId);

        // Verify task:updated is emitted (always)
        expect(SocketService.emitToAll).toHaveBeenCalledWith('task:updated', expect.objectContaining({
            taskId,
            updatedBy: userId,
        }));

        // Verify task:assigned is emitted (because assignee changed)
        expect(SocketService.emitToUser).toHaveBeenCalledWith(newAssigneeId, 'task:assigned', expect.objectContaining({
            taskId,
            assignedToId: newAssigneeId,
            assignedById: userId,
        }));
    });

    it('should NOT emit task:assigned when assigneeId does NOT change', async () => {
        const taskId = 'task-1';
        const userId = 'user-1';
        const assigneeId = 'user-2';

        const currentTask = {
            id: taskId,
            title: 'Test Task',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            assigneeId: assigneeId,
            createdAt: new Date(),
            updatedAt: new Date(),
            creatorId: 'creator-1',
        };

        const updatedTask = {
            ...currentTask,
            title: 'Updated Title',
        };

        // Mock repository behavior
        mockTaskRepository.findById.mockResolvedValue(currentTask as any);
        mockTaskRepository.update.mockResolvedValue(updatedTask as any);

        // Call updateTask with same assigneeId (or no assigneeId update)
        await taskService.updateTask(taskId, { title: 'Updated Title' }, userId);

        // Verify task:updated is emitted
        expect(SocketService.emitToAll).toHaveBeenCalledWith('task:updated', expect.objectContaining({
            taskId,
        }));

        // Verify task:assigned is NOT emitted
        expect(SocketService.emitToUser).not.toHaveBeenCalledWith(expect.any(String), 'task:assigned', expect.any(Object));
    });
});
