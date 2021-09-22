require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const osu = require("node-osu");

module.exports = class Osu extends Command {
  constructor(client) {
    super(client, {
      name: "osu",
      description: [
        "Shows the people name who helped on the development of Node.",
        "Muestra el nombre de las personas que ayudaron en el desarrollo de Node.",
      ],
      production: true,
      category: "Info",
      subcommands: ["user, beatmap"],
      args: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      const osuApi = new osu.Api(process.env.OsuSecret, {
        notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
        completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
        parseNumeric: false, // Parse numeric values into numbers/floats, excluding ids
      });
      if (args[0].toLowerCase() == "user") {
        osuApi
          .apiCall("/get_user", {
            u: args[1],
          })
          .then((user) => {
            const usuario = user[0];
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.EMBED_COLOR)
              .setTitle(usuario.username);
            if (usuario.user_id != null)
              embed.addField("ID del Usuario", usuario.user_id, true);
            if (usuario.join_date != null)
              embed.addField("Fecha de unión", usuario.join_date, true);
            if (usuario.count300 != null)
              embed.addField("Combos 300", usuario.count300, true);
            if (usuario.count100 != null)
              embed.addField("Combos 100", usuario.count100, true);
            if (usuario.count50 != null)
              embed.addField("Combos 50", usuario.count50, true);
            if (usuario.playcount != null)
              embed.addField("Partidas", usuario.playcount, true);
            if (usuario.ranked_score != null)
              embed.addField(
                "Puntuación Competitivo",
                usuario.ranked_score,
                true
              );
            if (usuario.total_score != null)
              embed.addField("Puntuación Total", usuario.total_score, true);
            if (usuario.pp_rank != null)
              embed.addField("Puntos Rendimiento", usuario.pp_rank, true);
            if (usuario.pp_country_rank != null)
              embed.addField(
                "Rankin Puntos Rendimiento por País",
                usuario.pp_country_rank,
                true
              );
            if (usuario.accuracy != null)
              embed.addField("Precisión", usuario.accuracy, true);
            if (usuario.level != null)
              embed.addField("Nivel", Math.round(usuario.level), true);
            if (usuario.country != null)
              embed.addField("País", usuario.country, true);
            if (usuario.total_seconds_played != null)
              embed.addField(
                "Horas Jugadas",
                Math.roung(parseInt(usuario.total_seconds_played) / 3600),
                true
              );
            message.channel.send({embeds: [embed]});
          })
          .catch((e) => {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription("Ese usuario no está registrado en Osu!")
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          });
      } else if (args[0].toLowerCase() == "beatmap") {
        if (
          !args[1].startsWith("http") &&
          !args[1].includes("/") &&
          !isNaN(args[1])
        ) {
          osuApi
            .getBeatmaps({ b: args[1] })
            .then((beatmaps) => {
              console.debug(beatmaps);
            })
            .catch((e) => {
              console.error(e);
              const errorembed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle(client.language.ERROREMBED)
                .setDescription("Ese usuario no está registrado en Osu!")
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({embeds: [errorembed]});
            });
        } else if (args[1].startsWith("http") || args[1].includes("/")) {
          let argumentos = args[1].split("/");
          osuApi
            .getBeatmaps({ b: argumentos[5] })
            .then((beatmaps) => {
              console.debug(beatmaps);
            })
            .catch((e) => {
              console.error(e);
              const errorembed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle(client.language.ERROREMBED)
                .setDescription("Ese usuario no está registrado en Osu!")
                .setFooter(message.author.username, message.author.avatarURL());
              return message.channel.send({embeds: [errorembed]});
            });
        } else {
          message.channel.send("No has insertado un ID ni un URL.");
        }
      }
    } catch (e) {
      console.error(e);
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
