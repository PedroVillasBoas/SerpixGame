import React from "react";

export function TutorialModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    // Modal background
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Modal content */}
      <div
        className="bg-[#242424] p-8 rounded-lg shadow-xl text-left animate-modal-pop w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <span
          className="absolute top-2 right-5 text-4xl text-gray-400 cursor-pointer hover:text-white"
          onClick={onClose}
        >
          &times;
        </span>

        {/* Tutorial Content */}
        <h1 className="text-3xl font-bold text-center mb-4">Tutorial</h1>
        <p className="text-gray-300">Thank you for playing Serpix!</p>

        <h2 className="text-2xl font-bold mt-6 mb-2 text-yellow-400">Goal</h2>
        <p className="text-gray-300">
          The goal is to force your opponent to collide with your snake's body.
          Each player starts with 3 lives. The first player to reduce their
          opponent's lives to zero wins! Eating the bouncing ball will increase
          your score and make your snake longer!
        </p>
        <p className="text-gray-300 mt-2">Good luck and have fun!</p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-yellow-400">
          Controls
        </h2>
        <p className="text-center text-gray-400 mb-4">
          This game uses the same controls for both players (A/D or Left/Right
          arrows).
        </p>
        <div className="flex justify-around my-4">
          {/* Player 1 Controls */}
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-blue-400 mb-3">Player 1</h3>
            <div className="flex justify-center gap-4">
              <img
                src="/assets/visual/sprites/p1_left.svg"
                alt="Player 1 Left"
                className="w-16 h-16"
              />
              <img
                src="/assets/visual/sprites/p1_right.svg"
                alt="Player 1 Right"
                className="w-16 h-16"
              />
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-300 mt-2">
              <span className="w-16 text-center">Go Left</span>
              <span className="w-16 text-center">Go Right</span>
            </div>
          </div>
          {/* Player 2 Controls */}
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-red-500 mb-3">Player 2</h3>
            <div className="flex justify-center gap-4">
              <img
                src="/assets/visual/sprites/p2_left.svg"
                alt="Player 2 Left"
                className="w-16 h-16"
              />
              <img
                src="/assets/visual/sprites/p2_right.svg"
                alt="Player 2 Right"
                className="w-16 h-16"
              />
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-300 mt-2">
              <span className="w-16 text-center">Go Left</span>
              <span className="w-16 text-center">Go Right</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mt-8">
          Thank You For Playing!
        </h2>
      </div>
    </div>
  );
}
