import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task } from '../types';
import { Loader2 } from 'lucide-react';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
    assigneeId: z.string().uuid().optional().or(z.literal('')),
    dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    initialData?: Task;
    onSubmit: (data: TaskFormData) => void;
    isLoading: boolean;
    onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, isLoading, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            priority: initialData?.priority || 'MEDIUM',
            status: initialData?.status || 'TODO',
            assigneeId: initialData?.assigneeId || '',
            dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
        },
    });

    const inputClasses = "mt-1 block w-full rounded-lg bg-muted/50 border border-border text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 transition-all hover:bg-muted/80 placeholder:text-muted-foreground/50";
    const labelClasses = "block text-sm font-medium text-muted-foreground mb-1.5";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className={labelClasses}>Title</label>
                <input
                    {...register('title')}
                    className={inputClasses}
                    placeholder="e.g., Implement Authentication Flow"
                />
                {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label className={labelClasses}>Description</label>
                <textarea
                    {...register('description')}
                    className={inputClasses}
                    rows={4}
                    placeholder="Describe the task details..."
                />
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={labelClasses}>Priority</label>
                    <select {...register('priority')} className={inputClasses}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>Status</label>
                    <select {...register('status')} className={inputClasses}>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={labelClasses}>Due Date</label>
                    <input
                        type="date"
                        {...register('dueDate')}
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label className={labelClasses}>Assignee ID (Optional)</label>
                    <input
                        {...register('assigneeId')}
                        className={inputClasses}
                        placeholder="UUID"
                    />
                    {errors.assigneeId && <p className="text-destructive text-xs mt-1">{errors.assigneeId.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {initialData ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};
