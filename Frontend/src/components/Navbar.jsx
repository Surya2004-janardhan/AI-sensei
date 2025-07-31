import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center font-japanese">
        <Link to="/" className="text-2xl font-serifJapanese text-primary">
          AI Sensei
        </Link>
        <div className="space-x-6 text-sm font-semibold text-textPrimary">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-secondary">Profile</Link>
              <Link to="/ai-teacher" className="hover:text-secondary">AI Teacher</Link>
              <Link to="/dictionary" className="hover:text-secondary">Dictionary</Link>
              <Link to="/roadmaps" className="hover:text-secondary">Roadmaps</Link>
              <Link to="/history" className="hover:text-secondary">History</Link>
              <button
                onClick={logout}
                className="text-accent hover:text-secondary transition px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary">Login</Link>
              <Link to="/register" className="hover:text-secondary">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
