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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md font-japanese">
      <h1 className="text-4xl font-serifJapanese text-primary mb-8">AI Teacher</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          placeholder="Ask your Japanese language question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-secondary text-white font-bold px-6 py-3 rounded hover:bg-accent transition"
        >
          {loading ? "Thinking..." : "Ask AI Teacher"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {answer && (
        <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          <h2 className="text-2xl font-semibold mb-2">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
