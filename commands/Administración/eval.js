const Command = require("../../structures/Commandos.js");
const {
  inspect
} = require("util");
const Discord = require("discord.js");

module.exports = class Channel extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: ["Evaluates a code.", "Evalua un codigo."],
      usage: ["<code>", "<codigo>"],
      permissions: ["ADMINISTRATOR"],
      category: "Utils",
      cooldown: 1,
      nochannel: true,
      role: "dev", //dev, tester, premium, voter
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let evaled;
      try {
        evaled = await eval(args.join(" "));
        const embed = new Discord.MessageEmbed()
          .setAuthor("Eval | Node")
          .setColor(process.env.EMBED_COLOR)
          .addField(":inbox_tray: Entrada", `\`\`\`js\n${args.join(" ")}\`\`\``)
          .addField(
            ":outbox_tray: Salida",
            `\`\`\`js\n${inspect(evaled)}\n\`\`\``
          )
          .setTimestamp(" ");

        message.channel.send({embeds: [embed]}).catch(e => {
          console.log(evaled)
        })
      } catch (error) {
        console.error(error);
        message.reply({ content: `there was an error during evaluation. ${error.toString()}`});
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