const mongoose = require("mongoose");

const model = new mongoose.Schema(
  {
    USERID: { type: String, required: true },
    CODE: { type: String, required: true },
    SERVERS: { type: String },
    USERS: { type: String },
  },
  { collection: "Codes" }
);

module.exports = mongoose.model("Codes", model);
