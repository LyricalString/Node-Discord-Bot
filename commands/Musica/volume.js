require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Volume extends Command {
  constructor(client) {
    super(client, {
      name: "volume",
      alias: ["vol", "volumen"],
      description: ["Modifies the volume.", "Sube o baja el volumen."],
      usage: ["<number between 0 and 100>", "<numero entre 0 y 100>"],
      botpermissions: ["ADD_REACTIONS"],
      category: "musica",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      const player = client.manager.players.get(message.guild.id);
      const { channel } = message.member.voice;
      let volemoji = "▬";
      let volamt;
      if (!player) {
        const Embed = new Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(
            client.language.VOLUME[1],
            "https://cdn.discordapp.com/emojis/717184163660300309.gif?v=1"
          )
          .setDescription(client.language.VOLUME[2]);
        return message.channel.send({ embeds: [Embed] });
      }
      if (player.voiceChannel) {
        if (
          !message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR') &&
          player.voiceChannel != message.member.voice.channelId
        )
          return;
      }
      if (isNaN(args[0])) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.VOLUME[9])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      if (args[0] < 0 || args[0] > 100) {
        const Embed = new Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(
            client.language.VOLUME[1],
            "https://cdn.discordapp.com/emojis/717184163660300309.gif?v=1"
          )
          .setTitle(client.language.VOLUME[4]);
        return message.channel.send({ embeds: [Embed] });
      }
      let vol = Number(player.volume);
      if (vol == 0) {
        volamt = "🔇";
      } else if (vol > 0 && vol <= 10) {
        volamt = `${volemoji}`;
      } else if (vol > 10 && vol <= 20) {
        volamt = `${volemoji}` + `${volemoji}`;
      } else if (vol > 20 && vol <= 30) {
        volamt = `${volemoji}` + `${volemoji}` + `${volemoji}`;
      } else if (vol > 30 && vol <= 40) {
        volamt = `${volemoji}` + `${volemoji}` + `${volemoji}` + `${volemoji}`;
      } else if (vol > 40 && vol <= 50) {
        volamt =
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}`;
      } else if (vol > 50 && vol <= 60) {
        volamt =
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}`;
      } else if (vol > 60 && vol <= 70) {
        volamt =
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}`;
      } else if (vol > 70 && vol <= 80) {
        volamt =
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}`;
      } else if (vol > 80 && vol <= 100) {
        volamt =
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}` +
          `${volemoji}`;
      }

      if (!args[0]) {
        const Embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setAuthor(client.language.VOLUME[5], client.user.displayAvatarURL())
          .setTitle(client.language.VOLUME[6])
          .setDescription(`** 🔊${volamt} ${player.volume} %**`);
        message.channel.send({ embeds: [Embed] });
      } else if (player.volume == Number(args[0])) {
        const Embed = new Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(
            client.language.VOLUME[5],
            "https://cdn.discordapp.com/emojis/717184163660300309.gif?v=1"
          )
          .setTitle(`**ERROR**`)
          .setDescription(
            `**${client.language.VOLUME[7]} __${Number(args[0])}__ %**`
          );
        message.channel.send({ embeds: [Embed] });
      } else {
        player.setVolume(Number(args[0]));
        let vol = Number(player.volume);
        if (vol == 0) {
          volamt = "🔇";
        } else if (vol > 0 && vol <= 10) {
          volamt = `${volemoji}`;
        } else if (vol > 10 && vol <= 20) {
          volamt = `${volemoji}` + `${volemoji}`;
        } else if (vol > 20 && vol <= 30) {
          volamt = `${volemoji}` + `${volemoji}` + `${volemoji}`;
        } else if (vol > 30 && vol <= 40) {
          volamt =
            `${volemoji}` + `${volemoji}` + `${volemoji}` + `${volemoji}`;
        } else if (vol > 40 && vol <= 50) {
          volamt =
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}`;
        } else if (vol > 50 && vol <= 60) {
          volamt =
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}`;
        } else if (vol > 60 && vol <= 70) {
          volamt =
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}`;
        } else if (vol > 70 && vol <= 80) {
          volamt =
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}`;
        } else if (vol > 80 && vol <= 100) {
          volamt =
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}` +
            `${volemoji}`;
        }

        const Embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setAuthor(client.language.VOLUME[8], client.user.displayAvatarURL())
          .setTitle(`** 🔊${volamt} ${player.volume} %**`);
        message.channel.send({ embeds: [Embed] });
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
