// backend/index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors()); // Allow all origins for simplicity (I really don't want to deal with this now)

const httpServer = createServer(app);

// Initializing Socket.IO server and attaching it to the HTTP Server
// Configuring CORS for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // URL Frontend Server
    methods: ["GET", "POST"]
  }
});

// Root express route
app.get('/', (req, res) => {
  res.send('Serpix Backend Server is running.');
});

// Listening for any new client connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listening for any client to disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});