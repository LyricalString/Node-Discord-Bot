require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const userModel = require("../../models/user.js");

module.exports = class OldMode extends Command {
  constructor(client) {
    super(client, {
      name: "oldmode",
      description: [
        "Allows to enable and disable the old features if you are not able to view the new features.",
        "Permite habilitar y deshabilitar las funciones antiguas por si no eres capaz de ver las funciones nuevas.",
      ],
      usage: ["<enable/disable>", "<enable/disable>"],
      category: "Info",
      subcommands: ["enable", "disable"],
      alias: ["og"],
      cooldown: 1,
      args: true,
      production: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      userModel
        .findOne({
          USERID: message.author.id.toString(),
        })
        .then((s, err) => {
          if (err) return;
          if (args[0].toLowerCase() == "enable") {
            message.member.user.OLDMODE = true;
            s.OLDMODE = true;
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(client.language.OLDMODE[1])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          } else if (args[0].toLowerCase() == "disable") {
            message.member.user.OLDMODE = false;
            s.OLDMODE = false;
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(client.language.OLDMODE[2])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          }
          s.save().catch((e) => console.error(e));
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
