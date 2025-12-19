import React from 'react';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';
import { Loader2, ClipboardList } from 'lucide-react';

interface TaskListProps {
    tasks: Task[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onEditTask: (task: Task) => void;
    emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading,
    isError,
    onEditTask,
    emptyMessage = "No tasks found."
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-muted-foreground animate-in fade-in duration-500">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4 opacity-50" />
                <p className="text-sm font-medium tracking-tight">Loading tasks...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-destructive bg-destructive/5 rounded-lg border border-destructive/10 animate-in fade-in duration-500">
                <p className="font-medium text-sm">Failed to load tasks</p>
                <p className="text-xs opacity-70 mt-1">Please check your connection.</p>
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-zinc-900/20 rounded-lg border border-dashed border-white/5 animate-in fade-in duration-500">
                <div className="bg-white/5 p-3 rounded-lg mb-3">
                    <ClipboardList className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-sm font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-up duration-500">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
        </div>
    );
};
