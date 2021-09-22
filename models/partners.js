const mongoose = require("mongoose");

const model = new mongoose.Schema(
  {
    JOINED: { type: String },
    ICON: { type: String },
    OWNER_ID: { type: String },
    INVITE: { type: String },
    guildID: { type: String, required: true },
    PARTHNER: { type: Boolean },
  },
  { collection: "Partners" }
);

module.exports = mongoose.model("Partners", model);
