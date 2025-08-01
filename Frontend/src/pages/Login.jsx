import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md bg-white border border-black/20 shadow-lg rounded-lg p-10">
        <h1 className="text-4xl font-extrabold text-black mb-8 text-center font-sans tracking-tight">
          Login
        </h1>
        {error && <p className="text-red-600 mb-6 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
                       focus:outline-none "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
                                   focus:outline-none "

            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold tracking-wide 
                       hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/70 
                       transition-transform duration-150 ease-in-out hover:scale-[1.03]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
