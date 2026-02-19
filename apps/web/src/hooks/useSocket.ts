import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '@repo/shared';
import { useAppStore } from '@/store/useAppStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const useSocket = () => {
    const { addObject, removeObject } = useAppStore();

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on(SOCKET_EVENTS.OBJECT_CREATED, (data) => {
            console.log('Object created via socket:', data);
            addObject(data);
        });

        socket.on(SOCKET_EVENTS.OBJECT_DELETED, (data) => {
            console.log('Object deleted via socket:', data);
            removeObject(data.id);
        });

        return () => {
            socket.disconnect();
        };
    }, [addObject, removeObject]);
};
