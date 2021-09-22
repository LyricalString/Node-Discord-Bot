require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Achievement extends Command {
  constructor(client) {
    super(client, {
      name: "achievement",
      description: [
        "Returns a custom Minecraft achievement!",
        "¡Devuelve un logro personalizado de Minecraft!",
      ],
      alias: ["mcachievement", "logro", "mclogro"],
      usage: [
        "<block>, <title>, <message>, <message2>",
        "<bloque>, <titulo>, <mensaje>, <mensaje2>",
      ],
      category: "Diversion",
      //role: "tester",
      production: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let args1 = args.join(" ");
      let args2 = args1.split(", ");
      if (!args2[1] || !args2[2]) {
        const error = new Discord.MessageEmbed()
          .setTitle(client.language.ACHIEVEMENT)
          .addField("\u200b", `\`${client.language.ACHIEVEMENTEMBED}\``)
          .setColor(process.env.EMBED_COLOR);
        message.channel.send({ embeds: [error] });
      }
      let title = args2[1].replace(/ /g, "..");
      let message2 = args2[2].replace(/ /g, "..");
      if (args2[3]) {
        let message3 = args2[3].replace(/ /g, "..");
        message.channel.send(
          `https://minecraft-api.com/api/achivements/${args2[0]}/${title}/${message2}/${message3}`
        );
        return;
      }
      message.channel.send(
        `https://minecraft-api.com/api/achivements/${args2[0]}/${title}/${message2}/`
      );
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
