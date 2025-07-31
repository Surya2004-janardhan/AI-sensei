import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dictionary from "./pages/Dictionary";
import Roadmaps from "./pages/Roadmaps";
import Quiz from "./pages/Quiz";
import AITeacher from "./pages/AITeacher";
import DoubtSolver from "./pages/DoubtSolver";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-background font-japanese text-textPrimary">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/dictionary" element={user ? <Dictionary /> : <Navigate to="/login" />} />
          <Route path="/roadmaps" element={user ? <Roadmaps /> : <Navigate to="/login" />} />
          <Route path="/quiz/:level" element={user ? <Quiz /> : <Navigate to="/login" />} />
          <Route path="/ai-teacher" element={user ? <AITeacher /> : <Navigate to="/login" />} />
          <Route path="/doubt-solver" element={user ? <DoubtSolver /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
          {/* Add 404 or redirect as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
