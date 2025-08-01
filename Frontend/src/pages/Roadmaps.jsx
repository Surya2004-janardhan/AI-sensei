import React, { useEffect, useState } from "react";
import roadmapAPI from "../api/roadmaps";

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    roadmapAPI
      .getRoadmaps()
      .then((res) => {
        setRoadmaps(res.data);
      })
      .catch(() => setError("Failed to load roadmaps"))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (id) => {
    setEnrolling(id);
    try {
      await roadmapAPI.enrollRoadmap(id);
      alert("Enrolled successfully!");
      // Optionally, update UI or re-fetch status here
    } catch {
      alert("Failed to enroll.");
    } finally {
      setEnrolling(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-black">
        <p className="text-lg font-semibold">Loading roadmaps...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-red-600">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-6 py-12 font-sans text-black">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">
        JLPT Roadmaps
      </h1>
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((rm) => (
          <div
            key={rm._id}
            className="bg-white border border-black/20 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] hover:shadow-2xl"
          >
            <div>
              <h2 className="text-xl font-semibold mb-3">{rm.title}</h2>
              <p className="text-sm text-black/80 mb-5">{rm.description}</p>
            </div>
            <button
              onClick={() => handleEnroll(rm._id)}
              disabled={enrolling === rm._id}
              className={`w-full py-3 rounded-md font-semibold transition
                ${
                  enrolling === rm._id
                    ? "bg-gray-500 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-gray-900"
                }
              `}
            >
              {enrolling === rm._id ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
