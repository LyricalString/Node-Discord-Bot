const mongoose = require("mongoose");

const model = new mongoose.Schema(
  {
    guildId: { type: String, required: true },
    backups: { type: Array },
    lastBackup: {type: String },
    lastUsedBackup: { type: String }
  },
  { collection: "Backups" }
);

module.exports = mongoose.model("Backups", model);
