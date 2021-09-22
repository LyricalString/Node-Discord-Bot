const Discord = require("discord.js");
const guildSchema = require("../../models/guild.js");
const Command = require("../../structures/Commandos.js");
require("dotenv").config();

module.exports = class Channel extends Command {
  constructor(client) {
    super(client, {
      name: "channel",
      description: [
        "Sets the listening channel for Node.",
        "Establece el canal de escucha para Node.",
      ],
      permissions: ["ADMINISTRATOR"],
      subcommands: ["add", "del", "show", "reset"],
      cooldown: 1,
      nochannel: true,
      usage: [
        "<add/del> (#channel/id) or channel <show/reset>",
        "<add/del> (#canal/id) o channel <show/reset>",
      ],
      //role: "dev", //dev, tester, premium, voter
      category: "administracion",
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let musica = false;
      if (!args[0]) return;
      for (let index in args) {
        if (args[index] == "--music" || args[index] == "--musica") {
          musica = true;
        }
      }
      if (args[0].toLowerCase() === "add" && args[1]) {
        if (musica) {
          let CHANNEL_ID = args[1].replace("<#", "").replace(">", "");
          if (!message.guild.channels.cache.get(CHANNEL_ID)) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ADDLISTENINGCHANNEL[4])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }
          if (message.guild.channels.cache.get(CHANNEL_ID).type != "GUILD_VOICE") {
            const embed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(client.language.ADDLISTENINGCHANNEL[5])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          }
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (s) {
                if (!s.config.MUSIC_CHANNELS.includes(CHANNEL_ID)) {
                  s.config.MUSIC_CHANNELS.push(CHANNEL_ID);
                  message.guild.config.MUSIC_CHANNELS.push(CHANNEL_ID);
                  s.save().catch((err) => s.update());
                  const embed = new Discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .setDescription(
                      client.language.ADDLISTENINGCHANNEL[6] + CHANNEL_ID + ">"
                    )
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return message.channel.send({embeds: [embed]});
                } else {
                  const errorembed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.ADDLISTENINGCHANNEL[7])
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return message.channel.send({embeds: [errorembed]});
                }
              }
            });
        } else {
          let CHANNEL_ID = args[1].replace("<#", "").replace(">", "");
          if (!message.guild.channels.cache.get(CHANNEL_ID)) {
            if (!message.guild.channels.cache.get(CHANNEL_ID)) {
              const errorembed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle(client.language.ERROREMBED)
                .setDescription(client.language.ADDLISTENINGCHANNEL[4])
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({embeds: [errorembed]});
            }
          }
          if (message.guild.channels.cache.get(CHANNEL_ID).type != "GUILD_TEXT") {
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ADDLISTENINGCHANNEL[3])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          }
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (s) {
                if (!s.config.CHANNELID.includes(CHANNEL_ID)) {
                  s.config.CHANNELID.push(CHANNEL_ID);
                  message.guild.config.CHANNELID.push(CHANNEL_ID);
                  s.save().catch((err) => s.update());
                  const embed = new Discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .setDescription(
                      client.language.ADDLISTENINGCHANNEL[1] + CHANNEL_ID + ">"
                    )
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return message.channel.send({embeds: [embed]});
                } else {
                  const errorembed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.ADDLISTENINGCHANNEL[2])
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return message.channel.send({embeds: [errorembed]});
                }
              }
            });
        }
      } else if (
        (args[0].toLowerCase() === "del" ||
          args[0].toLowerCase() === "delete") &&
        args[1]
      ) {
        if (musica) {
          let CHANNEL_ID = args[1].replace("<#", "").replace(">", "");
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (s) {
                s.config.MUSIC_CHANNELS.splice(
                  s.config.MUSIC_CHANNELS.indexOf(CHANNEL_ID),
                  s.config.MUSIC_CHANNELS.indexOf(CHANNEL_ID) + 1
                );
                message.guild.config.MUSIC_CHANNELS.splice(
                  message.guild.config.MUSIC_CHANNELS.indexOf(CHANNEL_ID),
                  message.guild.config.MUSIC_CHANNELS.indexOf(CHANNEL_ID) + 1
                );
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setTitle(client.language.SUCCESSEMBED)
                  .setDescription(
                    client.language.DELLISTENINGCHANNEL[3] + CHANNEL_ID + ">"
                  )
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [embed]});
              }
            });
        } else {
          let CHANNEL_ID = args[1].replace("<#", "").replace(">", "");
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (s) {
                s.config.CHANNELID.splice(
                  s.config.CHANNELID.indexOf(CHANNEL_ID),
                  s.config.CHANNELID.indexOf(CHANNEL_ID) + 1
                );
                message.guild.config.CHANNELID.splice(
                  message.guild.config.CHANNELID.indexOf(CHANNEL_ID),
                  message.guild.config.CHANNELID.indexOf(CHANNEL_ID) + 1
                );
                s.save().catch((err) => s.update());
                const embed = new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setTitle(client.language.SUCCESSEMBED)
                  .setDescription(
                    client.language.DELLISTENINGCHANNEL[1] + CHANNEL_ID + ">"
                  )
                  .setFooter(
                    message.author.username,
                    message.author.avatarURL()
                  );
                return message.channel.send({embeds: [embed]});
              }
            });
        }
      } else if (args[0].toLowerCase() === "show") {
        if (musica) {
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (s) {
                if (!s.config.MUSIC_CHANNELS[0]) {
                  const errorembed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.SHOWLISTENINGCHANNEL[8])
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return message.channel.send({embeds: [errorembed]});
                } else {
                  const embedadmins = new Discord.MessageEmbed()
                    .setTitle(client.language.SHOWLISTENINGCHANNEL[2])
                    .setColor(process.env.EMBED_COLOR)
                    .setTimestamp(" ");
                  for (
                    var index = 0;
                    index < s.config.MUSIC_CHANNELS.length;
                    index++
                  ) {
                    let ChannelsList = s.config.MUSIC_CHANNELS[index];
                    embedadmins.addField("\u200B", "- <#" + ChannelsList + ">");
                  }

                  message.channel.send({
                    embed: embedadmins,
                  });
                }
              }
              return;
            });
        } else {
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (s) {
                if (!s.config.CHANNELID[0]) {
                  const errorembed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.SHOWLISTENINGCHANNEL[1])
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return message.channel.send({embeds: [errorembed]});
                } else {
                  const embedadmins = new Discord.MessageEmbed()
                    .setTitle(client.language.SHOWLISTENINGCHANNEL[2])
                    .setColor(process.env.EMBED_COLOR)
                    .setTimestamp(" ");
                  for (
                    var index = 0;
                    index < s.config.CHANNELID.length;
                    index++
                  ) {
                    let ChannelsList = s.config.CHANNELID[index];
                    embedadmins.addField("\u200B", "- <#" + ChannelsList + ">");
                  }

                  message.channel.send({
                    embed: embedadmins,
                  });
                }
              }
              return;
            });
        }
      } else if (args[0].toLowerCase() === "reset") {
        if (musica) {
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (err) console.error(err);
              if (s) {
                for (let index in s.config.MUSIC_CHANNELS) {
                  s.config.MUSIC_CHANNELS.splice(index);
                }
              }
              s.save().catch((err) => s.update());
              message.guild.config.MUSIC_CHANNELS = [];
              const embed = new Discord.MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.SUCCESSEMBED)
                .setDescription(client.language.SHOWLISTENINGCHANNEL[5])
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({embeds: [embed]});
            });
        } else {
          guildSchema
            .findOne({
              guildID: message.guild.id,
            })
            .then((s, err) => {
              if (err) console.error(err);
              if (s) {
                for (let index in s.config.CHANNELID) {
                  s.config.CHANNELID.splice(index);
                }
              }
              s.save().catch((err) => s.update());
              message.guild.config.CHANNELID = [];
              const embed = new Discord.MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.SUCCESSEMBED)
                .setDescription(client.language.SHOWLISTENINGCHANNEL[5])
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({embeds: [embed]});
            });
        }
      } else {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            `${client.language.SHOWLISTENINGCHANNEL[6]} ${prefix}${client.language.SHOWLISTENINGCHANNEL[7]}`
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
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
