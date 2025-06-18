'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function SocketManager() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:bhavya', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected: madhav', reason);
    });

    return () => {
      socketRef.current?.disconnect();
      console.log('Socket disconnected on cleanup jayram');
    };
  }, []);

  return null;
}
