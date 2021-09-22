const Discord = require("discord.js");
const guildSchema = require("../../models/guild.js");
const Command = require("../../structures/Commandos.js");
require("dotenv").config();

module.exports = class Command2 extends Command {
  constructor(client) {
    super(client, {
      name: "command",
      description: [
        "Allows o denies the usage of commands.",
        "Habilita o deshabilita el uso de comandos.",
      ],
      permissions: ["ADMINISTRATOR"],
      subcommands: ["enable", "disable", "show", "reset"],
      cooldown: 1,
      nochannel: true,
      alias: ["cmd", "comand"],
      usage: [
        "<enable/disable> (command name) or comand <show>",
        "<enable/disable> (nombre del comando) o command <show>",
      ],
      //role: "dev", //dev, tester, premium, voter
      category: "administracion",
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (args[0].toLowerCase() === "disable" && args[1]) {
        if (!client.commands.get(args[1])) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(`**${args[1]}** ${client.language.COMMAND[1]}`)
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        let command = args[1].toLowerCase();
        if (args[1].toLowerCase() == "command") return;
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (s) {
              if (!s.config.DISABLED_COMMANDS.includes(command)) {
                s.config.DISABLED_COMMANDS.push(command);
                message.guild.config.DISABLED_COMMANDS.push(command);
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setTitle(client.language.SUCCESSEMBED)
                  .setDescription(client.language.COMMAND[2] + command)
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [embed]});
              } else {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.COMMAND[3])
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [errorembed]});
              }
            }
          });
      } else if (args[0].toLowerCase() === "enable" && args[1]) {
        if (!client.commands.get(args[1])) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.COMMAND[4])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        let command = args[1];
        guildSchema
          .findOne({
            guildID: message.guild.id,
          })
          .then((s, err) => {
            if (s) {
              if (s.config.DISABLED_COMMANDS.includes(command)) {
                s.config.DISABLED_COMMANDS.splice(
                  s.config.DISABLED_COMMANDS.indexOf(command),
                  s.config.DISABLED_COMMANDS.indexOf(command) + 1
                );
                message.guild.config.DISABLED_COMMANDS.splice(
                  message.guild.config.DISABLED_COMMANDS.indexOf(command),
                  message.guild.config.DISABLED_COMMANDS.indexOf(command) + 1
                );
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setTitle(client.language.SUCCESSEMBED)
                  .setDescription(client.language.COMMAND[5] + command)
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [embed]});
              } else {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.COMMAND[6])
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
              if (!s.config.DISABLED_COMMANDS[0]) {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(client.language.COMMAND[7])
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [errorembed]});
              } else {
                const embedadmins = new Discord.MessageEmbed()
                  .setTitle(
                    "<:IconPrivateThreadIcon:859608405497217044>" +
                      client.language.COMMAND[8]
                  )
                  .setColor(process.env.EMBED_COLOR)
                  .setTimestamp(" ");
                for (
                  var index = 0;
                  index < s.config.DISABLED_COMMANDS.length;
                  index++
                ) {
                  let ListAdmin = s.config.DISABLED_COMMANDS[index];
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
              for (let index in s.CHANNELID) {
                s.config.DISABLED_COMMANDS.splice(index);
              }
            }
            s.save().catch((err) => s.update());
            message.guild.config.DISABLED_COMMANDS = [];
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(client.language.SHOWLISTENINGCHANNEL[5])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          });
      } else {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            client.language.COMMAND[9] + "`" + prefix + "command" + "`"
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
