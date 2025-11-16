// frontend/src/App.jsx
import React from "react";
import { Outlet } from "react-router-dom";

function AnimatedBackground() {
  return (
    <div className="background fixed inset-0 -z-10 overflow-hidden bg-[#121212]">
      {/* This uses Tailwind's arbitrary value support to create the same effect as in my original Serpix Game page */}
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#b0305c] top-[88%] left-[22%] animate-[move_100s_linear_infinite_reverse] shadow-[-40vmin_0_5.4vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#4b5bab] top-[42%] left-[84%] animate-[move_130s_linear_infinite_reverse] shadow-[40vmin_0_5.9vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#4b5bab] top-[64%] left-[9%] animate-[move_53s_linear_infinite_reverse] shadow-[-40vmin_0_5.1vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#4b5bab] top-[87%] left-[91%] animate-[move_81s_linear_infinite_reverse] shadow-[40vmin_0_5.3vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#b0305c] top-[13%] left-[33%] animate-[move_97s_linear_infinite_reverse] shadow-[40vmin_0_5.1vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#b0305c] top-[51%] left-[55%] animate-[move_42s_linear_infinite_reverse] shadow-[40vmin_0_5.3vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#3ca370] top-[87%] left-[40%] animate-[move_33s_linear_infinite_reverse] shadow-[40vmin_0_5.4vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#b0305c] top-[79%] left-[86%] animate-[move_79s_linear_infinite_reverse] shadow-[-40vmin_0_5.7vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#4b5bab] top-[77%] left-[38%] animate-[move_7s_linear_infinite_reverse] shadow-[-40vmin_0_5.9vmin_currentColor]"></span>
      <span className="absolute w-[20vmin] h-[20vmin] rounded-[20vmin] text-[#4b5bab] top-[47%] left-[85%] animate-[move_96s_linear_infinite_reverse] shadow-[40vmin_0_5.3vmin_currentColor]"></span>
    </div>
  );
}

function App() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      {/* The Outlet renders the current route (SetupPage or GamePage) */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
