const mongoose = require("mongoose");

const Guilds = new mongoose.Schema(
  {
    ID: { type: String, required: true },
    BAM_TIMESTAMP: { type: String },
    ENABLED: { type: Boolean },
  },
  { collection: "Kick" }
);

const model = new mongoose.Schema(
  {
    USERID: { type: String, required: true },
    GUILDS: [Guilds],
  },
  { collection: "Kick" }
);

module.exports = mongoose.model("Kick", model);
