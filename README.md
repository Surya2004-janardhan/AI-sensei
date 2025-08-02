
# AI Sensei – MERN AI-Powered Japanese Tutor

Welcome to **AI Sensei** – an all-in-one, AI-powered Japanese language platform. AI Sensei is built using the MERN stack (MongoDB, Express.js, React, Node.js), features robust user authentication, persistent storage, real-time features, and clean, fully responsive UI/UX.

## 🚀 Features

- **Authentication \& Secure Database**
Seamless login, registration, logout, and route protection with JWT and hashed credentials using MongoDB.
- **Word of the Day \& Sentence of the Day**
Daily Japanese word and sentence, each with native script and English meaning, pulled from a curated database and featured prominently on the homepage.
- **AI Teacher**
Ask any Japanese language question (grammar, vocab, usage, etc.) and get real answers in real time from an LLM-powered AI Teacher. (N5/N4/N3... custom agents coming soon!)
- **Roadmaps**
Visual, structured roadmaps to guide users step-by-step through JLPT N5 and N4 (and higher level soon!) preparation, suggesting resources, topics, and study order.
- **JLPT N5 \& N4 Resources**
One-click access to grammar lists, vocabulary decks, downloadable N5/N4 Minna no Nihongo resources, exam guides, and more.
- **Live Chat**
Real-time messaging between users with Socket.IO—perfect for language exchange or peer study support.
- **Cool, Responsive UI**
Modern design with animated components, accessible layouts, and great mobile/desktop experiences.
- **Agents (Coming Soon)**
Next-gen AI assistants for grammar, kanji, and vocabulary, plus roadmap/grammar coach bots and more.


## 🤖 Tech Stack

- **Frontend:** React + TailwindCSS + Vite, fully responsive to all screen sizes
- **Backend:** Node.js (Express), REST API + Socket.IO for real-time chat and future agent messages
- **Database:** MongoDB (Atlas, with flexible schemas for user, word/sentence of the day, chat, progress, etc.)
- **Auth:** JWT-based, secure password hashing, persistent sessions
- **AI:** OpenAI/GPT (or compatible LLM) backend for AI teacher/responses
- **Resources:** Server-side logic and frontend UI for roadmaps, downloadable resources, and learning tools
- **Deployment:**
    - Frontend: Vercel
    - Backend: Render/other Node-friendly host
    - Database: MongoDB Atlas


## 💡 Highlights

- **Lightning-fast onboarding:** Register with email, start learning or chatting instantly.
- **Daily motivators:** See fresh Japanese content (word/sentence) every day when you log in.
- **Intelligent Q\&A:** Built-in context-aware AI sensei—practice Japanese, clarify grammar, debug sentences!
- **Study journeys:** Roadmaps reduce overwhelm—track your JLPT studies visually.
- **Expanding library:** Immediate access to curated N5/N4 digital resources.
- **Real-time engagement:** Live chat fosters a sense of vibrant learner community.
- **Polished look:** Minimalist, Japanese-inspired design—clean, animated, intuitive on all screen sizes.
- **Ready for scale:** Modular code, environment config, Dockerizable and CI/CD-ready.
- **Future-proof:** Agents for custom study, kanji, and advanced JLPT levels rolling out soon.


## 🏁 Starting Locally

1. **Clone this repo:**
`git clone https://github.com/yourusername/ai-sensei.git && cd ai-sensei`
2. **Backend:**

```
cd Backend
npm install
npm start
```

    - Set environment variables for MongoDB URI, JWT secret, and OpenAI/LLM API key in `.env`.
3. **Frontend:**

```
cd ../Frontend
npm install
npm run dev
```

    - The frontend will connect to backend API (set your proxy or baseURL as needed).
4. **Deploy:**
    - Deploy frontend (Vercel) and backend (Render or other Node hosting) as per your configuration.

## 🚦 Try These Out

- **Login/Register** (“/login”, “/register”)
- **Check the homepage** for today’s word and sentence.
- **Ask the AI Teacher**—from cultural notes to kanji, get instant help (“/ai-teacher”)
- **Explore the roadmaps**—tailored JLPT preparation
- **Live chat** with language learners world-wide


## 🛠️ Roadmap / Coming soon

- GrammarAI, KanjiAI, VocabularyAI: Dedicated agents for focused deep-dives
- Advanced JLPT and conversation partner bots
- Personal study analytics and recommendations
- More languages and community features


## ✨ Community \& Licensing

AI Sensei is a learning tool for educational purposes.
Feedback, feature requests, and contributors are always welcome!
Email: chintalajanardhan2004@gmail.com

> “千里の道も一歩から”
> A journey of a thousand miles begins with a single step.

**Start your Japanese mastery now, with AI Sensei!**

