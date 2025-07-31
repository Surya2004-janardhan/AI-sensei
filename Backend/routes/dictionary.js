const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { searchWord } = require("../controllers/dictionaryController");

router.get("/search", auth, searchWord);
// ...rest unchanged
module.exports = router;
