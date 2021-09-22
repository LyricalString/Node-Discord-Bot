const Command = require("../../structures/Commandos.js");
const {
  inspect
} = require("util");
const Discord = require("discord.js");
const partnerSchema = require("../../models/partners.js");
const userSchema = require("../../models/user.js");
const guildSchema = require("../../models/guild.js");

module.exports = class set extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: [
        "Sets a user role inside the bot",
        "Cambia el role del usuario dentro del bot.",
      ],
      usage: [
        "tester <add/del> <user/id>",
        "partner <add/del> <guildID> <invite link>",
      ],
      category: "administracion",
      subcommands: ["partner", "tester"],
      cooldown: 5,
      role: "dev", //dev, tester, premium, voter
      args: true
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (args[0].toLowerCase() == "partner") {
        if (args[1].toLowerCase() == "add") {
          partnerSchema
            .findOne({
              guildID: args[2]
            })
            .then(async (data, err) => {
              if (err) return message.channel.send("err " + err);
              if (data)
                return message.channel.send(
                  "Ya está en la db partner esa guild"
                );
              if (!data) {
                await ipc.fetchGuild(args[2])
                  .then((data2) => {
                    if (!data2)
                      return message.channel.send(
                        "Este servidor no se encuentra dentro de Node."
                      );
                    if (data2) {
                      const partner2 = new partnerSchema({
                        guildID: data2.id,
                        ICON: data2.icon,
                        OWNER_ID: data2.ownerID,
                        INVITE: args[3],
                        PARTNER: true,
                        JOINED: Date.now(),
                      });
                      data2.partner = true;
                      partner2.save().catch((err) => console.error(err));
                      guildSchema.findOne({
                        guildID: data2.id
                      }).then(data3 => {
                        if (data3) {
                          data3.Partner = true
                          data3.save().catch(err => console.error(err))
                        }
                      })
                      message.channel.send(
                        "Añadido a la base y datos y el cache correctamente. Felicidades, este servidor forma parte del programa partner."
                      );
                    }
                  });
              }
            });
        } else if (args[1].toLowerCase() == "del") {
          partnerSchema
            .findOneAndRemove({
              guildID: args[2]
            })
            .then(async (data, err) => {
              if (err) return message.channel.send("err " + err);
              if (!data)
                return message.channel.send(
                  "Esta guild no se encuentra en los servdiores partners"
                );
              if (data) {
                await ipc.fetchGuild(args[2])
                  .then((data2) => {
                    if (!data2)
                      return message.channel.send(
                        "Este servidor no se encuentra dentro de Node."
                      );
                    if (data2) {
                      message.channel.send(
                        "Removido correctamente de la base de datos."
                      );
                    }
                  });
              }
            });
        }
      } else if (args[0].toLowerCase() == "tester") {
        if (args[1].toLowerCase() == "add") {
          userSchema.findOne({
            USERID: args[2]
          }).then(async (data, err) => {
            if (err) return message.channel.send("err " + err);
            if (!data)
              return message.channel.send(
                "El usuario no está registrado en la base de datos"
              );
            if (data) {
              await ipc.fetchUser(args[2])
                .then((data2) => {
                  if (!data2)
                    return message.channel.send(
                      "No encontramos al usuario en la cache."
                    );
                  if (data2) {
                    data.TESTER = true;
                    data2.TESTER = true;
                    data.save().catch((err) => console.error(err));
                    message.channel.send(
                      "Añadido a la base y datos y el cache correctamente."
                    );
                  }
                });
            }
          });
        } else if (args[1].toLowerCase() == "del") {
          userSchema.findOne({
            USERID: args[2]
          }).then(async (data, err) => {
            if (err) return message.channel.send("err " + err);
            if (!data)
              return message.channel.send(
                "El usuario no está registrado en la base de datos"
              );
            if (data) {
              await ipc.fetchUser(args[2])
                .then((data2) => {
                  if (!data2)
                    return message.channel.send(
                      "No encontramos al usuario en la cache."
                    );
                  if (data2) {
                    data.TESTER = false;
                    data2.TESTER = false;
                    data.save().catch((err) => console.error(err));
                    message.channel.send(
                      "Removido de la base y datos y el cache correctamente."
                    );
                  }
                });
            }
          });
        }
      }
    } catch (e) {
      console.error(e);
      message.channel.send(
        new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(client.language.ERROREMBED)
        .setDescription(client.language.fatal_error)
        .setFooter(message.author.username, message.author.avatarURL())
      );
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