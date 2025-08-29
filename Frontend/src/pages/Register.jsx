import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start loaderrs

    try {
      const res = await register({ email, password, name });
      console.log(res.data.user);
      if (res.data.user) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 2000,
          style: {
            backgroundColor: "#000", // black background
            border: "1px solid lightgrey", // light grey border
            color: "#fff", // white text
          },
        });
        navigate("/");
        return;
      }
    } catch {
      toast.success("Registration Failed!", {
        position: "top-right",
        autoClose: 2000,
        style: {
          backgroundColor: "#000", // black background
          border: "1px solid lightgrey", // light grey border
          color: "#fff", // white text
        },
      });
      console.log("failed");
      setError("User with same email exists");
    } finally {
      setLoading(false); // stop loader in both success and failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-lg border border-black/20">
        <h1 className="text-4xl font-extrabold text-black mb-10 text-center font-sans tracking-tight">
          Register
        </h1>
        {error && (
          <p className="text-red-600 mb-4 text-center text-sm sm:text-base">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-7">
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading} // Disable input while loading
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
          />
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Disable input while loading
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input while loading
            className="w-full px-5 py-3 border border-black/40 rounded-md text-black placeholder-black/60
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
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
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
