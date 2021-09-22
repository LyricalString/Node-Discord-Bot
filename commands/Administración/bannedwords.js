const Discord = require("discord.js");
const guildSchema = require("../../models/guild.js");
const Command = require("../../structures/Commandos.js");
require("dotenv").config();

module.exports = class Ctegory extends Command {
  constructor(client) {
    super(client, {
      name: "bannedwords",
      description: [
        "Modifies the array of banned words for phishing automod.",
        "Modifica la lista de palabras prohibidas para el moderador automático antiphishing.",
      ],
      permissions: ["ADMINISTRATOR"],
      subcommands: ["add", "del", "show", "reset"],
      cooldown: 1,
      nochannel: true,
      alias: ["bw"],
      usage: [
        "<add/del> (word of url) or bannedwords <show>",
        "<add/del> (palabra del url estilo) o bannedwords <show>",
      ],
      category: "Administracion",
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (args[0].toLowerCase() == "add" && args[1]) {
        let word = args[1].toLowerCase();
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (s && s.config.PhishingDetection.BannedWords) {
              if (!s.config.PhishingDetection.BannedWords.includes(word)) {
                s.config.PhishingDetection.BannedWords.push(word);
                message.guild.config.PhishingDetection.BannedWords.push(word);
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setTitle(client.language.SUCCESSEMBED)
                  .setDescription(client.language.BANNEDWORDS[1] + word + ".")
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [embed]});
              } else {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.BANNEDWORDS[2])
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [errorembed]});
              }
            }
          });
      } else if (
        (args[0].toLowerCase() === "del" ||
          args[0].toLowerCase() === "delete") &&
        args[1]
      ) {
        let word = args[1].toLowerCase();
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (s) {
              if (s.config.PhishingDetection.BannedWords.includes(word)) {
                s.config.PhishingDetection.BannedWords.splice(s.config.PhishingDetection.BannedWords.indexOf(word), s.config.PhishingDetection.BannedWords.indexOf(word) + 1);
                message.guild.config.PhishingDetection.BannedWords.splice(
                  message.guild.config.PhishingDetection.BannedWords.indexOf(
                    word
                  ),
                  message.guild.config.PhishingDetection.BannedWords.indexOf(
                    word
                  ) + 1
                );
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setFooter(
                    client.language.BANNEDWORDS[3] + word,
                    message.author.displayAvatarURL()
                  )
                  .setTimestamp(" ");
                message.channel.send({embeds: [embed]});
              } else {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.BANNEDWORDS[4])
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [errorembed]});
              }
            }
          });
      } else if (args[0].toLowerCase() === "show") {
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (s) {
              if (!s.config.PhishingDetection.BannedWords[0]) {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.BANNEDWORDS[5])
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [errorembed]});
              } else {
                const embedadmins = new Discord.MessageEmbed()
                  .setTitle("<:IconPrivateThreadIcon:859608405497217044>" + client.language.BANNEDWORDS[6])
                  .setColor(process.env.EMBED_COLOR)
                  .setTimestamp(" ");
                for (let index in s.config.PhishingDetection.BannedWords) {
                  let ListBannedWords = s.config.PhishingDetection.BannedWords[index];
                  embedadmins.addField("\u200B", "- " + ListBannedWords);
                }

                message.channel.send({
                  embeds: [embedadmins]
                });
              }
            }
            return;
          });
      } else if (args[0].toLowerCase() === "reset") {
        guildSchema
          .findOne({
            guildID: message.guild.id.toString(),
          })
          .then((s, err) => {
            if (err) console.error(err);
            if (s) {
              for (let index in s.config.CHANNELID) {
                s.config.CHANNELID.splice(index);
              }
            }
            s.save().catch((err) => s.update());
            message.guild.config.channelid = [];
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(client.language.BANNEDWORDS[8])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          });
      } else {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            client.language.BANNEDWORDS[7] + "`" + prefix + "command" + "`"
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }
    } catch (e) {
      console.error(e);
      message.channel.send(
        new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(client.language.ERROREMBED)
        .setDescription(client.language.fatal_error)
        .setFooter(message.author.username, message.author.avatarURL())
      );
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