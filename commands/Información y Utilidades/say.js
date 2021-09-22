const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Say extends Command {
  constructor(client) {
    super(client, {
      name: "say",
      description: [
        "Says the message you type!",
        "¡Dice el mensaje que escribiste!",
      ],
      cooldown: 5,
      usage: ["<message>", "<mensaje>"],
      args: true,
      botpermissions: ["MANAGE_MESSAGES"],
      permissions: ["ADMINISTRATOR"],
      category: "Info",
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
      if (args[0].toLowerCase() === "colors") {
        const embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setTitle(client.language.SUCCESSEMBED)
          .setImage("https://i.postimg.cc/gj8NSLsy/embed-colors.png")
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [embed]});
      }
      let color = process.env.EMBED_COLOR;
      let colors = [
        "DEFAULT",
        "AQUA",
        "DARK_AQUA",
        "GREEN",
        "DARK_GREEN",
        "BLUE",
        "DARK_BLUE",
        "PURPLE",
        "DARK_PURPLE",
        "LUMINOUS_VIVID_PINK",
        "DARK_VIVID_PINK",
        "GOLD",
        "DARK_GOLD",
        "ORANGE",
        "DARK_ORANGE",
        "RED",
        "DARK_RED",
        "GREY",
        "DARK_GREY",
        "DARKER_GREY",
        "LIGHT_GREY",
        "NAVY",
        "DARK_NAVY",
        "YELLOW",
      ];
      for (let index in colors) {
        if (color != process.env.EMBED_COLOR) break;
        if (args[0].toUpperCase() == colors[index]) {
          color = colors[index];
        }
      }
      if (color != process.env.EMBED_COLOR) {
        args.shift();
        return message.channel.send({ embeds: [
          new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(args.join(" "))
            .setTimestamp(" ")
        ]});
      } else {
        return message.channel.send({ embeds: [
          new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(args.join(" "))
            .setTimestamp(" ")
        ]});
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
