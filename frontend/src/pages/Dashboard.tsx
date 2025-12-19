import React, { useState } from 'react';
import { useMyTasks, useCreatedTasks, useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import type { Task } from '../types';
import { Plus, X, Layout, CheckSquare, Clock } from 'lucide-react';
import { useSocketEvents } from '../hooks/useSocketEvents';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
    // Enable real-time updates
    // useSocketEvents();

    const [activeTab, setActiveTab] = useState<'assigned' | 'created' | 'overdue'>('assigned');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const { data: myTasks, isLoading: myTasksLoading, isError: myTasksError } = useMyTasks();
    const { data: createdTasks, isLoading: createdTasksLoading, isError: createdTasksError } = useCreatedTasks();

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();

    // Client-side filtering for overdue tasks (as per API layer decision)
    const overdueTasks = myTasks?.filter(t => new Date(t.createdAt) < new Date() && t.status !== 'DONE');

    const handleCreateTask = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        // Clean up empty assigneeId
        if (!data.assigneeId) delete data.assigneeId;

        if (editingTask) {
            await updateTaskMutation.mutateAsync({ id: editingTask.id, data });
        } else {
            await createTaskMutation.mutateAsync(data);
        }
        setIsModalOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'assigned':
                return (
                    <TaskList
                        tasks={myTasks}
                        isLoading={myTasksLoading}
                        isError={myTasksError}
                        onEditTask={handleEditTask}
                        emptyMessage="No tasks assigned to you."
                    />
                );
            case 'created':
                return (
                    <TaskList
                        tasks={createdTasks}
                        isLoading={createdTasksLoading}
                        isError={createdTasksError}
                        onEditTask={handleEditTask}
                        emptyMessage="You haven't created any tasks."
                    />
                );
            case 'overdue':
                return (
                    <TaskList
                        tasks={overdueTasks}
                        isLoading={myTasksLoading}
                        isError={myTasksError}
                        onEditTask={handleEditTask}
                        emptyMessage="No overdue tasks! Great job."
                    />
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'assigned', label: 'Assigned to Me', icon: Layout, count: myTasks?.length },
        { id: 'created', label: 'Created by Me', icon: CheckSquare, count: createdTasks?.length },
        { id: 'overdue', label: 'Overdue', icon: Clock, count: overdueTasks?.length },
    ] as const;

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-up duration-500">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Overview of your projects and tasks.</p>
                </div>
                <button
                    onClick={handleCreateTask}
                    className="group relative px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-6">
                {/* Segmented Control Tabs */}
                <div className="border-b border-white/5">
                    <nav className="flex gap-6 overflow-x-auto hide-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "relative pb-3 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                                        isActive
                                            ? "text-foreground border-b-2 border-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className={cn(
                                            "ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold border",
                                            isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/5"
                                        )}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Task Grid */}
                <div className="min-h-[400px]">
                    {renderContent()}
                </div>
            </div>


            {/* Modal Overlay */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-[#1a1b26] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                                <h2 className="text-xl font-bold text-foreground">
                                    {editingTask ? 'Edit Task' : 'Create New Task'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <TaskForm
                                    initialData={editingTask}
                                    onSubmit={handleFormSubmit}
                                    isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
                                    onCancel={() => setIsModalOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
