import React, { useState } from "react";
import aiAPI from "../api/ai.js";

export default function AITeacher() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const res = await aiAPI.askTeacher({ question });
      setAnswer(res.data.answer);
    } catch {
      setError("Failed to get answer from AI Teacher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-4xl mx-auto font-sans text-black">
      <h1 className="text-4xl font-extrabold font-serifJapanese text-black mb-10 text-center tracking-tight">
        AI Teacher
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          rows={5}
          placeholder="Ask your Japanese language question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-5 border border-black/40 rounded-md resize-none text-black placeholder-black/60
                     focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
          disabled={loading}
          aria-label="Input your Japanese language question"
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className={`w-full py-3 rounded-md font-semibold tracking-wide text-white
            transition-transform duration-150 ease-in-out focus-visible:outline-none 
            focus-visible:ring-4 focus-visible:ring-black/70
            ${
              loading || !question.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 hover:scale-[1.03]"
            }
          `}
          aria-busy={loading}
        >
          {loading ? (
            // Simple spinner icon using SVG
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
            "Ask AI Teacher"
          )}
        </button>
      </form>

      {error && (
        <p className="text-center mt-6 text-red-600 font-semibold" role="alert">
          {error}
        </p>
      )}

      {answer && (
        <section
          className="mt-10 p-6 border border-black/20 rounded-lg bg-gray-50 shadow-md whitespace-pre-wrap text-black font-sans"
          aria-live="polite"
        >
          <h2 className="text-2xl font-bold mb-3">Answer:</h2>
          <p>{answer}</p>
        </section>
      )}
    </div>
  );
}
