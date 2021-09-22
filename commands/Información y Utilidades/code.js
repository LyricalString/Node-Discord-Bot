const axios = require("axios");
require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const codeModel = require("../../models/code.js");
const guildModel = require("../../models/guild.js");

module.exports = class Code extends Command {
  constructor(client) {
    super(client, {
      name: "code",
      description: [
        "Main command for referal code commands.",
        "Comando principal para el comando de código de referidos.",
      ],
      subcommands: ["generate", "redeem", 'stats'],
      args: true,
      usage: ["<generate> or <redeem/statsw> <code>", "<generate> o <redeem/ststs> <código>"],
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (args[0].toLowerCase() == "generate") {
        codeModel
          .findOne({
            USERID: message.author.id.toString(),
          })
          .then((s, err) => {
            if (err) return;
            if (s) {
              const embed = new Discord.MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setFooter(message.author.username, message.author.avatarURL())
                .setDescription(client.language.CODE[1] + "`" + s.CODE + "`");
              return message.channel.send({ embeds: [embed] });
            } else {
              let code = makeid(8);
              const usercode = new codeModel({
                USERID: message.author.id.toString(),
                CODE: code,
                SERVERS: "0",
                USERS: "0",
              });
              usercode.save().catch((e) => console.error(e));
              const embed = new Discord.MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.SUCCESSEMBED)
                .setDescription(`${client.language.CODE[2]} \`${code}\`!`)
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({ embeds: [embed] });
            }
          });
      } else if (args[0].toLowerCase() == "redeem") {
        let old
        await guildModel.findOne({ guildID: message.guild.id.toString() }).then((s, err) => {
          if (err) return
          if (s.Creado < 1629381609000) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                client.language.CODE[9]
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }
          if (s.REFERED) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                'Este servidor ya ha sido referido.'
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }
          if (!message.channel.permissionsFor(message.author).has("ADMINISTRATOR")) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                client.language.CODE[3]
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }
          if (!args[1]) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                `${client.language.CODE[4]} \`${prefix}${client.language.CODE[5]}\`.`
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }

          if (args[1].length != 8) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                client.language.CODE[6]
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({ embeds: [errorembed] });
          }
          codeModel
            .findOne({ CODE: args[1] })
            .then(async (s2, err) => {
              if (!s2) {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(
                    'Ese código de referidos no existe.'
                  )
                  .setFooter(message.author.username, message.author.avatarURL());
                return message.channel.send({ embeds: [errorembed] });
              }
              let serverCount = parseInt(s2.SERVERS) + 1;
              let userCount = parseInt(s2.USERS) + message.guild.memberCount;
              s2.USERS = userCount.toString()
              s2.SERVERS = serverCount.toString()
              s2.save().catch(e => {
                console.log(e)
              })
              message.guild.refered = true;
              s.REFERED = true
              s.save().catch(e => { })
              const embed = new Discord.MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.SUCCESSEMBED)
                .setDescription(
                  client.language.CODE[8] + '\n\n' + `${client.language.CODE[10]} \`${s2.USERS} ${client.language.CODE[11]}\` ${client.language.CODE[12]} \`${s2.SERVERS} ${client.language.CODE[13]}\` ${client.language.CODE[14]}`
                )
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({ embeds: [embed] });
            })
        })
      } else if (args[0].toLowerCase() == 'stats') {
        codeModel
            .findOne({ CODE: args[1] })
            .then(async (s2, err) => {
              if (!s2) {
                const errorembed = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle(client.language.ERROREMBED)
                  .setDescription(
                    'Ese código de referidos no existe.'
                  )
                  .setFooter(message.author.username, message.author.avatarURL());
                return message.channel.send({ embeds: [errorembed] });
              }
              const embed = new Discord.MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setDescription(
                  `${client.language.CODE[10]} \`${s2.USERS} ${client.language.CODE[11]}\` ${client.language.CODE[12]} \`${s2.SERVERS} ${client.language.CODE[13]}\` ${client.language.CODE[14]}`
                )
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({ embeds: [embed] });
            })
      }else {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.CODE[6])
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] });
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

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  codeModel
    .findOne({
      CODE: result,
    })
    .then((s, err) => {
      if (err) return;
      if (s) return makeid(8);
    });
  return result;
}
