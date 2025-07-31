const axios = require("axios");
const wanakana = require("wanakana");

exports.searchWord = async (req, res) => {
  console.log("here inside of searchword");
  const { q } = req.query;
  console.log(q);
  if (!q) return res.status(400).json({ message: "No query provided" });

  try {
    let searchQuery = q;
    if (wanakana.isRomaji(q)) {
      searchQuery = wanakana.toHiragana(q);
    }

    const response = await axios.get(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
        searchQuery
      )}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/115.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      }
    );

    console.log(response.data);
    // Optional: check API response meta status
    if (!response.data || response.data.meta.status !== 200) {
      return res.status(404).json({ message: "No results found" });
    }

    // Send only the 'data' array to match your tests' expectations
    res.json(response.data.data);
  } catch (error) {
    console.error("Dictionary search error:", error);
    res.status(500).json({
      message: "External dictionary lookup failed",
      error: error.message,
    });
  }
};
