const mongoose = require("mongoose");

const Mute = new mongoose.Schema({
  Time: { type: Number },
  Infinite: { type: Boolean },
  Reason: { type: String }
});

const Ban = new mongoose.Schema({
  Time: { type: Number },
  Infinite: { type: Boolean },
  Reason: { type: String }
});
const Kick = new mongoose.Schema({
  Reason: { type: String }
});

const Actions = new mongoose.Schema({
  Mute: Mute,
  Ban: Ban,
  Kick: Kick,
  Todo: { type: String },
  NotifyOnChat: { type: Boolean }
});

const Filter = new mongoose.Schema({
  Messages: {type: String},
  Seconds: {type: String}
})

const FloodDetection = new mongoose.Schema({
  Action: Actions,
  AdminBypass: { type: Boolean },
  Bots: { type: Boolean },
  Logs: { type: Boolean },
  Enabled: { type: Boolean },
  Filter: Filter
});

const PhishingDetection = new mongoose.Schema({
  Action: Actions,
  AdminBypass: { type: Boolean },
  Bots: { type: Boolean },
  BannedWords: { type: Array },
  Logs: { type: Boolean },
  Enabled: { type: Boolean },
});

const Twitch = new mongoose.Schema({
  Users: { type: Array },
  Enabled: { type: Boolean }
});

const Pvc = new mongoose.Schema({
  Enabled: { type: Boolean },
  Category: { type: String },
  StartingChannel: { type: String },
  TemporaryChannels: { type: Array }
});

const config = new mongoose.Schema({
  FloodDetection: FloodDetection,
  PhishingDetection: PhishingDetection,
  tos: { type: Boolean },
  spam: { type: Boolean },
  CHANNELID: { type: Array },
  DISABLED_COMMANDS: { type: Array },
  DISABLED_CATEGORIES: { type: Array },
  MUSIC_CHANNELS: { type: Array },
  TWITCH: Twitch,
  MutedRole: { type: String },
  Logs: { type: Boolean },
  LogsChannel: { type: String },
  Pvc: Pvc
});

const model = new mongoose.Schema(
  {
    Creado: { type: String, required: true },
    PREFIX: { type: String, required: true },
    OWNER_ID: { type: String },
    REFERED: { type: Boolean },
    Partner: { type: Boolean },
    LAST_TIMESTAMP: { type: String, required: true },
    guildID: { type: String },
    isINDB: { type: Boolean },
    config: config,
  },
  { collection: "Guilds" }
);

module.exports = mongoose.model("Guilds", model);
