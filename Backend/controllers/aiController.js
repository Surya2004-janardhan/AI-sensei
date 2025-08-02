// const { callAIGPT } = require("../services/aiService");
import Groq from "groq-sdk";
// console.log(process.env.GROQ_API_KEY);
// const apiKey = process.env.GROQ_API_KEY?.replace(/(\r\n|\n|\r)/gm, "").trim();
// console.log('apiKey: ', apiKey);
// if (!process.env.GROQ_API_KEY) {
// console.error("❌ GROQ_API_KEY is undefined");
// }else{
//   console.log("key is there")
// }

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a bilingual AI teacher fluent in English and Japanese, designed to assist users with Japanese language-related questions (e.g., grammar, translation, vocabulary, pronunciation, cultural context) as well as general questions.

🔍 Behavior Guidelines:
- Use NLP to understand the intent of the user's question and respond accordingly.
- Adapt the length of your answer based on the complexity of the question. For short queries (like greetings), keep the response brief and relevant.

🌐 Language & Formatting:
- Japanese responses must use only hiragana and katakana. Use kanji only when absolutely necessary.
- Each Japanese sentence must be followed by its English translation on the next line.
- Japanese words should be separated by spaces to help learners.
- Include relevant emojis to enhance meaning for important words (e.g., 🌸 for flower, ✈️ for travel).
- Keep the tone friendly and easy to understand.

📝 Content Length:
- For simple questions (e.g., "How to say hello?"), give a short but clear bilingual answer.
- For complex or open-ended questions, give a more detailed response of 200+ words.

🚫 Restrictions:
- No romaji should be used anywhere.
- Do not include special characters except for meaningful emojis.
- Avoid excessive kanji; prefer hiragana and katakana.

Your goal is to provide clear, bilingual answers in a teaching-friendly format.
`;

export const aiTeacher = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: question.trim(),
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      // max_tokens: 512,
      // temperature: 0.3,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, no answer was generated.";

    res.json({ answer });
  } catch (error) {
    console.error("Error in aiTeacher:", error);
    res.status(500).json({ error: "Failed to process AI answer." });
  }
};

function cosineSimilarity(a, b) {
  const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dot / (magA * magB);
}

async function embedQuery(query) {
  const res = await fetch("https://api.groq.com/openai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer <keep api later>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nomic-embed-text-v1",
      input: query,
    }),
  });
  const json = await res.json();
  return json?.data?.[0]?.embedding;
}

function getVectorDB() {
  const dbPath = path.join(process.cwd(), "grammar_DB.json");
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

export const grammarTeacher = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    const userQuery = question.trim();
    const userEmbedding = await embedQuery(userQuery);
    if (!userEmbedding) {
      return res.status(500).json({ error: "Embedding generation failed." });
    }

    const db = getVectorDB();
    const results = db
      .map((entry) => ({
        text: entry.text,
        score: cosineSimilarity(userEmbedding, entry.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const context = results
      .map((r, i) => `#${i + 1}:\n${r.text}`)
      .join("\n---\n");

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Use the following context to answer the question.\n\nContext:\n${context}\n\nQuestion: ${userQuery}`,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, no answer was generated.";

    res.json({
      answer,
      contextUsed: context,
    });
  } catch (error) {
    console.error("❌ Error in grammarTeacher:", error);
    res.status(500).json({ error: "Failed to process the question." });
  }
};
