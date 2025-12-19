import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, UpdateTaskDto } from '../types';
import toast from 'react-hot-toast';

const MOCK_TASKS: Task[] = [
    {
        id: '1',
        title: 'Design System Update',
        description: 'Implement the new Zinc color palette and typography settings.',
        status: 'DONE',
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assigneeId: 'guest-user-id',
        creatorId: 'guest-user-id',
    },
    {
        id: '2',
        title: 'Component Overhaul',
        description: 'Refactor TaskCard and Navbar components for the new aesthetic.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assigneeId: 'guest-user-id',
        creatorId: 'guest-user-id',
    },
    {
        id: '3',
        title: 'Authentication Bypass',
        description: 'Remove login screen and implement guest mode.',
        status: 'TODO',
        priority: 'MEDIUM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assigneeId: 'guest-user-id',
        creatorId: 'guest-user-id',
    },
];

export const useMyTasks = () => {
    return useQuery({
        queryKey: ['tasks', 'assigned'],
        queryFn: async () => MOCK_TASKS,
    });
};

export const useCreatedTasks = () => {
    return useQuery({
        queryKey: ['tasks', 'created'],
        queryFn: async () => MOCK_TASKS,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const newTask: Task = {
                id: Math.random().toString(36).substr(2, 9),
                ...data,
                status: 'TODO',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                assigneeId: 'guest-user-id',
                creatorId: 'guest-user-id',
            };
            MOCK_TASKS.push(newTask);
            return newTask;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task created successfully');
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateTaskDto }) => {
            const taskIndex = MOCK_TASKS.findIndex(t => t.id === id);
            if (taskIndex > -1) {
                MOCK_TASKS[taskIndex] = { ...MOCK_TASKS[taskIndex], ...data };
                return MOCK_TASKS[taskIndex];
            }
            throw new Error('Task not found');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task updated successfully');
        },
    });
};
