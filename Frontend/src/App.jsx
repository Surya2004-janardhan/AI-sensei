import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./contexts/AuthContext";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Dictionary = lazy(() => import("./pages/Dictionary.jsx"));
const Roadmaps = lazy(() => import("./pages/Roadmaps.jsx"));
const Quiz = lazy(() => import("./pages/Quiz.jsx"));
const AITeacher = lazy(() => import("./pages/AITeacher.jsx"));
const DoubtSolver = lazy(() => import("./pages/DoubtSolver.jsx"));
const Chat = lazy(() => import("./pages/ChatNew.jsx"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <svg
      className="animate-spin h-12 w-12 text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

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
      <div className="min-h-screen bg-background-pink font-japanese text-text-primary">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
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
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/" />}
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
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastStyle={{
            backgroundColor: "black",
            color: "white",
          }}
          progressStyle={{
            backgroundColor: "white",
          }}
        />
      </div>
    </Router>
  );
}

export default App;
