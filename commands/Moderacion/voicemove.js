require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class VoiceMove extends Command {
  constructor(client) {
    super(client, {
      name: "voicemove",
      description: [
        "Moves a user to another voice channel.",
        "Mueve a un usuario a otro canal de voz.",
      ],
      usage: ["<@user> <#channel>", "<@usuario> <#canal>"],
      alias: ["vcmove"],
      permissions: ["MOVE_MEMBERS"],
      botpermissions: ["MOVE_MEMBERS"],
      args: true,
      moderation: true,
      category: "Moderacion",
      nochannel: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
        message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``})
      } else {
        if (!message.deleted) message.delete().catch((e) => console.log(e));
      }
      let member =
        message.mentions.members.first() ||
        await message.guild.members.cache.get(args[0])

      if (!member) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.VOICEMOVE[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      let guild = message.guild
      let channel =
        message.mentions.channels.first() || guild.channels.cache.get(args[1]); // || guild.channels.cache.find(c => c.name.toLowerCase() == args[1].toLowerCase() && c.type == "voice");
      if (!channel) {
        channel = guild.channels.cache.get(message.member.voice.channelId);
        if (!channel) return
      } else if (channel.type != "GUILD_VOICE") {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.VOICEMOVE[2])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      try {
        if (!member.voice || !member.voice.channelId) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(
              "El usuario no está conectado en ningún canal de voz."
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (member.voice.channelId == channel.id) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.VOICEMOVE[3])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        member.voice.setChannel(channel);
        let embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setTimestamp(" ")
          .setDescription(client.language.VOICEMOVE[4]);
        message.channel.send({embeds: [embed]});
      } catch (error) {
        console.error(error);
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
