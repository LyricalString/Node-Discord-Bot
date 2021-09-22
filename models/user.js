const mongoose = require("mongoose");

const Premium = new mongoose.Schema({
  Enabled: { type: Boolean, required: true },
  Date: { type: String },
});

const EarlyPremium = new mongoose.Schema({
  Enabled: { type: Boolean, required: true },
  Date: { type: String },
});

const Support = new mongoose.Schema({
  Enabled: { type: Boolean, required: true },
  Date: { type: String },
});

const Tester = new mongoose.Schema({
  Enabled: { type: Boolean, required: true },
  Date: { type: String },
});

const Booster = new mongoose.Schema({
  Enabled: { type: Boolean, required: true },
  Date: { type: String },
});

const Notifications = new mongoose.Schema({
  Enabled: { type: Boolean, required: true },
  Date: { type: String },
});

const Developer = new mongoose.Schema({
  Enabled: { type: Boolean, required: true },
  Date: { type: String },
});

const Event25k = new mongoose.Schema({
    CODE: { type: String, required: true },
    SERVERS: { type: String },
    USERS: { type: String },
})

const Roles = new mongoose.Schema({
  Premium: Premium,
  Developer: Developer,
  EarlyPremium: EarlyPremium,
  Tester: Tester,
  Notifications: Notifications,
  Booster: Booster,
  Support: Support,
  Event25k: Event25k
});

const Enviadas = new mongoose.Schema({
  bite: { type: Number },
  blush: { type: Number },
  bonk: { type: Number },
  bored: { type: Number },
  bully: { type: Number },
  bye: { type: Number },
  chase: { type: Number },
  cringe: { type: Number },
  cry: { type: Number },
  cuddle: { type: Number },
  dab: { type: Number },
  dance: { type: Number },
  die: { type: Number },
  facepalm: { type: Number },
  feed: { type: Number },
  glomp: { type: Number },
  hi: { type: Number },
  highfive: { type: Number },
  happy: { type: Number },
  hug: { type: Number },
  kill: { type: Number },
  kiss: { type: Number },
  laugh: { type: Number },
  lick: { type: Number },
  love: { type: Number },
  lurk: { type: Number },
  nervous: { type: Number },
  nope: { type: Number },
  pampering: { type: Number },
  panic: { type: Number },
  pat: { type: Number },
  peck: { type: Number },
  pout: { type: Number },
  run: { type: Number },
  sad: { type: Number },
  shoot: { type: Number },
  shrug: { type: Number },
  slap: { type: Number },
  sleep: { type: Number },
  stare: { type: Number },
  tease: { type: Number },
  think: { type: Number },
  thumbsup: { type: Number },
  tickle: { type: Number },
  triggered: { type: Number },
  wag: { type: Number },
  wave: { type: Number },
  wink: { type: Number },
  yes: { type: Number },
});

const Recibidas = new mongoose.Schema({
  bite: { type: Number },
  blush: { type: Number },
  bonk: { type: Number },
  bored: { type: Number },
  bully: { type: Number },
  bye: { type: Number },
  chase: { type: Number },
  cringe: { type: Number },
  cry: { type: Number },
  cuddle: { type: Number },
  dab: { type: Number },
  dance: { type: Number },
  die: { type: Number },
  facepalm: { type: Number },
  feed: { type: Number },
  glomp: { type: Number },
  hi: { type: Number },
  highfive: { type: Number },
  happy: { type: Number },
  hug: { type: Number },
  kill: { type: Number },
  kiss: { type: Number },
  laugh: { type: Number },
  lick: { type: Number },
  love: { type: Number },
  lurk: { type: Number },
  nervous: { type: Number },
  nope: { type: Number },
  pampering: { type: Number },
  panic: { type: Number },
  pat: { type: Number },
  peck: { type: Number },
  pout: { type: Number },
  run: { type: Number },
  sad: { type: Number },
  shoot: { type: Number },
  shrug: { type: Number },
  slap: { type: Number },
  sleep: { type: Number },
  stare: { type: Number },
  tease: { type: Number },
  think: { type: Number },
  thumbsup: { type: Number },
  tickle: { type: Number },
  triggered: { type: Number },
  wag: { type: Number },
  wave: { type: Number },
  wink: { type: Number },
  yes: { type: Number },
});

const Interacciones = new mongoose.Schema({
  Enviadas: Enviadas,
  Recibidas: Recibidas,
});

const Eventos = new mongoose.Schema({
  Event25k: Event25k
})

const model = new mongoose.Schema(
  {
    USERID: { type: String, required: true },
    LANG: { type: String },
    COMMANDS_EXECUTED: { type: Number },
    BANNED: { type: Boolean },
    PREMIUM_COMMANDS: { type: Array },
    isINDB: { type: Boolean },
    OLDMODE: { type: Boolean },
    Roles: Roles,
    Interacciones: Interacciones,
    Eventos: Eventos
  },
  { collection: "Users" }
);

module.exports = mongoose.model("Users", model);
