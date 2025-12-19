"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class TaskRepository {
    async create(data, creatorId) {
        const createData = { ...data, creatorId };
        if (data.dueDate) {
            createData.dueDate = new Date(data.dueDate);
        }
        return prisma_1.default.task.create({
            data: createData,
        });
    }
    async update(id, data) {
        return prisma_1.default.task.update({
            where: { id },
            data,
        });
    }
    async findById(id) {
        return prisma_1.default.task.findUnique({
            where: { id },
        });
    }
}
exports.TaskRepository = TaskRepository;
