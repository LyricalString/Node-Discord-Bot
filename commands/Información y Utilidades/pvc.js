require("dotenv").config();

const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const guildModel = require('../../models/guild.js')

module.exports = class PVC extends Command {
  constructor(client) {
    super(client, {
      name: "pvc",
      description: [
        "Opens/Closes your Private Channel.",
        "Abre/cierra su canal privado.",
      ],
      args: true,
      cooldown: 3,
      usage: ["<open/close/ban/unban>", "<open/close/ban/unban>"],
      category: "Info"
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      guildModel.findOne({guildID: message.guild.id.toString()}).then(async (s, err) => {
        if(err) return
        if (!s) return
        let channel = message.guild.channels.cache.get(
          message.member.voice.channelId
        );
        if (!s.config.Pvc) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription('Debes de configurar previamente el módulo de Private Voice Channels desde /config pvc')
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({ embeds: [errorembed] });
        }
        if (!channel || channel.parentId != s.config.Pvc.Category || s.config.Pvc.TemporaryChannels.indexOf(channel.id + message.author.id) == -1) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.PVC[1] + "<#" + s.config.Pvc.StartingChannel + ">")
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({ embeds: [errorembed] });
        }
        if (args[0].toLowerCase() == "open") {
          channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            VIEW_CHANNEL: true,
          });
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setDescription(
              `<@${message.author.id}> ${client.language.PVC[2]}`,
              message.author.displayAvatarURL()
            )
            .setTimestamp(" ");
          message.channel.send({ embeds: [embed] });
        } else if (args[0].toLowerCase() == "close") {
          channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            VIEW_CHANNEL: false,
          });
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setDescription(
              `<@${message.author.id}> ${client.language.PVC[3]}`,
              message.author.displayAvatarURL()
            )
            .setTimestamp(" ");
          message.channel.send({ embeds: [embed] });
        } else if (args[0].toLowerCase() == "ban") {
          if (!args[1]) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                `${client.language.PVC[4]} \`.pvc ban ${client.language.PVC[5]}\``
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] })
          }
          let miembro =
            await message.guild.members.fetch(args[1]).catch(e => {
              return
            }) ||
            message.mentions.members.first();
          if (!miembro) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.PVC[12])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }
          miembro.voice.disconnect();
          channel.permissionOverwrites.edit(miembro, {
            VIEW_CHANNEL: false,
          });
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setDescription(
              `${client.language.PVC[6]} <@${miembro.id}> ${client.language.PVC[7]}`,
              message.author.displayAvatarURL()
            )
            .setTimestamp(" ");
          message.channel.send({ embeds: [embed] });
        } else if (args[0].toLowerCase() == "unban") {
          if (!args[1]) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                `${client.language.PVC[8]} \`.pvc unban ${client.language.PVC[9]}\``
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] })
          }
          let miembro =
            await message.guild.members.fetch(args[1]).catch(e => {
              return
            }) ||
            message.mentions.members.first();
          if (!miembro) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.PVC[12])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }
          channel.permissionOverwrites.edit(miembro, {
            VIEW_CHANNEL: true,
          });
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setDescription(
              `${client.language.PVC[10]} <@${miembro.id}> ${client.language.PVC[11]}`,
              message.author.displayAvatarURL()
            )
            .setTimestamp(" ");
          message.channel.send({ embeds: [embed] });
        }
      })
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