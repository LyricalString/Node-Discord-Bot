const { MessageEmbed } = require("discord.js");
require("dotenv").config();
const Discord = require("discord.js");
const CommandsModel = require("../../models/command.js");
const Command = require("../../structures/Commandos.js");

module.exports = class VotesLeader extends Command {
  constructor(client) {
    super(client, {
      name: "ranking",
      description: [
        "Shows the top commands by uses of Node",
        "Muestra los comandos destacados por usos de Node",
      ],
      subcommands: ["commands", "cmd"],
      usage: ["<commands/cmd>", "<commands/cmd>"],
      category: "Info",
      alias: ["rk"],
      production: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (args[0].toLowerCase() == "commands" || args[0].toLowerCase() == "cmd") {
        CommandsModel.find()
          .sort({ uses: -1 })
          .limit(10)
          .then(async (s, err) => {
            let msg = await message.channel.send(
              `${client.language.RANKING[1]} <a:pepeRiendose:835905480160444466>`
            );
            const embed = new MessageEmbed()
              .setTitle(client.language.RANKING[2])
              .setColor(process.env.EMBED_COLOR);
            for (let index in s) {
              embed.addField(
                "\u200b",
                `<:lightbluedot:864163603844956170> ${s[index].name} [${s[index].uses}]`
              );
            }
            CommandsModel.aggregate([
              {
                $group: {
                  _id: null,
                  count: { $sum: "$uses" }, // for no. of documents count
                },
              },
            ]).then(async (s, err) => {
              console.debug(s[0].count);
              embed.setFooter("Comandos ejecutados en total: " + s[0].count);
              msg.edit({content: " ", embeds: [embed]});
            });
          });
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
