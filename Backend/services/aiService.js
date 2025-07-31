const axios = require("axios");
exports.callAIGPT = async (input, role = "teacher") => {
  // Call OpenAI/other APIs. Example:
  const res = await axios.post("AI_ENDPOINT", {
    prompt: `[${role}] ${input}`,
    // ...other params
  });
  return res.data.choices[0].text;
};
