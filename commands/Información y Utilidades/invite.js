require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: [
        "Give the invite link for Node Bot.",
        "Te da el enlace de invitación para Node Bot.",
      ],
      alias: ["invitacion", "invitación", "invitation", "inv"],
      cooldown: 3,
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let embed = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setDescription(client.language.INVITE);
      return message.channel.send({embeds: [embed]});
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
