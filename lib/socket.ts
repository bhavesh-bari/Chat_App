// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000', {
  transports: ['websocket'],
  autoConnect: false, // control when to connect
  withCredentials: true,
});

export default socket;
