require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Sleep extends Command {
  constructor(client) {
    super(client, {
      name: "sleep",
      description: [
        "Shows that you are sleep.",
        "Muestra que estás durmiendo.",
      ],
      category: "Interaccion",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      const { soyultro } = require("soyultro");
      let author = message.author.username;
      let embed = new Discord.MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
        .setTitle(`${author} ${client.language.SLEEP[1]}`)
        .setColor(process.env.EMBED_COLOR)
        .setImage(soyultro("sleep"));

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
