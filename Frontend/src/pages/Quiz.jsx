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

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!quiz) return <p>No quiz available for this level.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-serifJapanese text-primary mb-6">{quiz.title}</h1>
      {quiz.questions.map((q, i) => (
        <div key={i} className="mb-4 p-4 border rounded bg-white">
          <p className="font-semibold mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, idx) => (
              <label key={idx} className="block cursor-pointer">
                <input
                  type="radio"
                  name={`question-${i}`}
                  value={option}
                  onChange={() => handleChange(i, option)}
                  checked={answers[i] === option}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
        className="bg-secondary text-white font-bold py-3 px-6 rounded hover:bg-accent transition"
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>

      {score !== null && <p className="mt-4 text-xl font-semibold">Your Score: {score}</p>}
    </div>
  );
}
