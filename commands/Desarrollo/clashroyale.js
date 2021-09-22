const axios = require("axios");
require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class ClashRoyale extends Command {
  constructor(client) {
    super(client, {
      name: "clashroyale",
      description: [
        "Display info about the Github account.",
        "Muestra información sobre una cuenta de Github.",
      ],
      usage: ["<username>", "<usuario>"],
      args: false,
      production: true,
      alias: ["clashroyale"],
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (!args[0]) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.INSTAGRAM[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }
      const sentMessage = await message.channel.send(client.language.TIKTOK[1]);
      let response, details;
      response = await axios
        .get(`https://api.clashroyale.com/v1/players/#V9rqulj`, {
          headers: {
            method: "GET",
            scheme: "https",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en,es-ES;q=0.9,es;q=0.8",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
          },
        })
        .catch((e) => {
          return sentMessage.edit("Ese usuario no existe.");
        });
      const account = await response.data;
      console.log(account);
      if (!account) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.INSTAGRAM[13])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }
      if (!account.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.INSTAGRAM[13])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      const embed2 = new Discord.MessageEmbed()
        .setDescription(response)
        .setColor(process.env.EMBED_COLOR);

      sentMessage.edit({ embed: embed2 });
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

function formatNumber(parameter) {
  if (parameter.toString().length >= 7) {
    return parameter.toString() / 1000000 + "M";
  } else if (parameter.toString().length >= 5) {
    return parameter.toString() / 1000 + "K";
  } else {
    return parameter.toString();
  }
}
