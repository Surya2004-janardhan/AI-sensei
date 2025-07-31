const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  console.log("here in the auth service ")
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};
