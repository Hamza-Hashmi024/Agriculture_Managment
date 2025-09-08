const { getUserPermissions } = require("../Utility/permissions");

const requirePermission = (permissionName) => {
  return (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    getUserPermissions(userId, (err, permissions) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!permissions.includes(permissionName)) return res.status(403).json({ error: "Permission denied" });
      next();
    });
  };
};

module.exports = { requirePermission };
