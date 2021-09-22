const mongoose = require("mongoose");

const Guilds = new mongoose.Schema(
  {
    ID: { type: String, required: true },
    MUTE_TIMESTAMP: { type: String },
    MUTE_TIME: { type: String },
    EXPIRED: { type: Boolean }
  },
  { collection: "Mutes" }
);

const model = new mongoose.Schema(
  {
    USERID: { type: String, required: true },
    GUILDS: [Guilds],
  },
  { collection: "Mutes" }
);

module.exports = mongoose.model("Mutes", model);
