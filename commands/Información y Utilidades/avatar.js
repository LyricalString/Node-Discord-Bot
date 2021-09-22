require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      description: ["Send your avatar!", "¡Envía tu avatar!"],
      aliases: ["icon", "pfp", "av", "image"],
      cooldown: 5,
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    let embed = new Discord.MessageEmbed();
    let member;
    if (args[0]) {
      member =
        message.mentions.members.first() ||
        await message.guild.members.fetch(
          args[0].replace("<@", "").replace(">", "")
        ).catch(e => {
          return
        })
    }
    if (args[0] && !member) {
      const errorembed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(client.language.ERROREMBED)
        .setDescription(client.language.AVATAR[1])
        .setFooter(message.author.username, message.author.avatarURL());
      return message.channel.send({ embeds: [errorembed]});
    }
    if (!member) {
      embed.setColor("00ff00");
      embed.setImage(
        message.author.displayAvatarURL({
          dynamic: true,
          size: 4096,
        })
      );
      message.channel.send({ embeds: [embed] });
    } else {
      let user =
        message.mentions.users.first() ||
        await message.guild.members.fetch(
          args[0].replace("<@", "").replace(">", "")
        ).catch(e => {
          return
        })
      if (lang == "es_ES") {
        embed.setFooter(`${client.language.AVATAR[2]} ${member.user.tag}!`);
        embed.setImage(
          member.user.displayAvatarURL({
            dynamic: true,
            size: 4096,
          })
        );
        embed.setColor("#00ff00");
        message.channel.send({ embeds: [embed] });
      } else {
        embed.setFooter(`${member.user.tag}${client.language.AVATAR[3]}`);
        embed.setImage(
          member.user.displayAvatarURL({
            dynamic: true,
            size: 4096,
          })
        );
        embed.setColor("#00ff00");
        message.channel.send({ embeds: [embed] });
      }
    }
    try {
    } catch (e) {
      console.error(e);
      message.channel.send({ embeds: [
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
