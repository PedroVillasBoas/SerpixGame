// frontend/src/pages/SetupPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import { TutorialModal } from "../components/ui/TutorialModal";

export default function SetupPage() {
  const [playerName, setPlayerName] = useState("Player");
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
    if (socket.connected) {
      setStatus("Looking for game...");
      socket.emit("findGame", playerName);
    } else {
      setStatus("Not connected to server.");
    }
  };

  const buttonBaseStyle =
    "flex-1 h-[3.5em] text-xl font-bold text-white bg-[#242424] border-4 rounded-md transition-all";

  // I'll will port the leaderboard later
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-[#242424] p-8 rounded-lg shadow-xl max-w-md w-full">
          <img
            src="/assets/visual/img/logo.png"
            alt="Serpix Logo"
            className="mx-auto mb-4 max-w-[80%]"
          />
          <p className="mb-6 text-gray-300">
            A hybrid of Snake, Pong, and Slither.io... now online!
          </p>

          <form
            id="setup-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col text-left">
              <label
                htmlFor="player"
                className="mb-2 font-bold text-lg text-blue-400"
              >
                Your Name
              </label>
              <input
                type="text"
                id="player"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-[3.5em] text-2xl font-bold text-white bg-[#242424] border-4 border-green-500 rounded-md transition-all hover:shadow-[inset_0_0_25px_#86ea14]"
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
