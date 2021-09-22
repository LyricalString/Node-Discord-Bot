require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const guildSchema = require("../../models/guild.js");

module.exports = class Warn extends Command {
  constructor(client) {
    super(client, {
      name: "warn",
      description: ["Warns a user.", "Advierte a un usuario."],
      usage: ["<user> <reason>", "<@usuario> <razón>"],
      permissions: ["BAN_MEMBERS"],
      args: true,
      category: "Moderacion",
      moderation: true,
      nochannel: true,
      production: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
        message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``})
      } else {
        if (!message.deleted) message.delete().catch((e) => console.log(e));
      }
      if (!message.member.hasPermission("MUTE_MEMBERS")) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            client.language.WARN[1]
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] })
      }
      const user =
        message.mentions.members.first() ||
        await message.guild.members.fetch(args[0]).catch(e => {
          return
        });
      if (!user) {
        const errorembed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(
                          client.language.WARN[2] + prefix + client.language.WARN[8]
                        )
                        .setFooter(message.author.username, message.author.avatarURL());
                return message.channel.send({ embeds: [errorembed] })
      }
      const target = await message.guild.members.fetch(user.id).catch(e => {
        return
      });

      guildSchema
        .findOne({
          guildID: message.guild.id,
        })
        .then((s, err) => {
          if (s.WARNS) {
            if (s.WARNS[user.id]) {
              s.WARNS[user.id] += 1;
            } else {
              s.WARNS[user.id] = 1;
            }
            s.save().catch((err) => s.update());
            console.debug(s);
          } else {
            s.WARNS = "";
            console.debug(s.WARNS);
            s.WARNS[user.id] = 1;
            console.debug(s.WARNS);
            s.save().catch((err) => s.update());
          }
        });

      let reason = "";
      if (args.length > 1) {
        args.shift();
        reason = args.join(" ");
      }

      const warn = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setDescription(
          `${user} ${client.language.WARN[6]} ${message.author}. ${client.language.WARN[7]
          } **${args != "" ? args.join(" ") : "-"}**`
        )
        .setTimestamp(" ");
      message.channel.send({ embeds: [warn]});
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
      } catch (e) { }
    }
  }
};
