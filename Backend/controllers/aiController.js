import Groq from "groq-sdk";
// import dotenv as ("dotenv")
// import dotenv from "dotenv";
// dotenv.config({ quiet: true });

// console.log(process.env.GROQ_API_KEY);
// const apiKey = process.env.GROQ_API_KEY?.replace(/(\r\n|\n|\r)/gm, "").trim();
// console.log('apiKey: ', apiKey);
// if (!process.env.GROQ_API_KEY) {
// console.error("❌ GROQ_API_KEY is undefined");
// }else{
//   console.log("key is there")
// }

const groq = new Groq({
  apiKey: "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",
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
