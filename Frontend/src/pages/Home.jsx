import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import wordOfTheDayApi from "../api/wordOfTheDay"; // Adjust if needed

const IndiaMarker = () => (
  <div className="flex flex-col items-center space-y-1 select-none">
    <span className="text-4xl" aria-label="Namaskaram" role="img">
      🙏
    </span>
    <span className="text-xs font-semibold uppercase tracking-wide text-black/60">
      India
    </span>
  </div>
);

const JapanMarker = () => (
  <div className="flex flex-col items-center space-y-1 select-none">
    <span className="text-4xl" aria-label="Bowing man" role="img">
      🙇‍♂️
    </span>
    <span className="text-xs font-semibold uppercase tracking-wide text-black/60">
      Japan
    </span>
  </div>
);

export default function Home() {
  const [wordOfTheDay, setWordOfTheDay] = useState(null);
  const [sentenceOfTheDay, setSentenceOfTheDay] = useState(null);

  useEffect(() => {
    async function fetchWordOfTheDay() {
      try {
        const res = await wordOfTheDayApi.getWordOfTheDay();
        const data = res.data;
        setWordOfTheDay(data.wordOfTheDay);
        setSentenceOfTheDay(data.sentenceOfTheDay);
      } catch (error) {
        console.error("Failed to fetch word of the day:", error);
      }
    }
    fetchWordOfTheDay();
  }, []);

  return (
    <div className="h-screen overflow-hidden mt-6 md:mt-9  sm:p-8 sm:pt-9.5 p-2 flex flex-col bg-white font-sans text-black overflow-x-hidden relative">
      <main className="  m-0 flex-grow flex flex-col justify-start relative z-10 px-4 sm: md:px-0 bg-white min-h-[100dvh] ">
        {/* <h2 className="text-2xl border bg-amber-400 sm:bg-white ">
          tata testha dentho
        </h2> */}
        <div className=" flex mt-0 flex-col md:flex-row items-center md:items-start w-full justify-center mb-4 md:mb-8">
          <aside className="hidden md:flex w-full md:w-64 bg-white border border-black/20 rounded-lg shadow-md p-4 md:p-5 font-sans flex-col items-center self-start md:mr-12 mr-0">
            <h2 className="text-lg font-bold mb-3 border-b border-black/20 pb-1 w-full text-center">
              Word of the Day
            </h2>
            {wordOfTheDay ? (
              <>
                <p className="text-xl md:text-2xl font-bold mb-1 select-text">
                  {wordOfTheDay.word}
                </p>
                <p className="text-sm md:text-base text-black/80 text-center">
                  {wordOfTheDay.meaning}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </aside>

          <div className=" flex flex-col items-center md:mx-6 my-6 md:my-0 w-full md:w-auto">
            <div className=" flex justify-between items-center w-64 relative h-15">
              <IndiaMarker />
              <div className="relative flex-1 flex items-center justify-center h-full">
                <span
                  className="absolute left-0 top-6 animate-paperplane text-2xl z-10"
                  role="img"
                  aria-label="Paper Airplane"
                >
                  ✈️
                </span>
              </div>
              <JapanMarker />
            </div>
            <span className=" block mt-2 text-center text-xl md:text-2xl font-bold select-none opacity-50 tracking-wide">
              Connecting Cultures
            </span>
          </div>

          <aside className=" hidden md:flex w-full md:w-64 bg-white border border-black/20 rounded-lg shadow-md p-4 md:p-5 font-sans flex-col items-center self-start md:ml-12 ml-0">
            <h2 className="text-lg font-bold mb-3 border-b border-black/20 pb-1 w-full text-center">
              Sentence of the Day
            </h2>
            {sentenceOfTheDay ? (
              <>
                <p className="text-base md:text-lg font-bold mb-1 text-center select-text">
                  {sentenceOfTheDay.sentence}
                </p>
                <p className="text-sm md:text-base text-black/80 text-center">
                  {sentenceOfTheDay.meaning}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </aside>
        </div>
        <div className=" flex justify-center px-2 md:px-0 md:mt-6">
          <div className=" max-w-full md:max-w-3xl bg-white border border-black/20 rounded-lg shadow-lg p-6 md:p-8 text-center bg-opacity-90 z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight font-sans">
              Welcome to <span className="font-extrabold">AI Sensei</span>{" "}
              <span>-🌸-</span>
            </h1>
            <p className="hidden md:block text-base md:text-lg text-black/80 mb-8 leading-relaxed font-sans">
              Your personalized AI-powered Japanese language teacher.
              <br />
              Explore lessons, AI teacher, and real-time dictionary support to
              master Japanese levels and beyond.
            </p>

            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Link
                to="/ai-teacher"
                className="px-6 py-3 rounded-md bg-black text-white font-semibold shadow-md hover:bg-gray-900 transition-all duration-200 hover:scale-[1.05] font-sans"
              >
                Talk to AI Teacher
              </Link>
              <Link
                to="/roadmaps"
                className="px-6 py-3 rounded-md border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all duration-200 hover:scale-[1.05] font-sans"
              >
                Browse Roadmaps
              </Link>
            </div>
          </div>
        </div>
        <div className="  text-sm text-black/60 font-sans text-center py-6 select-none">
          🌸 頑張ってください! (Good luck with your studies!)
        </div>

        {/* <h3>placeholder for some random shit now </h3> */}
      </main>

      <footer className=" fixed bottom-0 left-0 right-0 bg-black text-white py-1.5 z-50 select-none w-full">
        <div className="  max-w-md mx-auto px-4 pb-1.5 text-center font-sans text-base sm:text-sm leading-snug">
          <span className="block mb-0.5 text-lg sm:text-base font-semibold">
            「千里の道も一歩から」
          </span>
          <span className="block text-sm sm:text-xs opacity-85">
            — A journey of a thousand miles begins with a single step.
          </span>
          <p className="mt-2 text-xs sm:text-[10px] font-sans">
            Made with <span className="text-pink-500">❤</span> |{" "}
            <a
              href="mailto:chintalajanardhan2004@gmail.com"
              className="underline hover:text-pink-500"
            >
              chintalajanardhan2004@gmail.com
            </a>
          </p>
        </div>
      </footer>

      <style>
        {`
          html, body, #root { overflow-x: hidden; }
          @media (min-width: 768px) {
            .aside-left { margin-right: 3rem; }
            .aside-right { margin-left: 3rem; }
          }
          @media (max-width: 767px) {
            .aside-left, .aside-right { margin: 0; width: 100%; }
          }
          @keyframes paperplane-fly {
            0% { left: -10px; top: 19px; transform: rotate(-14deg); }
            15% { left: 32px; top: 7px; transform: rotate(-9deg); }
            35% { left: 75px; top: 0px; transform: rotate(3deg); }
            55% { left: 120px; top: 9px; transform: rotate(16deg); }
            85% { left: 180px; top: 20px; transform: rotate(9deg); }
            100% { left: 190px; top: 6px; transform: rotate(3deg); }
            // 100% { left: 230px; top: 10px; transform: rotate(-1deg); }
          }
          .animate-paperplane {
            animation: paperplane-fly 7s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
