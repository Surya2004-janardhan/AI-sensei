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
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-lg border border-black/20">
        <h1 className="text-4xl font-extrabold text-black mb-10 text-center font-sans tracking-tight">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-7">
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
          />
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold tracking-wide 
              hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/70 
              transition-transform duration-150 ease-in-out hover:scale-[1.03]"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
