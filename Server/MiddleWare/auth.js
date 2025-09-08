const jwt = require("jsonwebtoken");

//  Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = decoded; // { id, role }
    next();
  });
};

//  Check Admin Role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};


const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};


module.exports = { verifyToken, requireAdmin , requireRole};