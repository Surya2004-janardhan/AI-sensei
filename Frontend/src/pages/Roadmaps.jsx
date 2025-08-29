import React, { useState, useEffect } from "react";

const roadmapNodes = [
  // N5
  {
    id: "n5-1",
    level: "N5",
    icon: "📚",
    label: "Vocabulary & Kanji",
    desc: "800+ words,\n100+ kanji",
  },
  {
    id: "n5-2",
    level: "N5",
    icon: "📝",
    label: "Grammar",
    desc: "Core grammar points",
  },
  {
    id: "n5-3",
    level: "N5",
    icon: "🎧",
    label: "Listening",
    desc: "Audio & tests",
  },
  {
    id: "n5-4",
    level: "N5",
    icon: "🔄",
    label: "Revision",
    desc: "Reviews & flashcards",
  },
  {
    id: "n5-5",
    level: "N5",
    icon: "📝🕒",
    label: "Mock Exams",
    desc: "Timed practice sets",
  },
  {
    id: "n5-6",
    level: "N5",
    icon: "📚📖",
    label: "Books & References",
    desc: "Top N5 materials",
  },

  // N4 (unchanged)
  {
    id: "n4-1",
    level: "N4",
    icon: "📚",
    label: "Vocabulary & Kanji",
    desc: "1500+ words,\n300+ kanji",
  },
  {
    id: "n4-2",
    level: "N4",
    icon: "📝",
    label: "Grammar",
    desc: "Expanded grammar list",
  },
  {
    id: "n4-3",
    level: "N4",
    icon: "🎧",
    label: "Listening",
    desc: "Longer dialogues & tests",
  },
  {
    id: "n4-4",
    level: "N4",
    icon: "🔄",
    label: "Revision",
    desc: "Practice & flashcards",
  },
  {
    id: "n4-5",
    level: "N4",
    icon: "📝🕒",
    label: "Mock Exams",
    desc: "Practice sets & past papers",
  },
  {
    id: "n4-6",
    level: "N4",
    icon: "📚📖",
    label: "Books & References",
    desc: "Best N4 textbooks",
  },
];

export default function Roadmaps() {
  const [loading] = useState(false);
  const [error] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-6 font-sans text-black max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight font-serifJapanese">
        JLPT N5 & N4 Roadmaps & Resources
      </h1>

      {loading && <p className="text-center text-black/70 mb-6">Loading...</p>}
      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      <nav
        aria-label="JLPT N5 and N4 roadmap summary"
        className="mb-12 overflow-x-auto w-full no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <ul className="flex space-x-6 min-w-max px-2">
          {roadmapNodes.map(({ id, icon, label, desc, level }) => (
            <li
              key={id}
              className="flex-shrink-0 rounded-lg px-6 py-4 shadow-md border border-black cursor-default select-none max-w-xs hover:shadow-lg hover:bg-black  hover:text-white transition-all duration-300"
              title={`${level} - ${label}`}
            >
              <div className="text-4xl mb-2">{icon}</div>
              <h3 className="font-semibold text-lg mb-1">
                {label} ({level})
              </h3>
              <p className="text-sm text-black/70 whitespace-pre-line">
                {desc}
              </p>
            </li>
          ))}
        </ul>
      </nav>

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
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x9db_nVXejJlB5i-M2XwvG-",
                label: "N5 Vocabulary & Sentence (TOMO sensei)",
                desc: "JLPT N5 vocab with sample sentences.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLag_mhJfCJ-1-EZcPapMFPTlzVzwjz33M",
                label: "Minna No Nihongo Lessons (NihonGoal)",
                desc: "Structured lessons covering vocab & grammar.",
              },
            ]}
          />

          <ResourceCard
            title="Grammar"
            links={[
              {
                href: "https://japanesetest4you.com/jlpt-n5-grammar-list/",
                label: "JLPT N5 Grammar List (JapaneseTest4You)",
                desc: "Complete grammar points with examples.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLVK0LaL0vdqdTW8NgkopZTbsnbhKZX_hL",
                label: "NihonGoal N5 Grammar Playlist",
                desc: "Structured grammar lessons on YouTube.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x90jB7kB_hq_Z_cbjgZoSuV",
                label: "N5 Vocabulary – Read in 3 seconds (TOMO sensei)",
                desc: "Quick-fire grammar/vocab drills.",
              },
            ]}
          />

          <ResourceCard
            title="Listening & Practice Tests"
            links={[
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x-HxRw6efxBr1wNCuH8y2ZJ",
                label: "N5 Listening Sample Test (TOMO sensei)",
                desc: "JLPT N5 listening test practice.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x9db_nVXejJlB5i-M2XwvG-",
                label: "Again: N5 Vocabulary & Sentence (TOMO sensei)",
                desc: "Alternative listening-based practice.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLag_mhJfCJ-18WyYoklCPxIpYbeRgmWLJ",
                label: "NihonGoal Grammar Lessons (N5/N4)",
                desc: "Mixed grammar/listening structured lessons.",
              },
            ]}
          />

          <ResourceCard
            title="Revision & Mock Exams"
            links={[
              {
                href: "https://www.jlpt.jp/e/samples/sampleindex.html",
                label: "JLPT Official Practice Workbook N5",
                desc: "Official workbook with listening audio & answer sheets.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x-HxRw6efxBr1wNCuH8y2ZJ",
                label: "Repeat: N5 Listening Sample Test (TOMO sensei)",
                desc: "Extra listening mock tests.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLag_mhJfCJ-1-EZcPapMFPTlzVzwjz33M",
                label: "Minna No Nihongo Lessons (NihonGoal)",
                desc: "For reinforced revision.",
              },
            ]}
          />

          <ResourceCard
            title="Recommended Books"
            links={[
              {
                href: "https://migii.net/en/blog/jlpt-n5-books",
                label: "Free JLPT N5 Books PDF",
                desc: "Beginner textbooks and guides.",
              },
              {
                href: "https://www.amazon.in/nihongo-so-matome-n5/dp/4789014406",
                label: "Nihongo So-Matome N5 (Amazon)",
                desc: "Popular concise all-in-one study book.",
              },
              {
                href: "https://www.amazon.in/goukaku-dekiru-jlpt-n5/dp/4872176752",
                label: "Goukaku Dekiru JLPT N5 (Amazon)",
                desc: "Extensive mock tests with explanations.",
              },
            ]}
          />
        </div>

        {/* N4 Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-6 border-b border-black/30 pb-3 font-serifJapanese">
            JLPT N4 Study Resources
          </h2>

          {/* N4 cards remain as before */}
          <ResourceCard
            title="Vocabulary & Kanji"
            links={[
              {
                href: "https://jlptsensei.com/jlpt-n4-vocabulary-list/",
                label: "JLPT N4 Vocabulary List (JLPT Sensei)",
                desc: "Extensive vocabulary with example sentences.",
              },
              {
                href: "https://jlptsensei.com/jlpt-n4-kanji-list/",
                label: "JLPT N4 Kanji List (JLPT Sensei)",
                desc: "N4 kanji with readings, stroke order, and practice.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLag_mhJfCJ-2sBVFtpD-tI79jmR4G02lN",
                label: "NihonGoal N4 Minna no Nihongo Lessons",
                desc: "Structured vocabulary & grammar lessons (N4).",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x8y-nJ8Tr2E1ERRYxhhC0Al",
                label: "TOMO sensei All JLPT N4 Vocabulary",
                desc: "Vocab read 3× (slow → native speed) for shadowing.",
              },
            ]}
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
                href: "https://www.youtube.com/playlist?list=PLag_mhJfCJ-18WyYoklCPxIpYbeRgmWLJ",
                label: "NihonGoal N5/N4 Grammar Lessons",
                desc: "Grammar instruction covering both N5 and N4.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x8y-nJ8Tr2E1ERRYxhhC0Al", // reuse vocab playlist if grammar mixed
                label: "TOMO sensei Vocabulary/Grammar Mix",
                desc: "Mixed grammar/vocab exposure for N4.",
              },
            ]}
          />

          <ResourceCard
            title="Listening & Practice Tests"
            links={[
              {
                href: "https://www.youtube.com/playlist?list=PLb2UCnI22u9mCw8I-zADae6GH0ieRrkHq",
                label: "NihonGoal N4 Listening Training",
                desc: "Day-by-day listening practice for N4.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x8y-nJ8Tr2E1ERRYxhhC0Al", // fallback vocabulary playlist
                label:
                  "TOMO sensei All JLPT N4 Vocabulary (listening-friendly)",
                desc: "Vocab read aloud—good listening/shadowing practice.",
              },
            ]}
          />

          <ResourceCard
            title="Revision & Mock Exams"
            links={[
              {
                href: "https://www.youtube.com/playlist?list=PLag_mhJfCJ-2sBVFtpD-tI79jmR4G02lN",
                label: "NihonGoal Minna no Nihongo N4",
                desc: "For structured revision.",
              },
              {
                href: "https://www.youtube.com/playlist?list=PLwLWi85AM8x8y-nJ8Tr2E1ERRYxhhC0Al",
                label: "TOMO sensei All JLPT N4 Vocabulary (extra review)",
                desc: "Reinforce via repeated exposure.",
              },
            ]}
          />

          <ResourceCard
            title="Recommended Books"
            links={[
              {
                href: "https://migii.net/en/blog/jlpt-n4-books",
                label: "Free JLPT N4 Books PDF",
                desc: "Self-study textbooks and guides.",
              },
              {
                href: "https://www.amazon.in/dp/4789014414",
                label: "Nihongo So-Matome N4 (Amazon)",
                desc: "Trusted N4 study series.",
              },
              {
                href: "https://www.amazon.in/dp/4838802909",
                label: "Try! JLPT N4 Grammar (Amazon)",
                desc: "Great grammar workbook for N4.",
              },
            ]}
          />
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function ResourceCard({ title, links }) {
  return (
    <div
      className="border border-black rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-default select-none bg-white hover:bg-black hover:text-white"
      tabIndex={0}
      aria-label={title}
    >
      <h3 className="text-xl font-semibold mb-4 font-serifJapanese">{title}</h3>
      <ul className="space-y-4">
        {links.map(({ href, label, desc }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:no-underline"
            >
              {label}
            </a>
            <p className="text-sm opacity-80 whitespace-pre-wrap leading-snug">
              {desc}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
