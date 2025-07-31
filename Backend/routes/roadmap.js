const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  listRoadmaps,
  enrollRoadmap,
} = require("../controllers/roadmapController");

router.get("/", auth, listRoadmaps);
router.post("/enroll/:id", auth, enrollRoadmap);

module.exports = router;
