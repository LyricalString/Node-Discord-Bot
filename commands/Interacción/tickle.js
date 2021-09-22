require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Tickle extends Command {
  constructor(client) {
    super(client, {
      name: "tickle",
      description: [
        "Makes tickles to the mentioned user.",
        "Hace cosquillas al usuario mencionado.",
      ],
      usage: ["<@user>", "<@usuario>"],
      category: "Interaccion"
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let user
      if (args[0]) {
				user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(e => {
					return
				})
			} else {
				if (message.mentions.repliedUser) {
					user = await message.guild.members.fetch(message.mentions.repliedUser.id).catch(e => {
						return
					})
				} else {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.NOARGS)
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
			}

      if (!user) {
        const { soyultro } = require("soyultro");
        let author = message.author.username;
        let embed = new Discord.MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
          .setTitle(`${author} ${client.language.TICKLE[3]} ${args.join(" ")}`)
          .setColor(process.env.EMBED_COLOR)
          .setImage(soyultro("tickle"));
        return message.channel.send({embeds: [embed]});
      }
      if (user.id == message.author.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.TICKLE[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }
      const { soyultro } = require("soyultro");
      let author = message.author.username;
      let embed = new Discord.MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
        .setTitle(
          `${author} ${client.language.TICKLE[3]} ${user.user.username}`
        )
        .setColor(process.env.EMBED_COLOR)
        .setImage(soyultro("tickle"));

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
