require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const util = require("../../utils/utils");
const { getPreview } = require("spotify-url-info");

module.exports = class Play extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      description: ["Play any song on your voice channel.", "Reproduce cualquier canción en tu canal de voz."],
      usage: ["<song>", "<canción>"],
      botpermissions: ["CONNECT", "SPEAK"],
      alias: ["pl", "p"],
      args: true,
      category: "musica",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    if (process.env.mode != 'development') {
      const errorembed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(client.language.ERROREMBED)
        .setDescription(
          client.language.music_error
        )
        .setFooter(message.author.username, message.author.avatarURL());
      return message.channel.send({ embeds: [errorembed] });
    }
    try {
      let sc
      if (message.attachments.size == 0) {
				sc = args.join(" ");
			} else {
        return Array.from(message.attachments, ([key, value]) => {
          sc = value.proxyURL
        })
      }
      const { channel } = message.member.voice;
      if (!channel) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.PLAY[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] });
      }

      if (
        message.guild.config.MUSIC_CHANNELS[0] &&
        !message.guild.config.MUSIC_CHANNELS.includes(channel.id)
      ) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.RADIO[13])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] });
      }

      const player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });

      if (player.state !== "CONNECTED") {
        player.connect();
        player.setVolume(35)
      } 
      const playerCanal = client.channels.cache.get(player.voiceChannel);
      if (!playerCanal) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.PLAY[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] });
      }
      if (playerCanal.id != channel.id && playerCanal.members.size == 1) {
        let member = await message.guild.members.fetch(process.env.botID).catch(e => {
          return
        });
        member.voice.setChannel(channel.id);
      } else if (playerCanal.id != channel.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.PLAY[2])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] });
      }
      if (sc.startsWith("https://open.spotify.com/")) {
        let res;
        try {
          res = await client.manager.search(sc || sc.url, message.author);
          switch (res.loadType) {
            case "TRACK_LOADED":
              {
                player.queue.add(res.tracks[0]);
                const embed = await new Discord.MessageEmbed()
                  .setColor(process.env.EMBED_COLOR)
                  .setDescription(
                    `**${client.language.PLAY[3]}\n[${res.tracks[0].title}](${res.tracks[0].uri})**`
                  )
                  .setThumbnail(
                    `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`
                  )
                  .addField(client.language.PLAY[4], res.tracks[0].author, true)
                  .addField(
                    client.language.PLAY[5],
                    res.tracks[0].requester.tag,
                    true
                  )
                  .addField(
                    client.language.PLAY[6],
                    util.formatTime(res.tracks[0].duration),
                    true
                  );
                message.channel.send({ embeds: [embed] });
                if (!player.playing && !player.paused && !player.queue.size)
                  player.play();
              }
              break;
            case "PLAYLIST_LOADED": {
              const playlistInfo = await getPreview(sc);
              const duration = util.formatTime(
                res.tracks.reduce((acc, cur) => ({
                  duration: acc.duration + cur.duration,
                })).duration
              );
              const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor(process.env.EMBED_COLOR)
                .addField(client.language.PLAY[7], `${res.playlist.name}`, true)
                .addField(
                  client.language.PLAY[8],
                  `\`${res.tracks.length}\``,
                  true
                )
                .addField(
                  client.language.PLAY[5],
                  `${res.tracks[0].requester}`,
                  true
                )
                .addField(client.language.PLAY[6], `${duration}`, true)
                .setThumbnail(`${playlistInfo.image}`);
              message.channel.send({ embeds: [embed] });
              player.queue.add(res.tracks);
              if (
                !player.playing &&
                !player.paused &&
                player.queue.totalSize === res.tracks.length
              )
                player.play();
            }
          }
        } catch (e) {
          return webhookClient.send(
            `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\n\nError: ${e}\n\n**------------------------------------**`
          );
        }
      } else {
        let res;
        try {
          res = await client.manager.search(sc, message.author);
          if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.PLAY[9])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }
        } catch (e) {
          return webhookClient.send(
            `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\n\nError: ${e}\n\n**------------------------------------**`
          );
        }
        switch (res.loadType) {
          case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                client.language.PLAY[10]
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] })
          case "SEARCH_RESULT": {
            const embed = await new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setDescription(
                `**${client.language.PLAY[3]}\n[${res.tracks[0].title}](${res.tracks[0].uri})**`
              )


              .setThumbnail(
                `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`
              )
              .addField(client.language.PLAY[4], res.tracks[0].author, true)
              .addField(
                client.language.PLAY[5],
                res.tracks[0].requester.tag,
                true
              )
              .addField(
                client.language.PLAY[6],
                util.formatTime(res.tracks[0].duration),
                true
              );
            message.channel.send({ embeds: [embed] });
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.queue.size && !player.paused)
              player.play();
            break;
          }
          case "PLAYLIST_LOADED": {
            player.queue.add(res.tracks);
            const duration = util.formatTime(
              res.tracks.reduce((acc, cur) => ({
                duration: acc.duration + cur.duration,
              })).duration
            );
            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === res.tracks.length
            )
              player.play();
            const e = new Discord.MessageEmbed()
              .setTitle(client.language.PLAY[11])
              .setColor(process.env.EMBED_COLOR)
              .addField(client.language.PLAY[12], `${res.playlist.name}`, true)
              .addField(
                client.language.PLAY[13],
                `\`${res.tracks.length}\``,
                true
              )
              .addField(
                client.language.PLAY[5],
                `${res.tracks[0].requester}`,
                true
              )
              .addField(client.language.PLAY[6], `${duration}`, true)
              .setImage(
                `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`
              );
            return message.channel.send({ embeds: [e]});
          }
          case "TRACK_LOADED": {
            player.queue.add(res.tracks[0]);
            const embed = await new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setDescription(
                `**${client.language.PLAY[3]}\n[${res.tracks[0].title}](${res.tracks[0].uri})**`
              )
              .setThumbnail(
                `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`
              )
              .addField(client.language.PLAY[4], res.tracks[0].author, true)
              .addField(
                client.language.PLAY[5],
                res.tracks[0].requester.tag,
                true
              )
              .addField(
                client.language.PLAY[6],
                util.formatTime(res.tracks[0].duration),
                true
              );
            message.channel.send({ embeds: [embed] });
            if (!player.playing && !player.paused && !player.queue.size)
              player.play();
          }
        }
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
      } catch (e) { }
    }
  }
};
