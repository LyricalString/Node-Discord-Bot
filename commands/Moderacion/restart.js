require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Restart extends Command {
  constructor(client) {
    super(client, {
      name: "announcerestart",
      description: [
        "Announces restart of Node.",
        "Anuncia un reinicio de Node.",
      ],
      category: "Moderation",
      role: "developer",
      alias: ["arestart"],
      production: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    let res;
    let sc = "https://youtu.be/VI9qM-du-Ug";
    const player = client.manager.players.get(message.guild.id);
    if (!player) return;
    try {
      console.debug(player);
      player.queue.length = [];
      res = await client.manager.search(sc, message.author);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.PLAY[9])
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
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        const errorembed = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(
            client.language.PLAY[10]
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({ embeds: [errorembed] })
      case "SEARCH_RESULT": {
        player.queue[0] = res.tracks[0];
        player.stop();
        if (!player.playing && !player.queue.size && !player.paused)
          player.play();
        break;
      }
      case "TRACK_LOADED": {
        player.queue[0] = res.tracks[0];
        player.stop();
        if (!player.playing && !player.paused && !player.queue.size)
          player.play();
      }
    }
    /*
        // inside your message event, etc...
        const filter = m => m.author.id === message.author.id;
        message.reply("What do you want me to say?\n\n> Expires in 10 Seconds, Type `cancel` to cancel!")
            .then(msg => msg.delete(10000)) // so the message will delete after the time is up (10 seconds)
            .catch(err => {}) // if the bot hasnt got perms to delete the message, it will ignore the error 
        message.channel.awaitMessages(filter, {
            max: 1, // do NOT change this 
            time: 10000, // this is the time in MS you want it to last. (There are 1000 MS in 1 second)
            errors: ['time'] // this ensures the only error is "time"
        }).then(async (collected) => { // collected is a collection so we use collected.first().content
            if (collected.first().content.toLowerCase() == 'cancel') { // .toLowerCase() converts the user input to lower case, so if they type "CaNcEl" it will still be read as "cancel" and the if statement will run
                message.reply(":sob: The command has been cancelled.") // what to do if the user repleis "cancel"
            }
            message.channel.send(collected.first().content) // finally send the collected message content to the message channel
        }).catch(() => {
            message.reply("You took too long!")
        })
        */
  }
};
