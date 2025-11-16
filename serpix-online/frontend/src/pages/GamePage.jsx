import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import { InputHandler } from "../components/InputHandler";
import { AudioManager } from "../components/AudioManager";
import GameCanvas from "../components/GameCanvas";

// --- UI Components ---
function ScoreCard({ player, localPlayerName }) {
  if (!player)
    return <div className="flex-1 p-4 bg-gray-800 rounded-lg">Loading...</div>;

  const isP1 = player.color === "blue";
  const isLeading = player.isLeading;
  const isMe = player.name === localPlayerName;

  return (
    <div
      className={`flex-1 p-4 bg-gray-800 rounded-lg transition-all ${
        isLeading
          ? "border-2 border-yellow-400 scale-105"
          : "border-2 border-transparent"
      } ${isMe ? "shadow-lg shadow-blue-500/50" : ""}`}
    >
      <h2
        className={`text-2xl font-bold ${
          isP1 ? "text-blue-400" : "text-red-500"
        }`}
      >
        {player.name} {isMe && "(You)"}
      </h2>
      <div className="flex justify-around items-center mt-2">
        <div className="flex items-center gap-2 text-xl">
          <img
            src="/assets/visual/sprites/life.png"
            alt="Lives"
            className="w-8 h-8"
          />
          <span>{player.lives}</span>
        </div>
        <div className="flex items-center gap-2 text-xl">
          <img
            src="/assets/visual/sprites/score.png"
            alt="Score"
            className="w-8 h-8"
          />
          <span>{player.score}</span>
        </div>
      </div>
    </div>
  );
}

function GameOverModal({ winnerName, onPlayAgain, onGoHome }) {
  if (!winnerName) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[#242424] p-8 rounded-lg shadow-xl text-center animate-modal-pop w-full max-w-sm">
        <h1 className="text-4xl font-bold mb-4">{winnerName} wins!</h1>
        <p className="text-lg mb-6">What would you like to do next?</p>
        <div className="flex flex-col gap-4">
          {/* Play Again is complex, I'll just send the Players go home for now */}
          {/* <button onClick={onPlayAgain} className="w-full h-[3em] text-xl font-bold text-white bg-[#242424] border-4 border-green-500 rounded-md transition-all hover:shadow-[inset_0_0_25px_#86ea14]">
                        Play Again
                    </button> */}
          <button
            onClick={onGoHome}
            className="w-full h-[3em] text-xl font-bold text-white bg-[#242424] border-4 border-blue-500 rounded-md transition-all hover:shadow-[inset_0_0_25px_#1479EA]"
          >
            Home Screen
          </button>
        </div>
      </div>
    </div>
  );
}
// --- End of UI Components ---

export default function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const localName = location.state?.localName;

  // Game State
  const [gameState, setGameState] = useState({});
  const [winner, setWinner] = useState(null);
  const [localPlayerName, setLocalPlayerName] = useState(localName || "Player");

  // This state is just a trigger
  // The canvas reads the payload from it to emit particles
  const [particleEvents, setParticleEvents] = useState(null);

  // Refs for client systems
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  // Getting Player names
  useEffect(() => {
    setLocalPlayerName(localName || "Player");
  }, [localName]);

  // Main Effect for Socket Listeners and Game Loop
  useEffect(() => {
    // --- Initializing systems ---
    const inputHandler = new InputHandler();
    const audioManager = new AudioManager();

    // Loading and Starting music
    audioManager.loadSounds();
    audioManager.startMusic();

    // --- Socket Listeners ---
    const onGameState = (state) => setGameState(state);

    const onGameOver = ({ winnerName }) => {
      setWinner(winnerName);
      audioManager.stopMusic();
      audioManager.playSound("win");
    };

    const onBallEat = (payload) => {
      setParticleEvents({ type: "ballEat", payload });
      audioManager.playSound("eat");
    };

    const onPlayerHit = (payload) => {
      setParticleEvents({ type: "playerHit", payload });
      audioManager.playSound("collide");
    };

    socket.on("gameState", onGameState);
    socket.on("gameOver", onGameOver);
    socket.on("ballEat", onBallEat);
    socket.on("playerHit", onPlayerHit);

    // --- Client-side Input Loop ---
    const inputLoop = setInterval(() => {
      const keys = inputHandler.keys;

      if (keys.size > 0) {
        console.log(`[GamePage Loop] Seeing keys: ${Array.from(keys)}`);
      }

      const inputState = {
        left:
          inputHandler.isKeyPressed("a") ||
          inputHandler.isKeyPressed("ArrowLeft"),
        right:
          inputHandler.isKeyPressed("d") ||
          inputHandler.isKeyPressed("ArrowRight"),
      };

      if (inputState.left || inputState.right) {
        console.log("Sending input state:", inputState);
      }

      socket.emit("playerInput", inputState);
    }, 1000 / 60);

    // --- Cleanup for THIS effect ---
    return () => {
      // Clear interval
      clearInterval(inputLoop);

      // Detach listeners
      socket.off("gameState", onGameState);
      socket.off("gameOver", onGameOver);
      socket.off("ballEat", onBallEat);
      socket.off("playerHit", onPlayerHit);

      // Destroy instances
      inputHandler.destroy();
      audioManager.stopMusic();
    };
  }, []);

  // Handle navigation
  const goHome = () => {
    socket.disconnect(); // Disconnecting and reconnecting on setup page
    navigate("/");
  };

  // --- Preparing Data for UI ---
  const p1 = gameState.players?.find((p) => p.color === "blue");
  const p2 = gameState.players?.find((p) => p.color === "red");

  if (p1 && p2) {
    p1.isLeading = p1.score > p2.score;
    p2.isLeading = p2.score > p1.score;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-fit bg-[#1E1E1E] p-6 rounded-lg shadow-xl">
        {/* Header: Score Cards */}
        <div className="flex gap-4 mb-4">
          <ScoreCard player={p1} localPlayerName={localPlayerName} />
          {/* I'll add the timer back if I eventually add it to the server state */}
          <div className="p-4 bg-gray-800 rounded-lg text-center">
            <h3 className="text-gray-400">STATUS</h3>
            <span className="text-2xl font-bold text-green-400">Online</span>
          </div>
          <ScoreCard player={p2} localPlayerName={localPlayerName} />
        </div>

        {/* Game Canvas */}
        <GameCanvas
          latestGameState={gameState}
          particleEvents={particleEvents}
        />

        {/* Event Log (ToDo) */}
        {/* <div className="log-container"> ... </div> */}

        <GameOverModal
          winnerName={winner}
          onGoHome={goHome}
          onPlayAgain={() => {}}
        />
      </div>
    </div>
  );
}
