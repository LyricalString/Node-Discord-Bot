const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const userModel = require("../../models/user.js");
const { DiscordMenus, ButtonBuilder, MenuBuilder } = require("discord-menus");
let encendido = false;

module.exports = class Lang extends Command {
  constructor(client) {
    super(client, {
      name: "lang",
      description: [
        "Select your language using this menu.",
        "Seleccione su idioma usando este menú.",
      ],
      alias: ["language", "idioma", "lenguaje"],
      cooldown: 5,
      category: "info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      const MenusManager = new DiscordMenus(client);
      const myCoolMenu = new MenuBuilder()
        .addLabel("Español", {
          description: "Selecciona el español como el idioma predefinido.",
          value: "es",
          emoji: {
            name: "🇪🇸",
          },
        })
        .addLabel("English", {
          description: "Selects english as the main language.",
          value: "en",
          emoji: {
            name: "🇺🇸",
          },
        })
        .setMaxValues(1)
        .setCustomID("menu1")
        .setPlaceHolder(client.language.LANGMENU[1]);

      const embed = new Discord.MessageEmbed()
        .setFooter(
          "Selecciona un lenguaje de la lista.",
          message.author.displayAvatarURL()
        )
        .setColor(process.env.EMBED_COLOR);

      await MenusManager.sendMenu(message, embed, { menu: myCoolMenu });

      MenusManager.once("MENU_CLICKED", (menu) => {
        let user = message.member.user;
        if (menu.member.id != message.author.id) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.LANGMENU[3])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (menu.values.length > 1) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.LANGMENU[2])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (menu.values[0].toLowerCase() == "es") {
          try {
            userModel
              .findOne({
                USERID: message.author.id.toString(),
              })
              .then((s, err) => {
                if (err) return console.error(err);
                message.member.user.LANG = "es_ES";
                if (s) {
                  s.LANG = "es_ES";
                  s.save().catch((err) => s.update());
                  const embed = new Discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .setDescription(
                      "Has seleccionado español como tu nuevo idioma."
                    )
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return menu.edit(embed);
                } else {
                  const user2 = new userModel({
                    USERID: user.id,
                    COMMANDS_EXECUTED: parseInt(user.COMMANDS_EXECUTED),
                    VOTED: user.VOTED,
                    BANNED: user.BANNED,
                    LANG: "es_ES",
                    DEV: user.DEV,
                    PREMIUM_COMMANDS: user.PREMIUM_COMMANDS,
                    isINDB: user.isINDB,
                    Roles: user.ROLES,
                    OLDMODE: user.OLDMODE,
                  });
                  user2.save().catch((err) => console.error(err));
                  const embed = new Discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .setDescription(
                      "Has seleccionado español como tu nuevo idioma."
                    )
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return menu.edit(embed);
                }
              });
            return;
          } catch (error) {
            console.error(error);
          }
        } else if (menu.values[0].toLowerCase() == "en") {
          try {
            userModel
              .findOne({
                USERID: message.author.id.toString(),
              })
              .then((s, err) => {
                if (err) return console.error(err);
                message.member.user.LANG = "en_US";
                if (s) {
                  s.LANG = "en_US";
                  s.save().catch((err) => s.update());
                  const embed = new Discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .setDescription(
                      "You've selected English as your new language"
                    )
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return menu.edit(embed);
                } else {
                  const user2 = new userModel({
                    USERID: user.id,
                    COMMANDS_EXECUTED: parseInt(user.COMMANDS_EXECUTED),
                    VOTED: user.VOTED,
                    BANNED: user.BANNED,
                    LANG: "en_US",
                    DEV: user.DEV,
                    PREMIUM_COMMANDS: user.PREMIUM_COMMANDS,
                    isINDB: user.isINDB,
                    Roles: user.ROLES,
                    OLDMODE: user.OLDMODE,
                  });
                  user2.save().catch((err) => console.error(err));
                  const embed = new Discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .setDescription(
                      "You've selected English as your new language"
                    )
                    .setFooter(
                      message.author.username,
                      message.author.avatarURL()
                    );
                  return menu.edit(embed);
                }
              });
            return;
          } catch (error) {
            console.error(error);
          }
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
      } catch (e) {}
    }
  }
};
