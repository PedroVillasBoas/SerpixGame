// frontend/src/pages/SetupPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import { TutorialModal } from "../components/ui/TutorialModal";
import { SocialsList } from "../components/ui/SocialsList";
import { AnimatedInput } from '../components/ui/AnimatedInput';

export default function SetupPage() {
  const [playerName, setPlayerName] = useState("");
  const [status, setStatus] = useState("Connecting...");

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // --- Socket Connection Handling ---
    function onConnect() {
      setStatus("Connected. Ready to play!");
    }

    function onDisconnect() {
      setStatus("Disconnected. Trying to reconnect...");
    }

    function onGameStart(data) {
      console.log("Game starting!", data);
      // Navigate to the game page
      // I already pass the room data via state
      // Since the playerName is a Client-side only info, I need to pass it too
      navigate("/game", { state: { roomData: data, localName: playerName } });
    }
    function onWaitingForPlayer() {
      setStatus("Waiting for another player...");
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("gameStart", onGameStart);
    socket.on("waitingForPlayer", onWaitingForPlayer);

    // Cleaning up listeners on component unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("gameStart", onGameStart);
      socket.off("waitingForPlayer", onWaitingForPlayer);
    };
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = playerName.trim();

    if (socket.connected && trimmedName) {
      setStatus('Looking for game...');
      socket.emit('findGame', trimmedName);
    } else if (!trimmedName) {
      setStatus('Please enter a name.');
    } else {
      setStatus('Not connected to server.');
    }
  };

  const buttonBaseStyle =
    "flex-1 h-[3.5em] text-xl font-bold text-white bg-[#242424] border-4 rounded-md transition-all";

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center items-center min-h-screen gap-8 p-4">
        {/* Form Card */}
        <div className="text-center bg-[#242424] p-8 rounded-lg shadow-xl max-w-md w-full">
          <img
            src="/assets/visual/img/logo.png"
            alt="Serpix Logo"
            className="mx-auto mb-4 max-w-[80%]"
          />
          <p className="mb-6 text-gray-300">
            A hybrid of Snake, Pong, and Slither.io.
            <br />
            Now online!
          </p>

          <form
            id="setup-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <AnimatedInput
              id="player"
              label="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required={true}
            />

            <button
              type="submit"
              className="w-full h-[3.5em] text-2xl font-bold text-white bg-[#242424] border-4 border-green-500 rounded-md transition-all hover:shadow-[inset_0_0_25px_#86ea14] mt-4"
              disabled={status !== "Connected. Ready to play!"}
            >
              Find Game
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-400">{status}</p>

          {/* --- Button Group --- */}
          <div className="flex gap-4 mt-6">
            <button
              className={`${buttonBaseStyle} border-blue-500 hover:shadow-[inset_0_0_25px_#1479EA]`}
              onClick={() => setIsLeaderboardOpen(true)}
            >
              Leaderboard
            </button>
            <button
              className={`${buttonBaseStyle} border-yellow-500 hover:shadow-[inset_0_0_25px_#f2a65e]`}
              onClick={() => setIsTutorialOpen(true)}
            >
              Tutorial
            </button>
          </div>

          {/* Dev Credit */}
          <p className="mt-6 text-sm text-gray-400">
            Game Developed by Pedro Vilas Bôas
          </p>
        </div>
    
        {/* Socials */}
        <div className="text-center bg-[#242424] p-2 rounded-lg shadow-xl max-w-md">
          <SocialsList />
        </div>
      </div>

      {/* --- Tutorial Modal --- */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* I'll will create and render this component later */}
      {/* <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} /> */}
    </>
  );
}
