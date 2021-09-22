require("dotenv").config();
const Event = require("../../structures/Event.js");
const Discord = require("discord.js");
let guildAddWebhookID = process.env.guildAddWebhookID
let guildAddWebhookToken = process.env.guildAddWebhookToken
const webhookClient = new Discord.WebhookClient({
  id: guildAddWebhookID,
  token: guildAddWebhookToken
});

module.exports = class guildCreate extends Event {
  constructor(...args) {
    super(...args);
  }
  async run(guild) {
    if (guild.memberCount > 10000) {
      webhookClient.send(
        `Se ha añadido una nueva Guild: **${guild.name}**. Numero de usuarios: **${guild.memberCount}** <@155411408752869377> <@817466918357172285>`
      );
    } else if (guild.memberCount > 500) {
      webhookClient.send(
        `Se ha añadido una nueva Guild: **${guild.name}**. Numero de usuarios: **${guild.memberCount}**`
      );
    }
  }
}