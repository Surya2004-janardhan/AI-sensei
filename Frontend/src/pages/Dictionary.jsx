import React, { useState, useEffect } from "react";
import dictionaryAPI from "../api/dictionary";

const STORAGE_KEY = "aiSenseiDictionarySearches";

export default function Dictionary() {
  const [query, setQuery] = useState("");
  // Current results: simplified entries
  const [results, setResults] = useState([]);
  // Previous searches: array of { query, results }
  const [pastSearches, setPastSearches] = useState([]);
  // Controls how many previous search cards to show (increments by 2)
  const [prevSearchesVisibleCount, setPrevSearchesVisibleCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load past searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPastSearches(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save updated past searches into localStorage + state
  const saveSearches = (searches) => {
    setPastSearches(searches);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  };

  // Search handler: fetches dictionary data, simplifies, updates
  const handleSearch = async (searchQuery = null) => {
    const q = searchQuery ?? query;
    if (!q.trim()) return;

    setError("");
    setLoading(true);
    try {
      const res = await dictionaryAPI.searchWord(q);

      const simplifiedResults = (res?.data || []).slice(0, 2).map((entry) => {
        const { japanese, senses, is_common } = entry;

        const firstJapanese = japanese && japanese.length > 0 ? japanese[0] : { word: "", reading: "" };
        const firstSense = senses && senses.length > 0 ? senses[0] : {};

        const word = firstJapanese.word || "";
        const reading = firstJapanese.reading || "";
        const isKanaOnly = !word && !!reading;

        return {
          word,
          reading,
          definitions: firstSense.english_definitions || [],
          partsOfSpeech: firstSense.parts_of_speech || [],
          tags: firstSense.tags || [],
          isKanaOnly,
          common: is_common ?? false,
          slug: entry.slug || "",
          query: q,
        };
      });

      setResults(simplifiedResults);

      // Update past searches: remove existing same query, prepend new, limit to 10
      let updatedSearches = pastSearches.filter((item) => item.query !== q);
      updatedSearches.unshift({ query: q, results: simplifiedResults });

      if (updatedSearches.length > 10) updatedSearches = updatedSearches.slice(0, 10);
      saveSearches(updatedSearches);

      // Reset previous searches visibility count for expanded view
      setPrevSearchesVisibleCount(2);
    } catch (err) {
      setError(`Failed to fetch dictionary data: ${err.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Clicking on past search loads that search's results and query string
  const handleOldSearchClick = (item) => {
    setResults(item.results);
    setQuery(item.query);
  };

  // Show 2 more past searches in the UI
  const handleShowMorePrevSearches = () => {
    setPrevSearchesVisibleCount((oldCount) =>
      Math.min(oldCount + 2, pastSearches.length - 1)
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-5xl mx-auto font-sans text-black">
      <h1 className="text-4xl font-extrabold font-serifJapanese mb-10 text-center tracking-tight">
        Dictionary
      </h1>

      {/* Search bar */}
      <div className="flex max-w-md mx-auto mb-6 shadow-md rounded-md overflow-hidden border border-black/20">
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
          onClick={() => handleSearch()}
          className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/70"
          aria-label="Execute dictionary search"
        >
          Search
        </button>
      </div>

      {/* Past Searches - visually smaller with adjusted margin for 'Old Search' badge */}
      {pastSearches.length > 1 && (
        <section
          aria-label="Previous dictionary searches"
          className="mb-10 max-w-5xl mx-auto"
          style={{ maxHeight: "220px", overflowY: "auto" }}
        >
          <h2 className="text-xl font-semibold mb-4">Previous Searches</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pastSearches.slice(1, prevSearchesVisibleCount + 1).map((item, idx) => (
              <div
                key={`${item.query}-${idx}`}
                onClick={() => handleOldSearchClick(item)}
                className="cursor-pointer relative p-3 border border-black/10 rounded-md shadow-sm bg-black/5 text-black/80 transition-transform transform scale-75 hover:scale-90"
                aria-label={`Previous search results for ${item.query}`}
              >
                {/* Old Search badge with increased bottom margin so no collision */}
                {/* {idx !== 0 && (
                  // <span className="absolute top-2 left-2 mb-3 px-2 py-0.5 whitespace-nowrap text-xs font-bold uppercase bg-black text-white rounded select-none">
                  //   Old Search
                  // </span>
                )} */}

                {/* Query Text */}
                <p className="font-semibold truncate">{item.query}</p>

                {/* Show results summary */}
                <ul className="list-disc pl-5 mt-1 max-h-20 overflow-auto text-xs space-y-1 text-black/50">
                  {(item.results || []).slice(0, 2).map((entry, i) => (
                    <li key={i}>
                      <span className="font-serifJapanese">{entry.word || entry.reading}</span>:{" "}
                      {entry.definitions.slice(0, 2).join(", ")}
                    </li>
                  ))}
                  {item.results.length > 2 && <li>...and more</li>}
                </ul>
              </div>
            ))}
          </div>

          {/* Show More button */}
          {prevSearchesVisibleCount + 1 < pastSearches.length && (
            <button
              onClick={handleShowMorePrevSearches}
              className="mt-4 px-4 py-2 text-sm bg-black/10 rounded-md text-black/60 hover:text-black hover:bg-black/20 transition"
              aria-label="Show more previous searches"
            >
              Show More
            </button>
          )}
        </section>
      )}

      {/* Current Search Results */}
      <main>
        {loading && (
          <p className="text-center text-black/70 font-medium mb-6">Loading...</p>
        )}

        {error && (
          <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
        )}

        {results && results.length > 0 && (
          <ul className="space-y-8">
            {results.map(
              (
                { word, reading, definitions, partsOfSpeech, tags, isKanaOnly, common },
                idx
              ) => (
                <li
                  key={`${word}-${idx}`}
                  className="p-6 border border-black/20 rounded-lg shadow-md bg-white hover:shadow-xl transition"
                >
                  {/* Japanese Word and Reading */}
                  <h2 className="font-serifJapanese text-2xl mb-2 text-black flex flex-wrap items-center gap-3">
                    {isKanaOnly ? (
                      <span className="italic text-black/70">({reading})</span>
                    ) : (
                      <>
                        <span>{word}</span>
                        {reading && (
                          <span className="text-black/70 font-normal text-lg">( {reading} )</span>
                        )}
                      </>
                    )}
                    {/* Common Word badge */}
                    {common && (
                      <span className="ml-2 px-2 py-0.5 bg-black/10 rounded text-sm uppercase text-black/60 font-semibold">
                        Common
                      </span>
                    )}
                  </h2>

                  {/* Parts of Speech and Tags */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-black/70">
                    {partsOfSpeech.map((pos, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 border border-black/30 rounded select-none"
                        title="Part of Speech"
                      >
                        {pos}
                      </span>
                    ))}
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-black/10 rounded select-none"
                        title="Tag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* English Definitions */}
                  <ul className="list-disc pl-6 text-base text-black/85 space-y-2">
                    {definitions.length > 0 ? (
                      definitions.map((definition, i) => <li key={i}>{definition}</li>)
                    ) : (
                      <li>No definitions available</li>
                    )}
                  </ul>
                </li>
              )
            )}
          </ul>
        )}

        {!loading && results.length === 0 && pastSearches.length === 0 && !error && (
          <p className="text-center text-black/60 italic font-medium mt-8">No results found.</p>
        )}
      </main>
    </div>
  );
}
