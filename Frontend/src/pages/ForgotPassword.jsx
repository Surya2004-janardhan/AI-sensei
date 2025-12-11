import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Start countdown timer
  const startTimer = () => {
    setTimer(180); // 3 minutes
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      toast.success(response.data.msg || "OTP sent to your email");
      setStep(2);
      startTimer();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success(response.data.msg || "Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border border-black/20 bg-white p-6 sm:p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-black mb-10 text-center font-sans tracking-tight">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base"
              required
              disabled={loading}
              autoComplete="email"
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
                "Send OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {timer > 0 && (
              <div className="bg-black/5 border border-black/20 rounded-md p-3 text-center mb-4">
                <p className="text-sm text-black/80">
                  OTP expires in:{" "}
                  <span className="font-bold text-black">
                    {formatTime(timer)}
                  </span>
                </p>
              </div>
            )}

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-center text-2xl tracking-widest font-bold"
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base"
              required
              disabled={loading}
              autoComplete="new-password"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-black/40 rounded-md text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 text-sm sm:text-base"
              required
              disabled={loading}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={loading || timer === 0}
              className={`w-full py-3 rounded-md font-semibold tracking-wide text-white transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-black/70 ${
                loading || timer === 0
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
                "Reset Password"
              )}
            </button>

            {timer === 0 && (
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="w-full text-center text-sm text-gray-600 hover:text-black hover:underline transition"
              >
                OTP Expired? Request New OTP
              </button>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-black hover:underline transition"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
