const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { aiTeacher, grammarTeacher } = require("../controllers/aiController");

router.post("/teacher", auth, aiTeacher);
// router.post("/doubt-solver", auth, aiDoubtSolver);
router.post('/grammar' ,auth , grammarTeacher )
module.exports = router;
