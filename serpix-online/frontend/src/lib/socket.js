// frontend/src/lib/socket.js
import { io } from 'socket.io-client';

// URL of Backend Server
const URL = 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false // I'll connect manually. So, no automatic connection on import
});