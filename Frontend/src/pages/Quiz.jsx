import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import quizAPI from "../api/quiz";

export default function Quiz() {
  const { level } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    quizAPI
      .getQuiz(level)
      .then((res) => setQuiz(res.data))
      .catch(() => setError("Failed to load quiz"))
      .finally(() => setLoading(false));
  }, [level]);

  const handleChange = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await quizAPI.submitQuiz({ quizId: quiz._id, answers: Object.values(answers) });
      setScore(res.data.score);
    } catch {
      setError("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
        <p className="text-lg font-semibold">Loading quiz...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-red-600">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
        <p className="text-lg font-semibold">No quiz available for this level.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-6 py-12 font-sans text-black max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold font-serifJapanese text-black mb-10 tracking-tight">
        {quiz.title}
      </h1>

      {quiz.questions.map((q, i) => (
        <div
          key={i}
          className="mb-6 p-6 border border-black/20 rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
        >
          <p className="font-semibold mb-4 text-lg">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, idx) => (
              <label
                key={idx}
                className="block cursor-pointer select-none rounded-md px-4 py-2 border border-black/30 hover:bg-black/5 transition"
              >
                <input
                  type="radio"
                  name={`question-${i}`}
                  value={option}
                  onChange={() => handleChange(i, option)}
                  checked={answers[i] === option}
                  className="mr-3 align-middle"
                />
                <span className="align-middle">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
        className={`w-full py-3 rounded-md font-semibold tracking-wide transition-transform duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/70
          ${
            submitting || Object.keys(answers).length !== quiz.questions.length
              ? "bg-gray-400 cursor-not-allowed text-gray-700"
              : "bg-black text-white hover:bg-gray-900 hover:scale-[1.03]"
          }
        `}
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>

      {score !== null && (
        <p className="mt-8 text-2xl font-extrabold text-black text-center">
          Your Score: {score}
        </p>
      )}
    </div>
  );
}
