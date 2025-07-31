const mongoose = require("mongoose");
const RoadmapSchema = new mongoose.Schema({
  level: String,
  title: String,
  description: String,
  steps: [String],
  enrolledUsers: [mongoose.Schema.Types.ObjectId],
});
module.exports = mongoose.model("Roadmap", RoadmapSchema);
