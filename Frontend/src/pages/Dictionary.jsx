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
      setResults(res.data); // Assuming API returns array (adjust if needed)
    } catch (err) {
      setError(`Failed to fetch dictionary data${err.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serifJapanese mb-6 text-primary">Dictionary</h1>
      <div className="flex max-w-md mb-8">
        <input
          type="text"
          className="flex-grow border rounded-l p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search Japanese word or romaji"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-secondary hover:bg-accent text-white rounded-r transition"
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-4">
        {results && results.length > 0 ? (
          results.map((entry) => (
            <li
              key={entry.slug}
              className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition"
            >
              <h2 className="font-serifJapanese text-xl mb-2">
                {entry.japanese?.map((j, idx) => (
                  <span key={idx} className="mr-2">
                    {j.word || j.reading}
                  </span>
                ))}
              </h2>
              <ul className="list-disc pl-6 text-sm text-textPrimary">
                {entry.senses?.map((sense, idx) => (
                  <li key={idx}>{sense.english_definitions?.join(", ")}</li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          !loading && <p>No results</p>
        )}
      </ul>
    </div>
  );
}
