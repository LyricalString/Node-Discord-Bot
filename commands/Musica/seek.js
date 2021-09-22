require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Seek extends Command {
  constructor(client) {
    super(client, {
      name: "seek",
      description: [
        "Skips to a timestamp in the song.",
        "Avanza hasta cierto segundo en la cancion.",
      ],
      usage: [],
      category: "musica",
      args: true,
      role: 'tester'
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (isNaN(args[0])) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            `${client.language.SEEK[1]} ${prefix}seek <${client.language.SEEK[2]}>`
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]})
      }
      const player = client.manager.players.get(message.guild.id);
      if (args[0] * 1000 >= player.queue.current.length || args[0] < 0) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            client.language.SEEK[3]
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]})
      }
      player.seek(args[0] * 1000);
      const embed = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setTitle(client.language.SUCCESSEMBED)
        .setDescription(
          `${client.language.SEEK[4]} ${args[0]}${client.language.SEEK[5]}`
        )
        .setFooter(message.author.username, message.author.avatarURL());
      return message.channel.send({embeds: [embed]})
    } catch (e) {
      message.author
        .send(
          "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
        )
        .catch(e)
        .catch(e);
      webhookClient.send(
        `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
      );
    }
  }
};
