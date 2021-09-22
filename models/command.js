const mongoose = require("mongoose");

const model = new mongoose.Schema(
  {
    name: { type: String, required: true },
    aliases: { type: Array, required: false },
    description: { type: Array, required: false },
    uses: { type: Number, required: true },
  },
  { collection: "Commands" }
);

module.exports = mongoose.model("Commands", model);
