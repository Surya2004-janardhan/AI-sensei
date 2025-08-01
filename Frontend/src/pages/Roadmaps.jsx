import React, { useState, useEffect } from "react";

// JLPT N5 Roadmap nodes
const roadmapNodes = [
  {
    id: 1,
    icon: "📚",
    label: "Vocabulary & Kanji",
    desc: "800+ words,\n100+ kanji",
  },
  {
    id: 2,
    icon: "📝",
    label: "Grammar",
    desc: "Core grammar points",
  },
  {
    id: 3,
    icon: "🎧",
    label: "Listening",
    desc: "Audio & tests",
  },
  {
    id: 4,
    icon: "🔄",
    label: "Revision",
    desc: "Reviews & flashcards",
  },
  {
    id: 5,
    icon: "📝🕒",
    label: "Mock Exams",
    desc: "Timed practice sets",
  },
  {
    id: 6,
    icon: "📚📖",
    label: "Books & References",
    desc: "Top N5 materials",
  },
];

export default function Roadmaps() {
  const [loading, setLoading] = useState(false);
  const [error] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="min-h-screen bg-white px-6 py-6 font-sans text-black max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center tracking-tight font-serifJapanese">
        JLPT N5 Complete Roadmap & Resources
      </h1>

      {/* Node-style Horizontal Roadmap */}
      <div
        aria-label="JLPT N5 roadmap visual"
        className="mb-10 overflow-x-auto w-full roadmap-bar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex items-center space-x-0 min-w-max px-1 py-4">
          {roadmapNodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              {/* Node/step */}
              <div className="flex flex-col items-center w-40 mx-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold shadow-md border border-primary mb-2">
                  {node.icon}
                </div>
                <div className="text-base font-bold text-primary text-center">
                  {node.label}
                </div>
                <div className="text-xs text-black/60 text-center whitespace-pre-line mt-1">
                  {node.desc}
                </div>
              </div>
              {/* Connector line */}
              {idx !== roadmapNodes.length - 1 && (
                <div className="flex-grow h-1 w-12 bg-primary/40 mx-1 rounded-full" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-black/70 mb-6">Loading...</p>}
      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      {/* Vocabulary & Kanji */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b border-black/30 pb-2">
          📚 Vocabulary & Kanji
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>
            <button
              onClick={() =>
                openLink("https://jlptsensei.com/jlpt-n5-vocabulary-list/")
              }
              className="text-primary underline"
              aria-label="JLPT N5 Vocabulary List"
            >
              JLPT N5 Vocabulary List (JLPT Sensei)
            </button>
            {" — Full vocab list with kanji, kana, English, and audio."}
          </li>
          <li>
            <button
              onClick={() =>
                openLink("https://jlptsensei.com/jlpt-n5-kanji-list/")
              }
              className="text-primary underline"
              aria-label="JLPT N5 Kanji List"
            >
              JLPT N5 Kanji List (JLPT Sensei)
            </button>
            {" — N5 kanji with readings, stroke order, and drills."}
          </li>
          <li>
            <button
              onClick={() =>
                openLink(
                  "https://www.youtube.com/playlist?list=PLVK0LaL0vdqcELV_4lIwau0LOvP9r91si"
                )
              }
              className="text-primary underline"
              aria-label="NihonGoal JLPT N5 Vocabulary and Grammar"
            >
              NihonGoal Vocabulary & Grammar Playlist
            </button>
            {" — Stepwise N5 vocabulary/grammar breakdowns (YouTube)."}
          </li>
        </ul>
      </section>

      {/* Grammar */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b border-black/30 pb-2">
          📝 Grammar
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>
            <button
              onClick={() =>
                openLink("https://japanesetest4you.com/jlpt-n5-grammar-list/")
              }
              className="text-primary underline"
              aria-label="JLPT N5 Grammar List"
            >
              JLPT N5 Grammar List (JapaneseTest4You)
            </button>
            {" — Complete grammar points (with printables)."}
          </li>
          <li>
            <button
              onClick={() =>
                openLink(
                  "https://www.youtube.com/playlist?list=PLVK0LaL0vdqdTW8NgkopZTbsnbhKZX_hL"
                )
              }
              className="text-primary underline"
              aria-label="NihonGoal Grammar Playlist"
            >
              NihonGoal N5 Grammar Playlist
            </button>
            {" — Highly recommended video grammar series (YouTube)."}
          </li>
        </ul>
      </section>

      {/* Listening & Practice Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b border-black/30 pb-2">
          🎧 Listening & Practice Tests
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>
            <button
              onClick={() =>
                openLink(
                  "https://www.youtube.com/playlist?list=PL7JD705Ot0JFL2rKqLE7qokt8rqCg5hNz"
                )
              }
              className="text-primary underline"
              aria-label="TOMO Sensei JLPT N5 Practice Tests"
            >
              TOMO sensei JLPT N5 Practice Playlist
            </button>
            {" — Mock tests, listening, and kanji quizzes (YouTube)."}
          </li>
          <li>
            <button
              onClick={() => openLink("https://www.youtube.com/@TOMOsensei")}
              className="text-primary underline"
              aria-label="TOMO Sensei Channel"
            >
              Visit TOMO Sensei Channel
            </button>
            {" — All playlists (find N5 Kanji/Vocab/Listening drills)."}
          </li>
        </ul>
      </section>

      {/* Revision & Practice */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b border-black/30 pb-2">
          🔄 Revision & Practice
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>
            <button
              onClick={() =>
                openLink(
                  "https://jlptsensei.com/downloads/jlpt-n5-practice-test/"
                )
              }
              className="text-primary underline"
              aria-label="JLPT N5 Official Practice Test PDF"
            >
              JLPT N5 Official Practice Test (PDF)
            </button>
            {" — Downloadable practice test with answer keys."}
          </li>
        </ul>
      </section>

      {/* Recommended Books */}
      <section>
        <h2 className="text-2xl font-bold mb-4 border-b border-black/30 pb-2">
          📚 Recommended Books
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>
            <button
              onClick={() =>
                openLink("https://migii.net/en/blog/jlpt-n5-books")
              }
              className="text-primary underline"
              aria-label="JLPT N5 Books PDF"
            >
              Free JLPT N5 Books PDF
            </button>
            {" — Beginner textbooks for self-study."}
          </li>
          <li>
            <button
              onClick={() =>
                openLink(
                  "https://www.amazon.in/nihongo-so-matome-n5/dp/4789014406"
                )
              }
              className="text-primary underline"
              aria-label="Nihongo So-Matome N5"
            >
              Nihongo So-Matome N5 (Amazon)
            </button>
            {" — Popular concise all-in-one study book."}
          </li>
          <li>
            <button
              onClick={() =>
                openLink(
                  "https://www.amazon.in/goukaku-dekiru-jlpt-n5/dp/4872176752"
                )
              }
              className="text-primary underline"
              aria-label="Goukaku Dekiru JLPT N5"
            >
              Goukaku Dekiru JLPT N5 (Amazon)
            </button>
            {" — Extensive mock tests/book explanations."}
          </li>
        </ul>
      </section>

      {/* Roadmap bar custom scrollbar styling */}
      <style>{`
        .roadmap-bar::-webkit-scrollbar { height: 6px; background: transparent; }
        .roadmap-bar::-webkit-scrollbar-thumb { background: rgba(24,102,197,0.11); border-radius: 4px; }
        .roadmap-bar { scrollbar-width: thin; scrollbar-color: rgba(24,102,197,0.11) transparent; }
        .bg-primary\\/10 { background-color: #f5f5fd !important; }
        .text-primary      { color: #1866c5 !important; }
        .border-primary    { border-color: #1866c5 !important; }
      `}</style>
    </div>
  );
}
