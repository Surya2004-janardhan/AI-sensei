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

  if (loading) return <p>Loading your AI interactions...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-serifJapanese text-primary mb-6">Your Past AI Interactions</h1>
      {history.length === 0 ? (
        <p>No interactions found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map(({ _id, question, answer, date }) => (
            <li key={_id} className="p-4 bg-white rounded-lg shadow-sm">
              <p className="font-semibold mb-1">Q: {question}</p>
              <p className="mb-2 text-gray-700 whitespace-pre-wrap">A: {answer}</p>
              <small className="text-gray-500">{new Date(date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
