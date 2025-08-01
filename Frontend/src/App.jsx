import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Dictionary from "./pages/Dictionary.jsx";
import Roadmaps from "./pages/Roadmaps.jsx";
import Quiz from "./pages/Quiz.jsx";
import AITeacher from "./pages/AITeacher.jsx";
import DoubtSolver from "./pages/DoubtSolver.jsx";
import History from "./pages/History.jsx";
import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
    <main className="min-h-screen w-full font-japanese text-text-primary">
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
      </main>
    </Router>
  );
}

export default App;

// export default function App() {
//   return <div className="max-w-8xl mx-auto px-4  bg-amber-300 py-6 min-h-screen bg-background-pink font-japanese text-textPrimary transition-colors">Sample text </div>
//  }
