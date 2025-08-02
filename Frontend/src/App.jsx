import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Dictionary from "./pages/Dictionary.jsx";
import Roadmaps from "./pages/Roadmaps.jsx";
import Quiz from "./pages/Quiz.jsx";
import AITeacher from "./pages/AITeacher.jsx";
import DoubtSolver from "./pages/DoubtSolver.jsx";
import Chat from "./pages/Chat.jsx";
import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-pink font-japanese text-text-primary">
        <svg
          className="animate-spin h-12 w-12 text-secondary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <main className="min-h-screen w-full font-japanese text-text-primary ">
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/dictionary"
            element={user ? <Dictionary /> : <Navigate to="/login" />}
          />
          <Route
            path="/roadmaps"
            element={user ? <Roadmaps /> : <Navigate to="/login" />}
          />
          <Route
            path="/quiz/:level"
            element={user ? <Quiz /> : <Navigate to="/login" />}
          />
          <Route
            path="/ai-teacher"
            element={user ? <AITeacher /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/login" />}
          />
          <Route
            path="/doubt-solver"
            element={user ? <DoubtSolver /> : <Navigate to="/login" />}
          />
          {/* Add 404 or redirect route here if desired */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
