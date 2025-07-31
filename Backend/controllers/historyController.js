const Interaction = require("../models/Interaction");

exports.getHistory = async (req, res) => {
  const history = await Interaction.find({ user: req.user.id });
  res.json(history);
};
