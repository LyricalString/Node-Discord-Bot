const Discord = require("discord.js");
const guildSchema = require("../../models/guild.js");
const Command = require("../../structures/Commandos.js");
require("dotenv").config();

module.exports = class Spam extends Command {
  constructor(client) {
    super(client, {
      name: "spammode",
      description: [
        "Enables or disables the spam commands.",
        "Habilita o deshabilita los comandos de spam.",
      ],
      permissions: ["ADMINISTRATOR"],
      subcommands: ["enable", "disable"],
      cooldown: 1,
      nochannel: true,
      usage: ["<enable/disable>", "<enable/disable>"],
      category: "administracion",
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (args[0]) {
        if (args[0].toLowerCase() == "enable") {
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((data) => {
              data.config.spam = true;
              data.save().catch((err) => console.error(err));
            });
          message.guild.config.spam = true;
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.SUCCESSEMBED)
            .setDescription(client.language.SPAMMODE[1])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [embed]});
        } else if (args[0].toLowerCase() == "disable") {
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((data) => {
              data.config.spam = false;
              data.save().catch((err) => console.error(err));
            });
          message.guild.config.spam = false;
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.SUCCESSEMBED)
            .setDescription(client.language.SPAMMODE[2])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [embed]});
        }
      }
    } catch (e) {
      console.error(e);
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.fatal_error)
          .setFooter(message.author.username, message.author.avatarURL())
        ]
      });
      webhookClient.send(
        `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
      );
      try {
        message.author
          .send(
            "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
          )
          .catch(e);
      } catch (e) {}
    }
  }
};
