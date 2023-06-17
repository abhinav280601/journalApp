// authMiddleware.js
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  // const token = authHeader.split(" ")[1];
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token to the request object for further use
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticate;
