require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Slowmode extends Command {
  constructor(client) {
    super(client, {
      name: "slowmode",
      description: [
        "Sets the slowmode on the channel.",
        "Establece el modo lento a un canal.",
      ],
      usage: ["<duration>", "<duración>"],
      permissions: ["MANAGE_CHANNELS"],
      botpermissions: ["MANAGE_CHANNELS"],
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
      if (isNaN(args[0]) || parseInt(args[0]) < 0) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.SLOWMODE[3])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (parseInt(args[0]) > 21600) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.SLOWMODE[4])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      const duration = args[0];

      message.channel.setRateLimitPerUser(duration);

      const embed = new Discord.MessageEmbed()
        .setTitle("SlowMode")
        .setColor(process.env.EMBED_COLOR)
        .setDescription(
          `<a:tick:836295873091862568> ${client.language.SLOWMODE[5]} **\`${duration}\`** ${client.language.SLOWMODE[6]} **\`.slowmode 0\`**`
        )
        .addField(client.language.SLOWMODE[7], `<#${message.channel.id}>`, true)
        .addField(client.language.SLOWMODE[8], `<@${message.author.id}>`, true)
        .setTimestamp(" ")
        .setFooter(
          `${client.language.SLOWMODE[9]} ${message.member.displayName}`,
          message.author.displayAvatarURL({
            dynamic: true,
          })
        );

      message.channel.send({embeds: [embed]});
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
