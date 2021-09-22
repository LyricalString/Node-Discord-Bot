require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Unlock extends Command {
  constructor(client) {
    super(client, {
      name: "unlock",
      description: [
        "Unlocks the channel for everyone.",
        "Desbloquea el canal para el público general.",
      ],
      permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS"],
      botpermissions: ["MANAGE_GUILD", "MANAGE_CHANNELS"],
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
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SEND_MESSAGES: true,
      });
      const embed = new Discord.MessageEmbed()
        .setTitle(client.language.LOCK[3])
        .setDescription(`🔓 ${message.channel} ${client.language.UNLOCK}`)
        .setColor(process.env.EMBED_COLOR);
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
