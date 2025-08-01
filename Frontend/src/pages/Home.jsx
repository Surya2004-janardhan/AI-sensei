import React from "react";
import { Link } from "react-router-dom";

// India Marker
const IndiaMarker = () => (
  <div className="flex flex-col items-center space-y-1 select-none">
    <span className="text-4xl" aria-label="Namaskaram" role="img">🙏</span>
    <span className="text-xs font-semibold uppercase tracking-wide text-black/60">India</span>
  </div>
);

// Japan Marker
const JapanMarker = () => (
  <div className="flex flex-col items-center space-y-1 select-none">
    <span className="text-4xl" aria-label="Bowing man" role="img">🙇‍♂️</span>
    <span className="text-xs font-semibold uppercase tracking-wide text-black/60">Japan</span>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-16 font-sans text-black">
      
      {/* Route visualization with Paper Airplane */}
      <div className="w-full flex flex-col items-center mb-14">
        {/* Icons + Animated Paper Airplane */}
        <div className="flex justify-between items-center w-[360px] max-w-full mx-auto relative h-20">
          <IndiaMarker />
          <div className="  relative flex-1 flex items-center justify-center h-full ">
            {/* Animated Paper Airplane */}
            <span
              className="absolute left-0 top-6 "
              style={{
              animation: "paperplane-fly 7s ease-in-out infinite", // run once, smoother easing
                fontSize: "2.5rem",
                zIndex: 10,
              }}
              role="img"
              aria-label="Paper Airplane"
            >
              🛩️
            </span>
          </div>
          <JapanMarker />
        </div>
        {/* "Connecting Cultures" now just below, with margin */}
        <div className="w-[360px] max-w-full mx-auto">
          <span className="block mt-2 text-center text-2xl font-bold select-none opacity-50 tracking-wide">
            Connecting Cultures
          </span>
        </div>
        {/* Keyframes for the airplane */}
        <style>
          {`
          @keyframes paperplane-fly {
          0%   { left: -10px;  top: 19px; transform: rotate(-14deg); }
          15%  { left: 32px;   top: 7px;  transform: rotate(-9deg); }
          35%  { left: 75px;   top: 0px;  transform: rotate(3deg); }
          55%  { left: 120px;  top: 9px;  transform: rotate(16deg); }
          75%  { left: 180px;  top: 20px; transform: rotate(9deg); }
          90%  { left: 230px;  top: 6px;  transform: rotate(3deg); }
          100% { left: 260px;  top: 19px; transform: rotate(-11deg); }
        }


          `}
        </style>
      </div>

      {/* Main Welcome card and content ... unchanged ... */}
      <div className="max-w-3xl bg-white border border-black/20 rounded-lg shadow-lg p-10 text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          Welcome to <span className="text-primary font-serifJapanese">AI Sensei</span> 🌸
        </h1>
        <p className="text-lg text-black/80 mb-8 leading-relaxed font-japanese">
          Your personalized AI-powered Japanese language teacher.<br />
          Explore lessons, quizzes, and real-time dictionary support to master JLPT levels and beyond.
        </p>

        <div className="flex justify-center space-x-6">
          <Link
            to="/ai-teacher"
            className="px-6 py-3 rounded-md bg-black text-white font-semibold shadow-md 
                      hover:bg-gray-900 transition-transform duration-150 hover:scale-[1.05]"
          >
            Talk to AI Teacher
          </Link>
          <Link
            to="/roadmaps"
            className="px-6 py-3 rounded-md border border-black text-black font-semibold 
                      hover:bg-black hover:text-white transition-transform duration-150 hover:scale-[1.05]"
          >
            Browse Roadmaps
          </Link>
        </div>
      </div>
      <footer className="mt-20 text-sm text-black/60 font-serifJapanese select-none">
        🌸 頑張ってください! (Good luck with your studies!)
      </footer>
    </div>
  );
}
