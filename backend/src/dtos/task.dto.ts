import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().uuid().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().uuid().optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
