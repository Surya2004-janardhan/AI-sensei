import React, { useState  } from "react";
import  {useAuth}  from "../contexts/AuthContext";
import {updateProfile} from "../api/auth";

export default function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [jlptLevel, setJlptLevel] = useState(user?.jlptLevel || "N5");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await updateProfile({ name, jlptLevel });
      console.log(res.data)
      setMsg("Profile updated successfully!");
    } catch (err) {
        console.log(err.message)
      setMsg("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-serifJapanese mb-6 text-primary">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={user?.email}
            disabled
            className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">JLPT Level</label>
          <select
            value={jlptLevel}
            onChange={(e) => setJlptLevel(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {["N5", "N4", "N3", "N2", "N1"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-secondary hover:bg-accent text-white font-bold py-3 rounded w-full transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {msg && <p className="mt-2 text-center text-green-600">{msg}</p>}
      </form>
      <button
        onClick={logout}
        className="mt-4 text-red-600 hover:text-red-800 font-semibold block mx-auto"
      >
        Logout
      </button>
    </div>
  );
}
