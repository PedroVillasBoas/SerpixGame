// backend/index.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Game } from "./game/Game.js";

const app = express();
app.use(cors());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://serpix-game.vercel.app/", // Frontend URL
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// --- Game Management ---
let gameRooms = new Map(); // Stores game instances by room ID
let waitingPlayer = null; // A Simple Matchmaking "Lobby"

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.data.name = "Player"; // Default name

  // Handling Player looking for a game
  socket.on("findGame", (playerName) => {
    socket.data.name = playerName || "Player";
    console.log(
      `${socket.data.name} (id: ${socket.id}) is looking for a game.`
    );

    if (waitingPlayer) {
      // --- Start New Game ---
      const player1 = waitingPlayer;
      const player2 = socket;
      waitingPlayer = null; // Clearing the waiting spot

      const roomID = `game_${player1.id}_${player2.id}`;

      // Both players join the socket.io room
      player1.join(roomID);
      player2.join(roomID);

      // Creating Game Callbacks
      const onGameOver = (winnerName) => {
        console.log(`Game over in room ${roomID}. Winner: ${winnerName}`);
        io.to(roomID).emit("gameOver", { winnerName });

        // Disbanding the room logic (or handle 'Play Again')
        gameRooms.delete(roomID);
        player1.leave(roomID);
        player2.leave(roomID);
      };

      const onStateChange = (gameState) => {
        io.to(roomID).emit("gameState", gameState);
      };

      const onGameEvent = (eventName, payload) => {
        io.to(roomID).emit(eventName, payload);
      };

      // Creating and Starting the game
      const game = new Game(onGameOver, onStateChange, onGameEvent);
      game.addPlayer(player1.id, player1.data.name, 1);
      game.addPlayer(player2.id, player2.data.name, 2);

      gameRooms.set(roomID, game);

      // Telling clients the game is starting
      io.to(roomID).emit("gameStart", {
        roomID: roomID,
        player1: player1.data.name,
        player2: player2.data.name,
      });

      game.startGame();
      console.log(
        `Game starting in room ${roomID} for ${player1.data.name} and ${player2.data.name}`
      );
    } else {
      // --- No other player is waiting ---
      waitingPlayer = socket;
      socket.emit("waitingForPlayer");
      console.log(`${socket.data.name} (id: ${socket.id}) is waiting.`);
    }
  });

  // Handling Player Input
  socket.on("playerInput", (inputState) => {
    // Finding which game this socket is in
    const room = getRoomBySocketID(socket.id);
    if (!room) return;

    const game = gameRooms.get(room);
    if (game) {
      game.handleInput(socket.id, inputState);
    }
  });

  // Handling Player Disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // If player was waiting, clear the lobby
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
      console.log("Waiting player disconnected, lobby cleared.");
    }

    // If player was in a game, end the game
    const room = getRoomBySocketID(socket.id);
    if (room) {
      const game = gameRooms.get(room);
      if (game) {
        console.log(
          `Player ${socket.id} disconnected from game in room ${room}.`
        );
        game.removePlayer(socket.id); // This will trigger the game to stop
      }
    }
  });
});

function getRoomBySocketID(id) {
  for (const roomID of gameRooms.keys()) {
    const game = gameRooms.get(roomID);
    if (game.players.has(id)) {
      return roomID;
    }
  }
  return null;
}
