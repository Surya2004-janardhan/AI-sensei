import React, { useEffect, useState } from "react";
import historyAPI from "../api/history";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    historyAPI
      .getHistory()
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
        <p className="text-lg font-semibold">Loading your AI interactions...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-red-600">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-6 py-12 font-sans text-black max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold font-serifJapanese mb-10 text-center">
        Your Past AI Interactions
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-black/70 font-semibold text-lg">No interactions found.</p>
      ) : (
        <ul className="space-y-6">
          {history.map(({ _id, question, answer, date }) => (
            <li
              key={_id}
              className="p-6 bg-white border border-black/10 rounded-lg shadow-md transition-transform hover:scale-[1.02] hover:shadow-xl"
            >
              <p className="font-semibold text-lg mb-3">Q: {question}</p>
              <p className="mb-4 text-black/90 whitespace-pre-wrap">{answer}</p>
              <small className="text-black/50 block text-right">{new Date(date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
