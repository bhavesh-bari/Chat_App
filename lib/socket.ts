// socket.ts
import { io, Socket } from 'socket.io-client';

const getAuthToken = () => {
  // ✅ CHANGE: Read token from localStorage
  if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side only)
    return localStorage.getItem('authToken');
  }
  return null;
};

// Define the socket instance (must be defined once)
const socket: Socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  {
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: false, // ✅ IMPORTANT: Set to false, as cookies are not used for authentication
    auth: {
      token: getAuthToken(), // ✅ Pass the token in the 'auth' object
    },
  }
);

// Function to (re)initialize and connect the socket, ensuring the latest token is used
export const initializeSocket = () => {
  const token = getAuthToken();
  if (!token) {
    console.log('No auth token found in localStorage. Not connecting socket.');
    // Optional: redirect to login if no token and on a protected route
    // if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    //   window.location.href = '/login'; 
    // }
    return;
  }

  // If the socket is already connected but needs to update its auth token (e.g., token refresh)
  // or if it was disconnected and needs to reconnect
  if (socket.connected) {
    // Only disconnect if the token has actually changed or if we need a fresh connection
    // For simplicity, we'll always disconnect and reconnect to ensure auth object is fresh
    socket.disconnect(); 
  }
  
  socket.auth = { token }; // Update the auth object with the current token
  socket.connect(); // Attempt to connect

  // Optional: Logging for debugging connection status
  socket.off('connect').on('connect', () => {
    console.log('Socket connected successfully!');
  });
  socket.off('disconnect').on('disconnect', (reason) => {
    console.log('Socket disconnected. Reason:', reason);
    if (reason === 'io server disconnect') {
        // The server intentionally disconnected the client (e.g., invalid token)
        console.log('Server disconnected socket, likely due to invalid/missing token.');
        localStorage.removeItem('authToken'); // Clear potentially bad token
        localStorage.removeItem('user'); // Clear user data
        // Redirect to login if on a protected page
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