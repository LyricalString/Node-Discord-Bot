require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class VoiceKick extends Command {
  constructor(client) {
    super(client, {
      name: "voicekick",
      description: [
        "Kicks a user from a voice chat.",
        "Expulsa a un usuario de un chat de voz.",
      ],
      usage: ["<@user> <#channel>", "<@usuario> <#canal>"],
      alias: ["vckick"],
      permissions: ["KICK_MEMBERS"],
      BOTpermissions: ["KICK_MEMBERS"],
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
        await message.guild.members.fetch(args[0]).catch(e => {
          return
        })

      if (!member) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.VOICEKICK[1])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      let channel = message.guild.channels.cache.get(member.voice.channelId);

      if (!channel) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.VOICEKICK[2])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }

      member.voice.disconnect();

      const embed = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setTitle(client.language.SUCCESSEMBED)
        .setDescription(`${client.language.VOICEKICK[3]} <#${channel.id}>!`)
        .setFooter(message.author.username, message.author.avatarURL());
      return message.channel.send({embeds: [embed]});
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
