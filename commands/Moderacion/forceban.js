require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Forceban extends Command {
  constructor(client) {
    super(client, {
      name: "forceban",
      description: ["Forcebans a user.", "Fuerza a banear a un usuario."],
      usage: ["<@user> <reason>", "<@usuario> <razón>"],
      alias: ["fb"],
      permissions: ["BAN_MEMBERS"],
      botpermissions: ["BAN_MEMBERS"],
      args: true,
      moderation: true,
      category: "Moderacion",
      nochannel: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      const user = args[0];
      if (!user) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            `${client.language.FORCEBAN[3]} **\`${process.env.prefix}${client.language.FORCEBAN[4]}\`**`
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (user === client.user.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(`${client.language.FORCEBAN[5]}`)
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (isNaN(user)) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(`${client.language.FORCEBAN[6]}`)
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (user.id === message.author.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(`${client.language.FORCEBAN[7]}`)
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      let reason = "";
      if (args.length > 1) {
        args.shift();
        reason = args.join(" ");
      }

      client.users
        .fetch(user)
        .then(async (user) => {
          await message.guild.members.ban(user.id, {
            days: 1,
            reason: reason,
          });

          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.FORCEBAN[8])
            .setDescription(
              `<a:tick:836295873091862568> <@${user.id}> (**\`${user.tag}\`**) ${client.language.FORCEBAN[9]} **${message.guild.name}**`
            )
            .addField(
              client.language.FORCEBAN[10],
              `**\`${reason != "" ? reason : "-"}\`**`,
              true
            )
            .addField(
              client.language.FORCEBAN[11],
              `<@${message.member.id}> (**\`${message.member.user.tag}\`**)`,
              true
            )
            .setTimestamp(" ");

          return message.channel.send({embeds: [embed]});
        })
        .catch((error) => {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(
              `${client.language.FORCEBAN[12]}\n\`\`\`${error}\`\`\``
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        });
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
