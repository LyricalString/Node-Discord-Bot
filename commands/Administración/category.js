const Discord = require("discord.js");
const guildSchema = require("../../models/guild.js");
const Command = require("../../structures/Commandos.js");
require("dotenv").config();

module.exports = class Ctegory extends Command {
  constructor(client) {
    super(client, {
      name: "category",
      description: [
        "Allows o denies the usage of commands from a category.",
        "Habilita o deshabilita el uso de comandos de una categoría.",
      ],
      permissions: ["ADMINISTRATOR"],
      subcommands: ["enable", "disable", "show", "list"],
      cooldown: 1,
      nochannel: true,
      alias: ["cat", "categoria"],
      usage: [
        "<enable/disable> (category name) or category <show/list>",
        "<enable/disable> (nombre de la categoría) o category <show/list>",
      ],
      category: "Administracion",
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    let categories = [
      "administracion",
      "diversion",
      "musica",
      "moderacion",
      "info",
      "interaccion",
      "sesiones",
      "administration",
      "fun",
      "music",
      "moderation",
      "info",
      "interaction",
      "sessions",
      "informacion",
      "information",
    ];
    try {
      if (args[0].toLowerCase() == "disable" && args[1]) {
        let category = args[1].toLowerCase();
        if (!categories.includes(category)) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(
              `**${args[1]}** ${client.language.CATEGORY[1]}${prefix}${client.language.CATEGORY[13]}`
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (s && s.config.DISABLED_CATEGORIES) {
              if (!s.config.DISABLED_CATEGORIES.includes(category)) {
                s.config.DISABLED_CATEGORIES.push(category);
                message.guild.config.DISABLED_CATEGORIES.push(category);
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setTitle(client.language.SUCCESSEMBED)
                  .setDescription(client.language.CATEGORY[2] + category)
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [embed]});
              } else {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.CATEGORY[3])
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [errorembed]});
              }
            }
          });
      } else if (args[0].toLowerCase() === "enable" && args[1]) {
        let category = args[1].toLowerCase();
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (s) {
              if (s.config.DISABLED_CATEGORIES.includes(category)) {
                s.config.DISABLED_CATEGORIES.splice(
                  s.config.DISABLED_CATEGORIES.indexOf(category),
                  s.config.DISABLED_CATEGORIES.indexOf(category) + 1
                );
                message.guild.config.DISABLED_CATEGORIES.splice(
                  message.guild.config.DISABLED_CATEGORIES.indexOf(category),
                  message.guild.config.DISABLED_CATEGORIES.indexOf(category) + 1
                );
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setFooter(
                    client.language.CATEGORY[5] + category,
                    message.author.displayAvatarURL()
                  )
                  .setTimestamp(" ");
                message.channel.send({embeds: [embed]});
              } else {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.CATEGORY[6])
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
              if (!s.config.DISABLED_CATEGORIES[0]) {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.CATEGORY[7])
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [errorembed]});
              } else {
                const embedadmins = new Discord.MessageEmbed()
                  .setTitle(
                    "<:IconPrivateThreadIcon:859608405497217044>" +
                      client.language.CATEGORY[2]
                  )
                  .setColor(process.env.EMBED_COLOR)
                  .setTimestamp(" ");
                for (
                  var index = 0;
                  index < s.config.DISABLED_CATEGORIES.length;
                  index++
                ) {
                  let ListAdmin = s.config.DISABLED_CATEGORIES[index];
                  embedadmins.addField("\u200B", "- " + ListAdmin);
                }

                message.channel.send({
                  embed: embedadmins,
                });
              }
            }
            return;
          });
      } else if (args[0].toLowerCase() === "reset") {
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (err) console.error(err);
            if (s) {
              for (let index in s.config.DISABLED_CATEGORIES) {
                s.config.DISABLED_CATEGORIES.splice(index);
              }
            }
            s.save().catch((err) => s.update());
            message.guild.config.DISABLED_CATEGORIES = [];
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(client.language.SHOWLISTENINGCHANNEL[5])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          });
      } else if (args[0].toLowerCase() === "list") {
        const embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setTitle(client.language.CATEGORY[14])
          .setDescription(client.language.CATEGORY[15])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [embed]});
      } else {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            client.language.CATEGORY[9] + "`" + prefix + "category" + "`"
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
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
