import React from "react";
import { Link } from "react-router-dom";

// Import your background image (adjust path as needed)
import cherryCastle from "../../public/logoo.jpg"; // adjust to your actual path

// India Marker
const IndiaMarker = () => (
  <div className="flex flex-col items-center space-y-1 select-none">
    <span className="text-4xl" aria-label="Namaskaram" role="img">
      🙏
    </span>
    <span className="text-xs font-semibold uppercase tracking-wide text-black/60">
      India
    </span>
  </div>
);
// Japan Marker
const JapanMarker = () => (
  <div className="flex flex-col items-center space-y-1 select-none">
    <span className="text-4xl" aria-label="Bowing man" role="img">
      🙇‍♂️
    </span>
    <span className="text-xs font-semibold uppercase tracking-wide text-black/60">
      Japan
    </span>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black overflow-x-hidden relative">
      {/* Soft background image */}
      {/* <img
        src={cherryCastle}
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none z-0"
        style={{ minHeight: "100vh" }} */}
      {/* /> */}

      {/* Main Content (z-10 to stay above the bg) */}
      <main className="flex-grow overflow-auto mb-4 px-6 py-16 flex flex-col justify-center items-center pb-20 relative z-10">
        {/* Animated airplane and flags */}
        <div className="w-full flex flex-col items-center mb-14 max-w-md">
          <div className="flex justify-between items-center w-full relative h-15">
            <IndiaMarker />
            <div className="relative flex-1 flex items-center justify-center h-full">
              <span
                className="absolute left-0 top-6"
                style={{
                  animation: "paperplane-fly 7s ease-in-out infinite",
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
          <div className="w-full">
            <span className="block mt-2 text-center text-2xl font-bold select-none opacity-50 tracking-wide">
              Connecting Cultures
            </span>
          </div>
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

        {/* Main Welcome card */}
        <div className="max-w-3xl bg-white border border-black/20 rounded-lg shadow-lg p-10 text-center bg-opacity-90 z-10">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Welcome to{" "}
            <span className="text-primary font-serifJapanese">AI Sensei</span>{" "}
            🌸
          </h1>
          <p className="text-lg text-black/80 mb-8 leading-relaxed font-japanese">
            Your personalized AI-powered Japanese language teacher.
            <br />
            Explore lessons, quizzes, and real-time dictionary support to master
            Japanese levels and beyond.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/ai-teacher"
              className="px-6 py-3 rounded-md bg-black text-white font-semibold shadow-md hover:bg-gray-900 transition-transform duration-150 hover:scale-[1.05]"
            >
              Talk to AI Teacher
            </Link>
            <Link
              to="/roadmaps"
              className="px-6 py-3 rounded-md border border-black text-black font-semibold hover:bg-black hover:text-white transition-transform duration-150 hover:scale-[1.05]"
            >
              Browse Roadmaps
            </Link>
          </div>
        </div>
        <div className="text-sm text-black/60 font-serifJapanese text-center py-10 my-1 select-none">
          🌸 頑張ってください! (Good luck with your studies!)
        </div>
      </main>

      {/* Fixed Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black text-white py-3 z-50 select-none w-full">
        <div className="max-w-md mx-auto px-4 text-center font-serifJapanese text-base leading-snug">
          <span className="block mb-0.5 text-lg font-semibold">
            「千里の道も一歩から」
          </span>
          <span className="block text-sm opacity-85">
            — A journey of a thousand miles begins with a single step.
          </span>
          <p className="mt-2 text-xs font-sans">
            Made with <span className="text-pink-500">❤</span> |{" "}
            <a
              href="mailto:chintalajanardhan2004@gmail.com"
              className="underline hover:text-pink-500"
            >
              chintalajanardhan2004@gmail.com
            </a>
          </p>
        </div>
      </footer>
      {/* Block unwanted scroll/white-space */}
      <style>{`
        html, body, #root { overflow-x: hidden; }
      `}</style>
    </div>
  );
}
