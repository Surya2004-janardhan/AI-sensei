const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  aiTeacher,
  grammarTeacher,
  kanjiTeacher,
} = require("../controllers/aiController");

router.post("/teacher", auth, aiTeacher);
// router.post("/doubt-solver", auth, aiDoubtSolver);
router.post("/grammar", auth, grammarTeacher);

router.post("/kanjiTeacher", auth, kanjiTeacher);
module.exports = router;
