import React, { useState } from "react";
import dictionaryAPI from "../api/dictionary";

export default function Dictionary() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await dictionaryAPI.searchWord(query);
      setResults(res.data); // Assuming API returns an array
    } catch (err) {
      setError(`Failed to fetch dictionary data: ${err.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-5xl mx-auto font-sans text-black">
      <h1 className="text-4xl font-extrabold font-serifJapanese mb-10 text-center tracking-tight">
        Dictionary
      </h1>

      <div className="flex max-w-md mx-auto mb-8 shadow-md rounded-md overflow-hidden border border-black/20">
        <input
          type="text"
          className="flex-grow px-4 py-3 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black transition"
          placeholder="Search Japanese word or romaji"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          aria-label="Dictionary search input"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/70"
          aria-label="Execute dictionary search"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="text-center text-black/70 font-medium mb-6">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
      )}

      {results && results.length > 0 ? (
        <ul className="space-y-6">
          {results.map((entry) => (
            <li
              key={entry.slug}
              className="p-6 border border-black/20 rounded-lg shadow-md bg-white hover:shadow-xl transition"
            >
              <h2 className="font-serifJapanese text-2xl mb-3 text-black">
                {entry.japanese?.map((j, idx) => (
                  <span key={idx} className="mr-3">
                    {j.word || j.reading}
                  </span>
                ))}
              </h2>
              <ul className="list-disc pl-6 text-base text-black/85 space-y-1">
                {entry.senses?.map((sense, idx) => (
                  <li key={idx}>{sense.english_definitions?.join(", ")}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <p className="text-center text-black/60 italic font-medium mt-8">
            No results found.
          </p>
        )
      )}
    </div>
  );
}
