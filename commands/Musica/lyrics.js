require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const axios = require("axios");

module.exports = class Lyrics extends Command {
  constructor(client) {
    super(client, {
      name: "lyrics",
      description: [
        "Sends the lyrics of the current song.",
        "Envía la letra de la canción actual.",
      ],
      alias: ["l", "ly", "letra"],
      category: "musica",
      args: true
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    let titulo = args.join("%20");
    axios
      .get(`https://some-random-api.ml/lyrics?title=${titulo}`)
      .then((res) => {
        const embed = new Discord.MessageEmbed()
          .setTitle(res.data.title)
          .setURL(res.data.links.genius)
          .setColor(process.env.EMBED_COLOR)
          .setDescription(res.data.lyrics)
          .setFooter(res.data.author)
          .setThumbnail(res.data.thumbnail.genius);
        return message.channel.send({embeds: [embed]});
      })
      .catch(e => console.log(e))
  }
};
