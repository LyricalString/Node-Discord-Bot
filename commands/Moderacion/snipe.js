require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Snipe extends Command {
  constructor(client) {
    super(client, {
      name: "snipe",
      description: [
        "Gets the latest message deleted!",
        "¡Obtiene el último mensaje eliminado!",
      ],
      cooldown: 5,
      usage: ["<#channel>", "<#canal>"],
      permissions: ["MANAGE_MESSAGES"],
      nochannel: true,
      category: "Moderacion",
      moderation: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
        message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``})
      } else {
        if (!message.deleted) message.delete().catch((e) => console.log(e));
      }
      const channel =
        message.mentions.channels.first() ||
        message.channel ||
        message.guild.channels.cache.find((channel) => channel.id === args[0]);
      const msg = client.snipes.get(channel.id);
      const errorembed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(client.language.ERROREMBED)
        .setDescription(client.language.SNIPE[1])
        .setFooter(message.author.username, message.author.avatarURL());
      if (!msg || !msg.delete) {
        message.channel.send({embeds: [errorembed]}).then((m) => {
          try {
            setTimeout(() => m.delete(), 5000);
          } catch (e) {}
        });
      } else {
        const main = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setAuthor(
            `${client.language.SNIPE[2]} ${msg.delete.tag}`,
            msg.delete.displayAvatarURL()
          )
          .addField(client.language.SNIPE[3], `<#${msg.canal.id}>`)
          .setTimestamp(" ");
        if (msg.content) main.setDescription(msg.content)
        if (msg.embed) {
          const embed = new Discord.MessageEmbed();
          embed.setAuthor(
            `${client.language.SNIPE[2]} ${msg.delete.tag}`,
            msg.delete.displayAvatarURL()
          );
          if (msg.title) embed.setTitle(msg.title);
          if (msg.description) embed.setDescription(msg.description);
          if (msg.url) embed.setURL(msg.url);
          if (msg.color) embed.setColor(msg.color);
          if (msg.timestamp) embed.setTimestamp(msg.timestamp);
          for (let field in msg.fields) {
            embed.addField(
              msg.fields[field].name,
              msg.fields[field].value,
              msg.fields[field].inline
            );
          }
          //if (msg.fields[0]) embed.addField(msg.fields)
          if (msg.thumbnail) embed.setThumbnail(msg.thumbnail.url);
          if (msg.image) embed.setImage(msg.image);
          if (msg.footer) embed.setFooter(msg.footer.text);
          return message.author.send({embeds: [embed]}).then(() => {
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(
                `¡Te he enviado una copia del mensaje por privado!`
              )
              .setFooter(message.author.username, message.author.avatarURL());
            message.channel.send({embeds: [embed]});
          });
        }
        message.channel.send({ embeds: [main]});
      }
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
