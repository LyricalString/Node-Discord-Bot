const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const GuildSchema = require("../../models/guild.js");
module.exports = class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: "prefix",
      description: [
        "Sets a new prefix for Node.",
        "Establece un nuevo prefijo para Node.",
      ],
      usage: ["set <new prefix> or reset", "set <nuevo prefijo> or reset"],
      permissions: ["ADMINISTRATOR"],
      subcommands: ["set", "reset"],
      args: true,
      category: "administracion",
    });
  }
  async run(client, message, args, prefix2, lang, webhookClient) {
    try {
      let prefix;
      if (args[0]) {
        if (args[0].toLowerCase() == "set") {
          if (args[1]) {
            prefix = args[1].toLowerCase();
            if (prefix == "") {
              const errorembed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle(client.language.ERROREMBED)
                .setDescription(
                  `${client.language.PREFIX[2]} \`${process.env.prefix}prefix set <${client.language.PREFIX[3]}>\``
                )
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({embeds: [errorembed]});
            }
            GuildSchema.findOne({
              guildID: message.guild.id,
            }).then((data) => {
              prefix = data.PREFIX;
              data.PREFIX = args[1].toLowerCase();
              data.save().catch((err) => console.error(err));
            });
            message.guild.prefix = args[1].toLowerCase();
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(client.language.SUCCESSEMBED)
              .setDescription(`${client.language.PREFIX[1]} \`${prefix}\``)
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [embed]});
          } else {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                `${client.language.PREFIX[2]} \`${process.env.prefix}prefix set <${client.language.PREFIX[3]}>\``
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }
        }
        if (args[0] == "reset") {
          GuildSchema.findOne({
            guildID: message.guild.id,
          }).then((data) => {
            data.PREFIX = ".";
            data.save().catch((err) => console.error(err));
          });
          message.guild.prefix = ".";
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.SUCCESSEMBED)
            .setDescription(
              `Se ha reseteado el prefix, ahora vuelve a ser \`.\``
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [embed]});
        } else {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.PREFIX[4])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
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
      } catch (e) {}
    }
  }
};
