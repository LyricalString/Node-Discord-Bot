const mongoose = require("mongoose");

const model = new mongoose.Schema(
  {
    USER_ID: { type: String, required: true, unique: true },
    NAME: { type: String },
    SONGS: { type: Array },
    CREATED: { type: Number },
    THUMBNAIL: { type: String },
  },
  { collection: "Playlists" }
);

module.exports = mongoose.model("Playlists", model);
