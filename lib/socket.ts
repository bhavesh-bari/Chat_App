// socket.ts
import { io, Socket } from 'socket.io-client';

const getAuthToken = () => {

  if (typeof window !== 'undefined') { 
    return localStorage.getItem('authToken');
  }
  return null;
};


const socket: Socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  {
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: false, 
    auth: {
      token: getAuthToken(), 
    },
  }
);

// Function to (re)initialize and connect the socket, ensuring the latest token is used
export const initializeSocket = () => {
  const token = getAuthToken();
  if (!token) {
    console.log('No auth token found in localStorage. Not connecting socket.');
    return;
  }


  if (socket.connected) {

    socket.disconnect(); 
  }
  
  socket.auth = { token }; 
  socket.connect();

  socket.off('connect').on('connect', () => {
    console.log('Socket connected successfully!');
  });
  socket.off('disconnect').on('disconnect', (reason) => {
    console.log('Socket disconnected. Reason:', reason);
    if (reason === 'io server disconnect') {

        console.log('Server disconnected socket, likely due to invalid/missing token.');
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('user'); 
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
    }
  });
  socket.off('connect_error').on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
};

export default socket;