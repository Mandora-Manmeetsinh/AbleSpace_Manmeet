import React from 'react';
import type { Task } from '../types';
import { cn } from '../lib/utils';
import { Calendar, CheckCircle2, Circle, Clock, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
}

const priorityConfig = {
    LOW: { color: 'text-blue-500', dot: 'bg-blue-500', label: 'Low' },
    MEDIUM: { color: 'text-yellow-500', dot: 'bg-yellow-500', label: 'Medium' },
    HIGH: { color: 'text-red-500', dot: 'bg-red-500', label: 'High' },
};

const statusIcons = {
    TODO: Circle,
    IN_PROGRESS: Clock,
    DONE: CheckCircle2,
};

const statusConfig = {
    TODO: { color: 'text-muted-foreground', bg: 'bg-muted' },
    IN_PROGRESS: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
    DONE: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
    const StatusIcon = statusIcons[task.status];
    const statusStyle = statusConfig[task.status];
    const priorityStyle = priorityConfig[task.priority];

    return (
        <div className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 hover:border-primary/20 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                        #{task.id.slice(0, 4)}
                    </span>
                    <div className={cn("flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-white/5 bg-white/5", priorityStyle.color)}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", priorityStyle.dot)} />
                        <span className="text-[10px] font-medium uppercase tracking-wider">{priorityStyle.label}</span>
                    </div>
                </div>
                <button
                    onClick={() => onEdit(task)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-muted-foreground hover:text-foreground"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                {task.title}
            </h3>

            <p className="text-muted-foreground text-xs mb-4 line-clamp-2 min-h-[32px] leading-relaxed">
                {task.description || 'No description provided.'}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className={cn("flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded transition-colors", statusStyle.bg, statusStyle.color)}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{task.status.replace('_', ' ')}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                    <Calendar className="w-3 h-3 opacity-50" />
                    <span>{format(new Date(task.dueDate || task.createdAt), 'MMM d')}</span>
                </div>
            </div>
        </div>
    );
};
