import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { TaskService } from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../dtos/task.dto';
import { AppError } from '../utils/AppError';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // 1. Validate Input
            const validatedData = createTaskSchema.parse(req.body);

            // 2. Get User Context (Assumed from Auth Middleware)
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('Unauthorized', 401);
            }

            // 3. Call Service
            const task = await this.taskService.createTask(validatedData, userId);

            // 4. Return Response
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const validatedData = updateTaskSchema.parse(req.body);
            const userId = req.user?.id;

            if (!userId) {
                throw new AppError('Unauthorized', 401);
            }

            const task = await this.taskService.updateTask(id, validatedData, userId);
            res.json(task);
        } catch (error) {
            next(error);
        }
    };
}
