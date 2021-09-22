const mongoose = require("mongoose");

const model = new mongoose.Schema(
  {
    ID: { type: String, required: true },
    TimeStamp: { type: String, required: true },
    Voted: { type: Boolean, required: true },
    RememberVote: { type: Boolean },
    Votes: { type: Number },
  },
  { collection: "Twitch" }
);

module.exports = mongoose.model("Twitch", model);
