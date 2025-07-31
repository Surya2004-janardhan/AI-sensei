const Roadmap = require("../models/Roadmap");

exports.listRoadmaps = async (req, res) => {
  const roadmaps = await Roadmap.find();
  res.json(roadmaps);
};

exports.enrollRoadmap = async (req, res) => {
  await Roadmap.findByIdAndUpdate(req.params.id, {
    $push: { enrolledUsers: req.user.id },
  });
  res.json({ success: true });
};
