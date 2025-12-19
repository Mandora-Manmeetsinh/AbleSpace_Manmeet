"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
const task_dto_1 = require("../dtos/task.dto");
const AppError_1 = require("../utils/AppError");
class TaskController {
    constructor() {
        this.create = async (req, res, next) => {
            try {
                // 1. Validate Input
                const validatedData = task_dto_1.createTaskSchema.parse(req.body);
                // 2. Get User Context (Assumed from Auth Middleware)
                const userId = req.user?.id;
                if (!userId) {
                    throw new AppError_1.AppError('Unauthorized', 401);
                }
                // 3. Call Service
                const task = await this.taskService.createTask(validatedData, userId);
                // 4. Return Response
                res.status(201).json(task);
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { id } = req.params;
                const validatedData = task_dto_1.updateTaskSchema.parse(req.body);
                const userId = req.user?.id;
                if (!userId) {
                    throw new AppError_1.AppError('Unauthorized', 401);
                }
                const task = await this.taskService.updateTask(id, validatedData, userId);
                res.json(task);
            }
            catch (error) {
                next(error);
            }
        };
        this.taskService = new task_service_1.TaskService();
    }
}
exports.TaskController = TaskController;
