const { Manager } = require("erela.js");
const Discord = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const clientID = process.env.clientIDSpotify; //De preferencia mantenerlo en secreto mediante .env
const clientSecret = process.env.clientSecretSpotify; //x2
const Spotify = require("erela.js-spotify");
module.exports = async (client) => {
  try {
    function formatDuration(duration) {
      if (isNaN(duration) || typeof duration === "undefined") return "00:00";
      if (duration > 3600000000) return "En Directo";
      return prettyMilliseconds(duration);
    }

    client.manager = new Manager({
      nodes: [
        {
          host: "localhost",
          port: 2333,
          password: "youshallnotpass",
        },
      ],
      autoPlay: true,
      plugins: [
        new Spotify({
          clientID,
          clientSecret,
        }),
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      }
    })
      .on("nodeConnect", (node) => {
        console.log(`Node ${node.options.identifier} connected`);
      })
      // .on("nodeError", (node, error) =>
      //     console.log(
      //         `Node ${node.options.identifier} had an error: ${error.message}`
      //     )
      // )
      .on("trackStart", (player, track) => {
        if (!track) return;
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `Reproduciendo **[${track.title}](${track.uri})** [${formatDuration(
              track.duration
            )}] • <@${track.requester.id}>`
          )
          .setColor(process.env.EMBED_COLOR)
          .setThumbnail(track.thumbnail);
        client.channels.cache.get(player.textChannel).send({embeds: [embed]});
      })
      .on("queueEnd", (player) => {
        const errorembed = new Discord.MessageEmbed()
          .setColor("ORANGE")
          .setDescription(client.language.NOQUEUE);
        if (client.channels.cache.get(player.textChannel))
          client.channels.cache.get(player.textChannel).send({embeds: [errorembed]});

        player.destroy();
      })
      .on("playerMove", (player, currentChannel, newChannel) => {
        player.voiceChannel = client.channels.cache.get(newChannel);
      });
  } catch (e) {
    console.error(e);
  }
};
