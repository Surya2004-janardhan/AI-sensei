import React, { useState, useEffect } from "react";

// Roadmap nodes for N5 and N4 levels (can scroll horizontally)
const roadmapNodes = [
  // N5
  {
    id: "n5-1",
    level: "N5",
    icon: "📚",
    label: "Vocabulary & Kanji",
    desc: "800+ words,\n100+ kanji",
    colorClass: "border-primary text-primary",
  },
  {
    id: "n5-2",
    level: "N5",
    icon: "📝",
    label: "Grammar",
    desc: "Core grammar points",
    colorClass: "border-primary text-primary",
  },
  {
    id: "n5-3",
    level: "N5",
    icon: "🎧",
    label: "Listening",
    desc: "Audio & tests",
    colorClass: "border-primary text-primary",
  },
  {
    id: "n5-4",
    level: "N5",
    icon: "🔄",
    label: "Revision",
    desc: "Reviews & flashcards",
    colorClass: "border-primary text-primary",
  },
  {
    id: "n5-5",
    level: "N5",
    icon: "📝🕒",
    label: "Mock Exams",
    desc: "Timed practice sets",
    colorClass: "border-primary text-primary",
  },
  {
    id: "n5-6",
    level: "N5",
    icon: "📚📖",
    label: "Books & References",
    desc: "Top N5 materials",
    colorClass: "border-primary text-primary",
  },

  // N4
  {
    id: "n4-1",
    level: "N4",
    icon: "📚",
    label: "Vocabulary & Kanji",
    desc: "1500+ words,\n300+ kanji",
    colorClass: "border-secondary text-secondary",
  },
  {
    id: "n4-2",
    level: "N4",
    icon: "📝",
    label: "Grammar",
    desc: "Expanded grammar list",
    colorClass: "border-secondary text-secondary",
  },
  {
    id: "n4-3",
    level: "N4",
    icon: "🎧",
    label: "Listening",
    desc: "Longer dialogues & tests",
    colorClass: "border-secondary text-secondary",
  },
  {
    id: "n4-4",
    level: "N4",
    icon: "🔄",
    label: "Revision",
    desc: "Practice & flashcards",
    colorClass: "border-secondary text-secondary",
  },
  {
    id: "n4-5",
    level: "N4",
    icon: "📝🕒",
    label: "Mock Exams",
    desc: "Practice sets & past papers",
    colorClass: "border-secondary text-secondary",
  },
  {
    id: "n4-6",
    level: "N4",
    icon: "📚📖",
    label: "Books & References",
    desc: "Best N4 textbooks",
    colorClass: "border-secondary text-secondary",
  },
];

export default function Roadmaps() {
  const [loading, setLoading] = useState(false);
  const [error] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Open external link safely in new tab
  const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="min-h-screen bg-white px-6 py-6 font-sans text-black max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight font-serifJapanese">
        JLPT N5 & N4 Roadmaps & Resources
      </h1>

      {loading && <p className="text-center text-black/70 mb-6">Loading...</p>}
      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      {/* Horizontally scrollable roadmap summary bar */}
      <nav
        aria-label="JLPT N5 and N4 roadmap summary"
        className="mb-12 overflow-x-auto w-full no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <ul className="flex space-x-6 min-w-max px-2">
          {roadmapNodes.map(({ id, icon, label, desc, colorClass, level }) => (
            <li
              key={id}
              className={`flex-shrink-0 rounded-lg px-6 py-4 shadow-md border ${colorClass} cursor-default select-none max-w-xs hover:shadow-lg transition`}
              title={`${level} - ${label}`}
            >
              <div
                className={`text-4xl mb-2 ${colorClass.replace(
                  "border-",
                  "text-"
                )}`}
              >
                {icon}
              </div>
              <h3
                className={`font-semibold text-lg mb-1 ${colorClass.replace(
                  "border-",
                  "text-"
                )}`}
              >
                {label} ({level})
              </h3>
              <p className="text-sm text-black/70 whitespace-pre-line">
                {desc}
              </p>
            </li>
          ))}
        </ul>
      </nav>

      {/* Detailed Section Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* N5 Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-6 border-b border-black/30 pb-3 font-serifJapanese">
            JLPT N5 Study Resources
          </h2>

          <ResourceCard
            title="Vocabulary & Kanji"
            links={[
              {
                href: "https://jlptsensei.com/jlpt-n5-vocabulary-list/",
                label: "JLPT N5 Vocabulary List (JLPT Sensei)",
                desc: "Full vocab list with kanji, kana, English, and audio.",
              },
              {
                href: "https://jlptsensei.com/jlpt-n5-kanji-list/",
                label: "JLPT N5 Kanji List (JLPT Sensei)",
                desc: "N5 kanji with readings, stroke order, and drills.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLVK0LaL0vdqcELV_4lIwau0LOvP9r91si",
                label: "NihonGoal Vocabulary & Grammar Playlist",
                desc: "Stepwise N5 vocabulary/grammar breakdowns (YouTube).",
              },
            ]}
            colorClass="border-primary text-primary"
          />

          <ResourceCard
            title="Grammar"
            links={[
              {
                href: "https://japanesetest4you.com/jlpt-n5-grammar-list/",
                label: "JLPT N5 Grammar List (JapaneseTest4You)",
                desc: "Complete grammar points (with printables).",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLVK0LaL0vdqdTW8NgkopZTbsnbhKZX_hL",
                label: "NihonGoal N5 Grammar Playlist",
                desc: "Highly recommended video grammar series (YouTube).",
              },
            ]}
            colorClass="border-primary text-primary"
          />

          <ResourceCard
            title="Listening & Practice Tests"
            links={[
              {
                href: "https://www.youtube.com/playlist?list=PL7JD705Ot0JFL2rKqLE7qokt8rqCg5hNz",
                label: "TOMO sensei JLPT N5 Practice Playlist",
                desc: "Mock tests, listening, and kanji quizzes (YouTube).",
              },
              {
                href: "https://www.youtube.com/@TOMOsensei",
                label: "Visit TOMO Sensei Channel",
                desc: "All playlists (find N5 Kanji/Vocab/Listening drills).",
              },
            ]}
            colorClass="border-primary text-primary"
          />

          <ResourceCard
            title="Revision & Practice"
            links={[
              {
                href: "https://jlptsensei.com/downloads/jlpt-n5-practice-test/",
                label: "JLPT N5 Official Practice Test (PDF)",
                desc: "Downloadable practice test with answer keys.",
              },
            ]}
            colorClass="border-primary text-primary"
          />

          <ResourceCard
            title="Recommended Books"
            links={[
              {
                href: "https://migii.net/en/blog/jlpt-n5-books",
                label: "Free JLPT N5 Books PDF",
                desc: "Beginner textbooks for self-study.",
              },
              {
                href: "https://www.amazon.in/nihongo-so-matome-n5/dp/4789014406",
                label: "Nihongo So-Matome N5 (Amazon)",
                desc: "Popular concise all-in-one study book.",
              },
              {
                href: "https://www.amazon.in/goukaku-dekiru-jlpt-n5/dp/4872176752",
                label: "Goukaku Dekiru JLPT N5 (Amazon)",
                desc: "Extensive mock tests/book explanations.",
              },
            ]}
            colorClass="border-primary text-primary"
          />
        </div>

        {/* N4 Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-6 border-b border-black/30 pb-3 font-serifJapanese">
            JLPT N4 Study Resources
          </h2>

          <ResourceCard
            title="Vocabulary & Kanji"
            links={[
              {
                href: "https://jlptsensei.com/jlpt-n4-vocabulary-list/",
                label: "JLPT N4 Vocabulary List (JLPT Sensei)",
                desc: "Extensive vocabulary with kanji and example sentences.",
              },
              {
                href: "https://jlptsensei.com/jlpt-n4-kanji-list/",
                label: "JLPT N4 Kanji List (JLPT Sensei)",
                desc: "N4 kanji with readings, stroke order, and practice.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLVK0LaL0vdqd8nVjSMDhPBW25nx7Ea5wV",
                label: "NihonGoal Vocabulary & Grammar Playlist N4",
                desc: "Stepwise N4 vocabulary and grammar tutorials (YouTube).",
              },
            ]}
            colorClass="border-secondary text-secondary"
          />

          <ResourceCard
            title="Grammar"
            links={[
              {
                href: "https://japanesetest4you.com/jlpt-n4-grammar-list/",
                label: "JLPT N4 Grammar List (JapaneseTest4You)",
                desc: "Comprehensive grammar points for N4.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLVK0LaL0vdqeunI8B1UR0nDXu9a69imid",
                label: "NihonGoal N4 Grammar Playlist",
                desc: "Detailed video grammar lessons (YouTube).",
              },
            ]}
            colorClass="border-secondary text-secondary"
          />

          <ResourceCard
            title="Listening & Practice Tests"
            links={[
              {
                href: "https://www.youtube.com/playlist?list=PLB5C2rg0LmeQMtk9nbylpb3COkuyBTJQQ",
                label: "TOMO sensei JLPT N4 Practice Playlist",
                desc: "Listening practice and mock tests (YouTube).",
              },
              {
                href: "https://www.youtube.com/@TOMOsensei",
                label: "Visit TOMO Sensei Channel",
                desc: "All relevant playlists for Kanji, Vocab, Listening drills.",
              },
            ]}
            colorClass="border-secondary text-secondary"
          />

          <ResourceCard
            title="Revision & Practice"
            links={[
              {
                href: "https://jlptsensei.com/downloads/jlpt-n4-practice-test/",
                label: "JLPT N4 Official Practice Test (PDF)",
                desc: "View or download official practice material.",
              },
            ]}
            colorClass="border-secondary text-secondary"
          />

          <ResourceCard
            title="Recommended Books"
            links={[
              {
                href: "https://migii.net/en/blog/jlpt-n4-books",
                label: "Free JLPT N4 Books PDF",
                desc: "Great self-study beginner to intermediate books.",
              },
              {
                href: "https://www.amazon.in/dp/4789014414",
                label: "Nihongo So-Matome N4 (Amazon)",
                desc: "Trusted study series for N4 learners.",
              },
              {
                href: "https://www.amazon.in/dp/4838802909",
                label: "Try! JLPT N4 Grammar (Amazon)",
                desc: "Excellent grammar workbook for N4.",
              },
            ]}
            colorClass="border-secondary text-secondary"
          />
        </div>
      </div>

      {/* Scrollbar hide */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Custom colors (adjust these to fit your color palette) */
        .border-primary { border-color: #1866c5; }
        .text-primary { color: #1866c5; }
        .border-secondary { border-color: #d9534f; }
        .text-secondary { color: #d9534f; }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

/**
 * ResourceCard component: Displays a card with a title and a list of resource links.
 * Props:
 *  - title: string (section name)
 *  - links: array of objects { href, label, desc }
 *  - colorClass: string (tailwind classes for border & text colors)
 */
function ResourceCard({ title, links, colorClass }) {
  return (
    <div
      className={`border ${colorClass} rounded-lg p-6 shadow-md hover:shadow-xl transition cursor-default select-none`}
      tabIndex={0}
      aria-label={title}
    >
      <h3 className={`text-xl font-semibold mb-4 font-serifJapanese`}>
        {title}
      </h3>
      <ul className="space-y-4 text-black/90">
        {links.map(({ href, label, desc }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium text-${
                colorClass.includes("primary") ? "primary" : "secondary"
              } underline hover:no-underline`}
              title={label}
            >
              {label}
            </a>
            <p className="text-sm text-black/70 whitespace-pre-wrap leading-snug">
              {desc}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
