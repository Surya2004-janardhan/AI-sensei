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
import { ChatMessage } from "../models/Chat.js";
import fs from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";

// Load grammar database
function getVectorDB() {
  try {
    const grammarPath = path.join(
      process.cwd(),
      "controllers",
      "grammar_DB.json"
    );
    return JSON.parse(fs.readFileSync(grammarPath, "utf-8"));
  } catch (error) {
    console.error("Error loading grammar DB:", error);
    return [];
  }
}

// Load kanji data
function getKanjiData() {
  try {
    const kanjiPath = path.join(process.cwd(), "ragdata", "kanji_vectors.json");
    return JSON.parse(fs.readFileSync(kanjiPath, "utf-8"));
  } catch (error) {
    console.error("Error loading kanji data:", error);
    return [];
  }
}

async function getTopKRelevantChunks(query, topK = 5) {
  try {
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    const queryVector = Array.from(
      (await extractor(query, { pooling: "mean", normalize: true })).data
    );

    const kanjiData = getKanjiData();
    const scored = kanjiData.map((entry) => ({
      id: entry.id,
      kanji: entry.kanji,
      text: entry.text,
      score: cosineSimilarity(queryVector, entry.vector || entry.embedding),
    }));

    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  } catch (error) {
    console.error("Error in getTopKRelevantChunks:", error);
    return [];
  }
}
const groq = new Groq({
  apiKey: "",
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

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * (vecB[i] || 0), 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB + 1e-8);
}

// ---------------------- Embedding Function ----------------------
async function embedQuery(query) {
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  const vector = Array.from(
    (await extractor(query, { pooling: "mean", normalize: true })).data
  );
  return vector;
}

// export const aiTeacher = async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question || !question.trim()) {
//       return res.status(400).json({ error: "Question is required." });
//     }

//     const messages = [
//       {
//         role: "system",
//         content: SYSTEM_PROMPT,
//       },
//       {
//         role: "user",
//         content: question.trim(),
//       },
//     ];

//     const completion = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages,
//       // max_tokens: 512,
//       // temperature: 0.3,
//     });

//     const answer =
//       completion.choices?.[0]?.message?.content?.trim() ||
//       "Sorry, no answer was generated.";

//     res.json({ answer });
//   } catch (error) {
//     console.error("Error in aiTeacher:", error);
//     res.status(500).json({ error: "Failed to process AI answer." });
//   }
// };

export const aiTeacher = async (req, res) => {
  try {
    // console.log("inside of aiTeacher");
    const { question, userId } = req.body;
    if (!question?.trim() || !userId) {
      return res
        .status(400)
        .json({ error: "Question and userId are required." });
    }
    // console.log("check0");

    // 1️⃣ Compute embedding for current question
    const questionEmbedding = await embedQuery(question);
    // console.log("check1");

    // 2️⃣ Retrieve user's previous messages
    const allMessages = (await ChatMessage.find({ userId })) || [];
    const scored = allMessages.map((msg) => ({
      msg,
      score: cosineSimilarity(msg.embedding, questionEmbedding),
    }));
    const topRelevant = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // top 5 relevant
      .map((s) => s.msg);

    const contextText = topRelevant
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    // 3️⃣ Prepare messages for Groq
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Context:\n${contextText}\n\nQuestion:\n${question}`,
      },
    ];

    // 4️⃣ Call Groq LLM
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, no answer was generated.";

    // 5️⃣ Store question + answer in MongoDB
    await ChatMessage.create({
      userId,
      role: "user",
      content: question,
      embedding: questionEmbedding,
    });

    const answerEmbedding = await embedQuery(answer);
    await ChatMessage.create({
      userId,
      role: "assistant",
      content: answer,
      embedding: answerEmbedding,
    });
    // console.log("check2");
    res.json({ answer });
  } catch (error) {
    console.error("❌ Error in aiTeacher:", error);
    res.status(500).json({ error: "Failed to process AI answer." });
  }
};

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

const SYSTEM_PROMPT_KANJI = `
You are a bilingual Kanji tutor who helps learners understand any Kanji deeply using Japanese and English.

👩‍🏫 Your Job:
- Use the given Kanji entries and user query to explain and answer clearly.
- All Japanese must be in Hiragana and Katakana (use Kanji only when needed).
- Translate every Japanese sentence into English.
- Add emojis for key concepts (e.g. 🌸, 🔤, 📖).
- No romaji.

⛩️ Your responses must:
- Give short explanations if the question is basic (like "what does 暗 mean?").
- Be 200+ words for deeper queries (e.g. how 暗 differs from 闇).
- Pull meaning, readings, and context from the given Kanji chunks.
`;

export const kanjiTeacher = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    const topChunks = await getTopKRelevantChunks(question);
    const context = topChunks
      .map((chunk, i) => `#${i + 1}: ${chunk.text}`)
      .join("\n");

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT_KANJI,
      },
      {
        role: "user",
        content: `User Query: ${question}\n\nRelevant Kanji Info:\n${context}`,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, no answer was generated.";

    res.json({ answer });
  } catch (error) {
    console.error("Error in kanjiTeacher:", error);
    res.status(500).json({ error: "Failed to process Kanji teacher answer." });
  }
};
