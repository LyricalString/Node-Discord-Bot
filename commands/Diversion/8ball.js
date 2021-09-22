require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class EightBall extends Command {
  constructor(client) {
    super(client, {
      name: "8ball",
      description: [
        "Ask your question to 8ball.",
        "Hazle tu pregunta a 8ball.",
      ],
      usage: ["<question>", "<pregunta>"],
      category: "diversion",
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let respuesta = client.language.QUESTIONBALL[4];
      let argumentos = args.join(" ");
      if (!argumentos.includes("?")) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            client.language.QUESTIONBALL[3]
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] })
      }
      var random = respuesta[Math.floor(Math.random() * respuesta.length)]; //aqui decimos que va a elegir una respuesta random de el let respuesta
      const embed = new Discord.MessageEmbed() //definimos el embed
        .addField(client.language.QUESTIONBALL[1], `${args.join(" ")}`) //primer valor decimos a su pregunta y en el segundo valor va la pregunta que iso el usuario
        .addField(client.language.QUESTIONBALL[2], `${random}`) //primer valor decimos "Mi respuesta" y en el segundo decimos que va a agarrar el var random
        .setColor(process.env.EMBED_COLOR); //un color random
      message.channel.send({ embeds: [embed] }); //y que mande el embed
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
      } catch (e) { }
    }
  }
};
