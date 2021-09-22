require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: [
        "Shows the real-time ping of the bot.",
        "Muestra el ping en tiempo real del bot.",
      ],
      cooldown: 5,
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let ping = Math.abs(message.createdTimestamp - Date.now());
      const embed = new Discord.MessageEmbed()

        .setTitle(`Ping:`)
        .setColor(process.env.EMBED_COLOR)
        .addField(
          `API: ${Math.round(client.ws.ping)} ms`,
          client.language.PING[1]
        )
        .addField(`Bot: ${ping} ms`, client.language.PING[2])
        .setTimestamp(" ");

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
