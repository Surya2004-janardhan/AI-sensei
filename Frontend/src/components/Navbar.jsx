import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  EnvelopeIcon,
  UserIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { useState, useRef } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileTimer = useRef(null);

  // Delayed hide to allow smooth hover between icon and popup
  const handleMouseLeave = () => {
    profileTimer.current = setTimeout(() => setProfileOpen(false), 200);
  };

  const handleMouseEnter = () => {
    clearTimeout(profileTimer.current);
    setProfileOpen(true);
  };

  return (
    <header className="bg-white border-b border-black/10 sticky top-0 z-50 shadow">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center font-sans select-none">
        {/* Brand Title - bold, Uber-style */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-black transition-transform hover:scale-110 focus-visible:outline-none"
          aria-label="AI Sensei Home"
        >
          AI Sensei
        </Link>

        {/* Navigation Links */}
        <div className="flex  items-center space-x-8 text-base font-medium text-black relative">
          {user ? (
            <>
              <Link
                to="/"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/ai-teacher"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
              >
                AI Teacher
              </Link>
              <Link
                to="/dictionary"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
              >
                Dictionary
              </Link>
              <Link
                to="/roadmaps"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
              >
                Roadmaps
              </Link>
              <Link
                to="/chat"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
              >
                Chat
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-3 py-1 rounded border border-black font-semibold bg-white text-black hover:bg-black hover:text-white transition-all"
                aria-label="Logout"
              >
                Logout
              </button>

              {/* Profile Icon + Minimal Info Popup */}
              <div
                className="relative ml-3 flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Small profile icon container (40x40 px) */}
                <div
                  className="w-10 h-10 rounded-full bg-black/10 cursor-pointer flex items-center justify-center"
                  aria-label="User Profile"
                  tabIndex={0}
                  onFocus={handleMouseEnter}
                  onBlur={handleMouseLeave}
                >
                  <UserIcon className="h-6 w-6  text-black/70" />
                </div>

                {/* Popup minimal profile info box */}
                {profileOpen && (
                  <div
                    className="absolute top-12 right-0 w-80 h-40 p-4 bg-white border border-black/20 rounded-lg shadow-lg z-50 font-sans text-black flex flex-col justify-center space-y-3"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ pointerEvents: "auto" }}
                  >
                    {/* Email */}
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-5 w-5 text-primary" />
                      <span
                        className="truncate text-sm font-medium text-black/80"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-black/90">
                        {user.name || "No name set"}
                      </span>
                    </div>

                    {/* JLPT Level */}
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-black/80">
                        JLPT Level:{" "}
                        <span className="font-semibold">
                          {user.jlptLevel || "N5"}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
