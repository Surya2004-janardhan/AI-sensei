import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

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
        <div className="flex items-center space-x-8 text-base font-medium text-black">
          {user ? (
            <>
              <Link
                to="/profile"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors font-medium"
              >
                Profile
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
                to="/history"
                className="px-3 py-1 rounded hover:bg-black hover:text-white transition-colors"
              >
                History
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 rounded border border-black font-semibold bg-white text-black hover:bg-black hover:text-white transition-all"
                aria-label="Logout"
              >
                Logout
              </button>
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
