require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const axios = require("axios");

module.exports = class Love extends Command {
  constructor(client) {
    super(client, {
      name: "love",
      description: [
        "Shows the love between you and a user.",
        "Muestra el amor entre tú y un usuario.",
      ],
      usage: ["<@user>", "<@usuario>"],
      category: "Interaccion",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let user;
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
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.LOVE[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }
      if (!user.user) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.LOVE[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }
      if (user.user.id == message.author.id) {
        let embed = new Discord.MessageEmbed()
          .setTimestamp(" ")
          .setColor(process.env.EMBED_COLOR)
          .setFooter(
            client.language.LOVE[2],
            message.author.displayAvatarURL()
          );
        return message.channel.send({embeds: [embed]});
      }
      if (user.user.id == client.user.id) {
        let embed = new Discord.MessageEmbed()
          .setTimestamp(" ")
          .setColor(process.env.EMBED_COLOR)
          .setFooter(
            client.language.LOVE[3],
            message.author.displayAvatarURL()
          );
        return message.channel.send({embeds: [embed]});
      }

      const random = Math.floor(Math.random() * 100);
      let emoji = "";
      if (random < 50) {
        emoji = "<a:331263527c8547b29dc5d4c1ccca311b:835912709605949541>";
      } else if (random < 80) {
        emoji = "<a:239cb599aefe44e38294b04b3d86aec5:835912603528069132> "; // Un pequeño Match.Floor para hacerlo random y no de el mismo resultado!
      } else if (random < 101) {
        emoji = "<a:pog:835912234201907220>";
      }
      const { soyultro } = require("soyultro");
      let resp = [
        client.language.LOVE[4] +
          `${message.author.username} & ${user.user.username}` +
          client.language.LOVE[5],
        client.language.LOVE[6] +
          `${message.author.username} & ${user.user.username}` +
          client.language.LOVE[7],
      ];
      let msg = resp[Math.floor(Math.random() * resp.length)];
      const embed = new Discord.MessageEmbed()
        .setAuthor(`${msg}`)
        .setDescription(`${emoji} ${random}% ${emoji}`) //Resultado aleatorio de lo anterior estructurado
        .setColor(process.env.EMBED_COLOR)
        .setImage(soyultro("love"));
      if (args.length > 1) {
        args.shift();
        const reason = args.join(" ");
        embed.addField("\u200b", reason);
      }
      message.channel.send({embeds: [embed]});
    } catch (e) {
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
