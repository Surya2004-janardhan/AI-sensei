const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { aiTeacher, aiDoubtSolver } = require("../controllers/aiController");

router.post("/teacher", auth, aiTeacher);
router.post("/doubt-solver", auth, aiDoubtSolver);

module.exports = router;
