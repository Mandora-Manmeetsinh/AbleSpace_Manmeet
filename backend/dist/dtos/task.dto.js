"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: zod_1.z.string().datetime().optional(),
    assigneeId: zod_1.z.string().uuid().optional(),
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: zod_1.z.string().datetime().optional(),
    assigneeId: zod_1.z.string().uuid().optional(),
});
