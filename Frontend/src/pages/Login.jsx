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
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border border-black/20 bg-white p-6 sm:p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black mb-6 text-center">
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
            className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold tracking-wide text-white transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-black/70 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 hover:scale-[1.03]"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-6 w-6 mx-auto"
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
