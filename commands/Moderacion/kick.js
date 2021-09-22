require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Kick extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: ["Kicks a user.", "Expulsa a un usuario."],
      usage: ["<@user> <reason>", "<@usuario> <razón>"],
      permissions: ["KICK_MEMBERS"],
      botpermissions: ["KICK_MEMBERS"],
      args: true,
      moderation: true,
      category: "Moderacion",
      nochannel: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
        message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``})
      } else {
        if (!message.deleted) message.delete().catch((e) => console.log(e));
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
            `${client.language.KICK[3]} **\`${process.env.prefix}${client.language.KICK[4]}\`**`
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (user === client.user.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(`${client.language.KICK[5]}`)
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (user.id === message.author.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(`${client.language.KICK[6]}`)
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (user.roles.highest.position > message.member.roles.highest.position) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(`${client.language.KICK[7]}`)
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (!user.bannable) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(`${client.language.KICK[8]}`)
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      let reason = "";
      if (args.length > 1) {
        args.shift();
        reason = args.join(" ");
      }
      await user.kick({
        reason: reason,
      });

      const embed = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setTitle(client.language.KICK[9])
        .setDescription(
          `<a:tick:836295873091862568> <@${user.id}> (**\`${user.user.tag}\`**) ${client.language.KICK[10]} **${message.guild.name}**`
        )
        .addField(
          client.language.KICK[11],
          `**\`${reason != "" ? reason : "-"}\`**`,
          true
        )
        .addField(
          client.language.KICK[12],
          `<@${message.member.id}> (**\`${message.member.user.tag}\`**)`,
          true
        )
        .setTimestamp(" ");
      await message.channel.send({embeds: [embed]});
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
