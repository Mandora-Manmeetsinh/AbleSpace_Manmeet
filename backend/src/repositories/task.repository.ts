import prisma from '../utils/prisma';
import { CreateTaskDto } from '../dtos/task.dto';
import { Task } from '@prisma/client';

export class TaskRepository {
    async create(data: CreateTaskDto, creatorId: string): Promise<Task> {
        const createData: any = { ...data, creatorId };
        if (data.dueDate) {
            createData.dueDate = new Date(data.dueDate);
        }

        return prisma.task.create({
            data: createData,
        });
    }

    async update(id: string, data: Partial<Task>): Promise<Task> {
        return prisma.task.update({
            where: { id },
            data,
        });
    }

    async findById(id: string): Promise<Task | null> {
        return prisma.task.findUnique({
            where: { id },
        });
    }
}
