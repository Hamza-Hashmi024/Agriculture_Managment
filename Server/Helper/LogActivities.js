const db = require("../config/db");

let ioInstance = null; // placeholder

// Setter for io
function setIO(io) {
  ioInstance = io;
}

async function logActivity(action, entity, entityId, details = {}) {
  try {
    if (!entityId) {
      console.warn(`⚠️ Skipped logging activity: ${action}, entityId missing`);
      return null;
    }

    console.log(`📝 Logging activity: action=${action}, entity=${entity}, entityId=${entityId}`);

    const sql = `INSERT INTO activities (action, entity, entity_id, details) VALUES (?, ?, ?, ?)`;
    const [result] = await db
      .promise()
      .query(sql, [action, entity, entityId, JSON.stringify(details)]);

    if (result.affectedRows > 0) {
      const activity = {
        id: result.insertId,
        action,
        entity,
        entityId,
        details,
        created_at: new Date(),
      };

      console.log(`✅ Activity saved in DB (id=${activity.id})`);

      if (ioInstance) {
        ioInstance.emit("newActivity", activity);
        console.log(`📡 Activity emitted via socket: ${JSON.stringify(activity)}`);
      } else {
        console.warn("⚠️ ioInstance not set, socket emit skipped");
      }

      return activity;
    } else {
      console.warn(`⚠️ Activity not inserted for: ${action} ${entity}`);
      return null;
    }
  } catch (err) {
    console.error("❌ Error logging activity:", err.message);
    return null;
  }
}

module.exports = { logActivity, setIO };