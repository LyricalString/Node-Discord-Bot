const Discord = require("discord.js");
const chalk = require("chalk");
const fs = require("fs");
const archivo = require(".././lang/index.json");
const language = fs
  .readFileSync("lang/" + archivo.find((language) => language.default).archivo)
  .toString();

module.exports = class Client extends Discord.Client {
  constructor() {
    super({
      partials: ["MESSAGE", "CHANNEL"],
      disableMentions: "everyone",
      intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES","GUILD_MESSAGE_REACTIONS"],
      messageCacheMaxSize: 50,
      messageCacheLifetime: 60,
      messageSweepInterval: 60,
      retryLimit: 2,
      restGlobalRateLimit: 50
    });

    this.commands = new Discord.Collection();
    this.messages = new Discord.Collection();
    this.snipes = new Map();
    this.aliases = new Discord.Collection();
    this.language = JSON.parse(language);
  }
  async login(token = this.token) {
    super.login(token);
  }
};
