require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const RadioBrowser = require("radio-browser");
const { MessageEmbed } = require("discord.js");
const isUrl = require("../../utils/isUrl.js");
module.exports = class Radio extends Command {
  constructor(client) {
    super(client, {
      name: "radio",
      description: [
        "Listen to any radio station in the world.",
        "Escucha cualquier estacion de radio del mundo.",
      ],
      category: "musica",
      botpermissions: ["CONNECT", "SPEAK"],
      usage: ["<station>", "<estacion>"],
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      // const errorembed = new Discord.MessageEmbed()
      //     .setColor("RED")
      //     .setTitle(client.language.ERROREMBED)
      //     .setDescription('La API se encuentra en mantenimiento. Volverán cuando vuelva la API.')
      //     .setFooter(message.author.username, message.author.avatarURL());
      //   return message.channel.send({ embeds: [errorembed] });
      const { channel } = message.member.voice;
      if (!channel) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.RADIO[1])
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
      const query = args.join(" ");
      if (!args[0]) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.RADIO[3])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] });
      }
      let volume = 100;

      let filter = {
        limit: 1,
        by: "name",
        searchterm: query,
      };
      let str = "";
      let name = "";
      let favicon = "";
      let homepage = "";
      let codec = "";
      let bitrate = "";

      const {
        RadioBrowserApi,
        StationSearchType,
      } = require("radio-browser-api");
      const api = new RadioBrowserApi("NodeBot");

      let argumentos = [];
      await api
        .getStationsBy(StationSearchType.byName, args.join(" "), 1)
        .then((radio) => {
          if (!radio[0]) return;
          str = radio[0].urlResolved;
          name = radio[0].name;
          favicon = radio[0].favicon;
          homepage = radio[0].homepage;
          codec = radio[0].codec;
          bitrate = radio[0].bitrate;
        })
        .catch((e) => {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.RADIO[11])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({ embeds: [errorembed] });
        });
      await client.manager.search(str, message.author).then(async (res) => {
        switch (res.loadType) {
          case "TRACK_LOADED":
            player.queue.add(res.tracks[0]);
            const embed = new MessageEmbed()
              .setTitle(client.language.RADIO[12])
              .setColor(process.env.EMBED_COLOR)
              .addField(client.language.RADIO[6], `${name}`)
              .addField(client.language.RADIO[9], `${codec}`, true)
              .addField(client.language.RADIO[10], `${bitrate}`, true);
            if (favicon && isUrl(favicon)) embed.setThumbnail(favicon);
            message.channel.send({ embeds: [embed] });
            if (homepage) embed.addField(
              client.language.RADIO[7],
              `${client.language.RADIO[8]}(${homepage})`,
              true
            )
            if (!player.playing) {
              player.play();
              player.setVolume(volume || 50);
              player.setTrackRepeat(false);
              player.setQueueRepeat(false);
            }
            break;

          case "LOAD_FAILED":
            message.channel.send(client.language.RADIO[11]);
            break;
        }
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
      } catch (e) { }
    }
  }
};
