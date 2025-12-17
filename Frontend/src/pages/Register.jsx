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
  const [showPassword, setShowPassword] = useState(false);

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
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            autoComplete="name"
            className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base transition-all"
          />
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base transition-all"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition"
              disabled={loading}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
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
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-black font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
