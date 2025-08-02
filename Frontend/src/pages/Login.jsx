import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start loader
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      console.log("failed");
      setError("Invalid credentials");
    } finally {
      setLoading(false); // stop loader in both success and failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white border border-black/20 shadow-lg rounded-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black mb-6 text-center font-sans tracking-tight">
          Login
        </h1>
        {error && (
          <p className="text-red-600 mb-4 text-center text-sm sm:text-base">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Disable input while loading
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input while loading
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold tracking-wide text-white
              transition-transform duration-150 ease-in-out focus-visible:outline-none 
              focus-visible:ring-4 focus-visible:ring-black/70
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900 hover:scale-[1.03]"
              }`}
            aria-busy={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-6 w-6 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
