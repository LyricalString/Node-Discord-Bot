const mongoose = require("mongoose");

const Guilds = new mongoose.Schema(
  {
    ID: { type: String, required: true },
    BAN_TIMESTAMP: { type: String },
    BAN_TIME: { type: String },
    EXPIRED: { type: Boolean }
  },
  { collection: "Bans" }
);

const model = new mongoose.Schema(
  {
    USERID: { type: String, required: true },
    GUILDS: [Guilds],
  },
  { collection: "Bans" }
);

module.exports = mongoose.model("Bans", model);
