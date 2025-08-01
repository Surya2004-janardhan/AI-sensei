import React, { useState } from "react";

export default function DoubtSolver() {
  const [doubt, setDoubt] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doubt.trim()) return;
    setLoading(true);
    setError("");
    try {
      // Replace this with real API call
      // const res = await aiAPI.solveDoubt({ doubt });
      // setAnswers(prev => [...prev, { question: doubt, answer: res.data.answer }]);
      
      // MOCK response for demo
      const mockAnswer = `AI Response to: "${doubt}" (This is a mock response.)`;
      setAnswers((prev) => [...prev, { question: doubt, answer: mockAnswer }]);
      setDoubt("");
    } catch (err) {
      console.log(err)
      setError("Failed to get an answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold font-serifJapanese mb-8 text-center tracking-tight">
        Doubt Solver
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <label htmlFor="doubtInput" className="block font-semibold mb-2">
          Enter your Japanese language doubt or question:
        </label>
        <textarea
          id="doubtInput"
          rows={4}
          className="w-full p-4 border border-black/40 rounded-lg resize-none text-black placeholder-black/60
            focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition"
          placeholder="Type your doubt here..."
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full py-3 rounded-md font-semibold tracking-wide transition-transform
            duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/70
            text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900 hover:scale-[1.03]"
            }`}
          disabled={loading}
        >
          {loading ? "Solving..." : "Ask AI Doubt Solver"}
        </button>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </form>

      <section>
        <h2 className="text-2xl font-bold mb-4 border-b border-black/20 pb-2">Previous Answers</h2>
        {answers.length === 0 ? (
          <p className="text-center text-black/70 italic">No doubts asked yet.</p>
        ) : (
          <ul className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            {answers.map(({ question, answer }, idx) => (
              <li key={idx} className="p-4 border border-black/20 rounded-lg shadow-sm bg-white transition hover:shadow-md">
                <p className="font-semibold mb-2">❓ {question}</p>
                <p className="whitespace-pre-wrap text-black/90">💡 {answer}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
