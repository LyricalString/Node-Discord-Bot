const parserTimeStamp = require("../..//utils/parserTimeStamp.js");
const fetch = require("node-fetch");

require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class McHistory extends Command {
  constructor(client) {
    super(client, {
      name: "mchistory",
      description: [
        "Shows past names from Minecraft User.",
        "Muestra nombres pasados ​​de un usuario de Minecraft.",
      ],
      usage: ["<minecraft java username>", "<nombre minecraft java>"],
      args: true,
      cooldown: 3,
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let args2 = args.join("%20");
      let Fecha;
      let NameMC;
      if (!args2[1])
        return message.channel.send(
          client.language.MCHISTORY[1] +
            process.env.prefix +
            client.language.MCHISTORY[2]
        );
      fetch(`https://mc-heads.net/minecraft/profile/${args2}`)
        .then((res) => {
          if (res.status == 200) {
            return res.json();
          } else {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.MCHISTORY[3])
              .setFooter(message.author.username, message.author.avatarURL());
            message.channel.send({embeds: [errorembed]});
            return undefined;
          }
        })
        .then((History_Info) => {
          if (!History_Info) return;

          const embedhistory = new Discord.MessageEmbed()
            .setTitle(client.language.MCHISTORY[4])
            .setColor(process.env.EMBED_COLOR)
            .setTimestamp(" ");

          for (
            var index = 0;
            index < History_Info["name_history"].length;
            index++
          ) {
            Fecha = History_Info["name_history"][index]["changedToAt"];
            NameMC = History_Info["name_history"][index]["name"];

            if (!Fecha) {
              embedhistory.addField(client.language.MCHISTORY[5], NameMC); // LENGUAJEEEEEEEEEEEEEEE
            } else {
              embedhistory.addField(parserTimeStamp(Fecha), NameMC);
            }
          }
          message.channel.send({
            embeds: [embedhistory],
          });
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
