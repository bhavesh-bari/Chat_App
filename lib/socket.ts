import { io, Socket } from 'socket.io-client';

const socket: Socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  {
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: true,
  }
);

export default socket;
