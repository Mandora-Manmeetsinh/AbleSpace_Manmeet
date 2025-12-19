import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../lib/socket';
import toast from 'react-hot-toast';

export const useSocketEvents = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('task:updated', () => {
            // Invalidate queries to fetch fresh data
            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            // Optional: Optimistic update could go here if payload has full task data
            // For now, invalidation is safer and fast enough
        });

        socket.on('task:assigned', () => {
            toast('You have been assigned a new task!', {
                icon: '🔔',
                duration: 5000,
            });
            queryClient.invalidateQueries({ queryKey: ['tasks', 'assigned'] });
        });

        return () => {
            socket.off('connect');
            socket.off('task:updated');
            socket.off('task:assigned');
            socket.disconnect();
        };
    }, [queryClient]);
};
