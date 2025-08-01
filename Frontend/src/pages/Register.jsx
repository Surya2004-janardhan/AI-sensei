import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ email, password, name });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <h1 className="text-3xl font-semibold text-black mb-8 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-500 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-500 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-500 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
