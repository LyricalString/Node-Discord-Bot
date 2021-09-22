require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
// const { MessageButton, MessageActionRow } = require("discord-buttons");
require("discord-reply");
let descripcion, usage;
const fs = require("fs");
let encendido = false;

module.exports = class Skin extends Command {
  constructor(client) {
    super(client, {
      name: "skin",
      description: [
        "Shows a menu with the skins.",
        "Muestra un menú con las skins.",
      ],
      usage: ["<@user>", "<@usuario>"],
      args: true,
      category: "Utils",
      inactive: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let cabeza = new MessageButton()
        .setStyle("blurple") //default: blurple
        .setLabel(" Cabeza") //default: NO_LABEL_PROVIDED
        .setEmoji("🟥")
        .setID("bu1");
      let cuerpo = new MessageButton()
        .setStyle("blurple") //default: blurple
        .setLabel(" Cuerpo") //default: NO_LABEL_PROVIDED
        .setEmoji("🟧")
        .setID("bu2");
      let avatar = new MessageButton()
        .setStyle("blurple") //default: blurple
        .setLabel(" Avatar") //default: NO_LABEL_PROVIDED
        .setEmoji("🟩")
        .setID("bu3");
      let jugador = new MessageButton()
        .setStyle("blurple") //default: blurple
        .setLabel(" Jugador") //default: NO_LABEL_PROVIDED
        .setEmoji("🟦")
        .setID("bu4");
      console.log("2");
      let ButtonArray = [cabeza, cuerpo, avatar, jugador];

      const embed = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setTitle(`${args[0]}`)
        .setDescription(
          `<a:828830816486293608:836296002893381682> Aquí encontraras las distintas opciones que puedes elegir sobre la skin del jugador que has seleccionado.`
        )
        .addField(
          "Categorias",
          "Las distintas opciones a elegir están divididas en categorías. Solo pulsa una y te mostrará lo relacionado de dicha categoría."
        )
        .setThumbnail(
          message.author.avatarURL({
            dynamic: true,
          })
        );
      console.log("3");

      //message.lineReply('¡Te he enviado un mensaje privado con mis comandos!')
      message.channel.send({
        embed: embed,
        buttons: ButtonArray,
      });
      console.log("4");
      if (encendido == false) {
        client.on("clickButton", async (button, err) => {
          if (err) return;
          console.log("5");
          if (button.id === "bu1") {
            const embed = new Discord.MessageEmbed()
              .setColor("#DD8811")
              .setImage(`https://mc-heads.net/head/${args[0]}`);
            await button.reply.send("", {
              embed: embed,
              ephemeral: true,
            });
            console.log("6");
            return;
          } else if (button.id === "bu2") {
            const embed = new Discord.MessageEmbed()
              .setColor("#DD8811")
              .setImage(`https://mc-heads.net/body/${args[0]}`);
            await button.reply.send("", {
              embed: embed,
              ephemeral: true,
            });
            console.log("7");
            return;
          } else if (button.id === "bu3") {
            const embed = new Discord.MessageEmbed()
              .setColor("#DD8811")
              .setImage(`https://mc-heads.net/avatar/${args[0]}`);
            await button.reply.send("", {
              embed: embed,
              ephemeral: true,
            });
            console.log("8");
            return;
          } else if (button.id === "bu4") {
            const embed = new Discord.MessageEmbed()
              .setColor("#DD8811")
              .setImage(`https://mc-heads.net/player/${args[0]}`);
            await button.reply.send("", {
              embed: embed,
              ephemeral: true,
            });
            console.log("9");
            return;
          }
          console.log("Saliendo");
        });
      } else return;
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
