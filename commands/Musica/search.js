require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const { DiscordMenus, ButtonBuilder, MenuBuilder } = require("discord-menus");
module.exports = class Search extends Command {
  constructor(client) {
    super(client, {
      name: "search",
      description: [
        "Searches on youtube for the top 5 results from your song.",
        "Busca en youtube los 5 resultados más destacados de tu canción.",
      ],
      usage: ["<song's name>", "<nombre de la canción>"],
      category: "musica",
      botpermissions: ["CONNECT", "SPEAK"],
      args: true,
      role: "tester",
      production: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      const sc = message.attachments.first() || args.join(" ");
      const { channel } = message.member.voice;
      if (!channel) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            "Necesitas estar en un canal de voz para ejecutar este comando."
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [errorembed]});
      }
      const player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });

      if (player.state !== "CONNECTED") {
        player.connect();
        player.setVolume(35)
      } 

      const playerCanal = client.channels.cache.get(player.voiceChannel);
      if (!playerCanal) return;
      if (playerCanal.id != channel.id) {
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle("Error!")
          .setDescription(
            "Necesitas estar en el mismo canal de voz que el bot para ejecutar este comando."
          );
        return message.channel.send({embeds: [errorembed]});
      }
      const res = await client.manager.search(sc, message.author);
      let n = 0;
      const tracks = res.tracks.slice(0, 5);
      const results = res.tracks
        .slice(0, 5)
        .map((result) => `**${++n} -** [${result.title}](${result.uri})`)
        .join("\n");
      const res1 = res.tracks[0].title.toString();
      const MenusManager = new DiscordMenus(client);
      const myCoolMenu = new MenuBuilder()
        .addLabel("res1", { description: `Prueba`, value: "cancion-1" })
        .addLabel("res1", { description: `Prueba`, value: "cancion-2" })
        .addLabel(res.tracks[0].title, {
          description: `Prueba`,
          value: "cancion-3",
        })
        .setCustomID("cool-custom-id")
        .setPlaceHolder("Select an option");
      await MenusManager.sendMenu(
        message,
        new Discord.MessageEmbed().setDescription("Hello world!"),
        { menu: myCoolMenu }
      ).catch((err) => console.error(err));
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
