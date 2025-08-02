import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  EnvelopeIcon,
  UserIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // For accessibility, show popup on focus as well as hover; hide on blur/mouseleave
  const handleProfileEnter = () => setProfileOpen(true);
  const handleProfileLeave = () => setProfileOpen(false);

  return (
    <header className="bg-white border-b border-black/10 sticky top-0 z-50 shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center font-sans select-none relative">
        {/* Brand Title */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold tracking-tight text-black transition-transform hover:scale-110 focus-visible:outline-none"
          aria-label="AI Sensei Home"
          onClick={() => setMenuOpen(false)}
        >
          AI Sensei
        </Link>

        {/* Hamburger menu (mobile only) */}
        <button
          type="button"
          className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {/* Hamburger icon or X icon */}
          <svg
            className="h-6 w-6 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {menuOpen ? (
              // X Icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navigation Links & Profile */}
        <div
          className={`
            ${menuOpen ? "flex" : "hidden"} sm:flex
            flex-col sm:flex-row
            sm:items-center
            space-y-2 sm:space-y-0 sm:space-x-8
            text-base font-medium text-black 
            absolute sm:static top-full left-0 sm:top-auto sm:left-auto
            z-40 sm:z-auto
            bg-white sm:bg-transparent
            w-full sm:w-auto
            p-4 sm:p-0
            rounded-b-lg sm:rounded-none
            shadow-md sm:shadow-none
            transition-all duration-200
          `}
        >
          {user ? (
            <>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors font-medium w-full sm:w-auto"
              >
                Home
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/ai-teacher"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
              >
                AI Teacher
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/dictionary"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
              >
                Dictionary
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/roadmaps"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
              >
                Roadmaps
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/chat"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
              >
                Chat
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="px-3 py-1 rounded border border-black font-semibold bg-white text-black hover:bg-black hover:text-white transition-all w-full sm:w-auto"
                aria-label="Logout"
              >
                Logout
              </button>
              {/* Profile Icon + Popup (visible in both desktop and mobile menu) */}
              <div
                className="relative ml-0 sm:ml-3 flex items-center"
                onMouseEnter={handleProfileEnter}
                onMouseLeave={handleProfileLeave}
                onFocus={handleProfileEnter}
                onBlur={handleProfileLeave}
                tabIndex={0}
                style={{ minWidth: "40px" }}
              >
                <div
                  className="w-10 h-10 rounded-full bg-black/10 cursor-pointer flex items-center justify-center"
                  aria-label="User Profile"
                  tabIndex={-1}
                >
                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-black/70" />
                </div>
                {/* Popup Profile */}
                {profileOpen && (
                  <div
                    className="absolute top-12 right-0 max-w-xs w-64 sm:w-80 p-4 bg-white border border-black/20 rounded-lg shadow-lg z-50 font-sans text-black flex flex-col justify-center space-y-3"
                    style={{ pointerEvents: "auto" }}
                  >
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-5 w-5 text-primary" />
                      <span
                        className="truncate text-sm font-medium text-black/80"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-black/90">
                        {user.name || "No name set"}
                      </span>
                    </div>
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
                onClick={() => setMenuOpen(false)}
                to="/login"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
              >
                Login
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/register"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Hide scrollbar for overflow-x */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
}
