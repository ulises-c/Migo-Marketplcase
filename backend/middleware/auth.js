const admin = require("firebase-admin");
const logger = require("../config/logger"); // Import Winston logger

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      logger.info(`Token verified for user: ${decodedToken.uid}`); // Log successful token verification
      next();
    } catch (error) {
      logger.error("Error verifying token:", error); // Log token verification errors
      return res.status(403).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { verifyToken };
