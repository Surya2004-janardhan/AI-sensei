import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menus on navigation (good UX for mobile/tablet)
  const handleCloseMenus = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-black/10 sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center relative">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black transition-all hover:scale-105 font-sans"
          onClick={handleCloseMenus}
        >
          AI Sensei
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="h-6 w-6 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`
            ${menuOpen ? "flex" : "hidden"} lg:flex
            flex-col lg:flex-row
            lg:items-center
            space-y-2 lg:space-y-0 lg:space-x-4
            text-base font-semibold text-black
            absolute lg:static top-full left-0
            bg-white lg:bg-transparent
            w-full lg:w-auto
            p-4 lg:p-0
            rounded-b-lg lg:rounded-none
            shadow-lg lg:shadow-none
            transition-all duration-200
            z-40 lg:z-auto
            font-sans
          `}
        >
          {user ? (
            <>
              {[
                { to: "/", label: "Home" },
                { to: "/ai-teacher", label: "AI Teacher" },
                { to: "/dictionary", label: "Dictionary" },
                { to: "/roadmaps", label: "Roadmaps" },
                { to: "/chat", label: "Chat" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={handleCloseMenus}
                  className="px-4 py-2 rounded-md hover:bg-black hover:text-white transition-all duration-200 w-full lg:w-auto text-left hover:scale-105"
                >
                  {label}
                </Link>
              ))}

              <button
                onClick={() => {
                  logout();
                  handleCloseMenus();
                }}
                className="px-4 py-2 rounded-md border-2 border-black font-semibold bg-white text-black hover:bg-black hover:text-white transition-all duration-200 w-full lg:w-auto hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleCloseMenus}
                className="px-4 py-2 rounded-md hover:bg-black hover:text-white transition-all duration-200 w-full lg:w-auto text-left hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleCloseMenus}
                className="px-4 py-2 rounded-md border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 w-full lg:w-auto text-left hover:scale-105"
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
