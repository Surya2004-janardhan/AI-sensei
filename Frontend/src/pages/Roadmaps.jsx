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
      // Optionally update UI to reflect enrollment
    } catch {
      alert("Failed to enroll.");
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) return <p>Loading roadmaps...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-serifJapanese text-primary mb-6">JLPT Roadmaps</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {roadmaps.map((rm) => (
          <div key={rm._id} className="p-4 border rounded shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">{rm.title}</h2>
            <p className="mb-3 text-sm">{rm.description}</p>
            <button
              onClick={() => handleEnroll(rm._id)}
              disabled={enrolling === rm._id}
              className="bg-secondary text-white rounded px-4 py-2 hover:bg-accent transition"
            >
              {enrolling === rm._id ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
