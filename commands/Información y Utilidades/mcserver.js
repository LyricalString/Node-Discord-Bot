const axios = require("axios");

require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class McServer extends Command {
  constructor(client) {
    super(client, {
      name: "mcserver",
      description: [
        "Gets information about a Minecraft Server!",
        "¡Obtiene información sobre un servidor de Minecraft!",
      ],
      alias: [
        "minecraftserver",
        "ms",
        "mcstatus",
        "mcserverstatus",
        "mstatus",
        "mcservers",
      ],
      usage: ["<server ip>", "<ip del servidor>"],
      spam: true,
      cooldown: 5,
      args: true,
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let url;
      if (args[1]) {
        url = `http://status.mclive.eu/${args[0]}/${args[0]}/${args[1]}/banner.png`;
      } else {
        url = `http://status.mclive.eu/${args[0]}/${args[0]}/25565/banner.png`;
      }
      axios
        .get(url, {
          responseType: "arraybuffer",
        })
        .then((image) => {
          let returnedB64 = Buffer.from(image.data).toString("base64");
          const sfattach = new Discord.MessageAttachment(
            image.data,
            "output.png"
          );
          message.channel.send({files: [sfattach]});
        })
        .catch(() => {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.MCSERVER[12])
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
