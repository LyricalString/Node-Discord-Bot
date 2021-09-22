require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class MineSweeper extends Command {
  constructor(client) {
    super(client, {
      name: "minesweeper",
      description: [
        "Time to play the minesweeper.",
        "Es hora de jugar al buscaminas.",
      ],
      cooldown: 150,
      alias: ["buscaminas"],
      category: "Diversion",
      inactive: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      const { Client, MessageEmbed } = require("discord.js");
      const BombSweeper = require("bombsweeper.js"); //Esta es la npm

      //Vamos a definir los emojis que vamos a usar para cada n�mero
      const emojis = {
        0: "||:zero:||",
        1: "||:one:||",
        2: "||:two:||",
        3: "||:three:||",
        4: "||:four:||",
        5: "||:five:||",
        6: "||:six:||",
        7: "||:seven:||",
        8: "||:eight:||",
        "*": "||:bomb:||",
      }; // En este caso '*' equivale a una bomba!

      //Ahora creamos nuestra tabla colocando primero las filas y las columnas!
      let filas = 10;
      let cols = 10;
      const bombsweeper = new BombSweeper(filas, cols);

      //Ahora vamos a indicar cuantas bombas estar�n el en tablero
      let bombas = 20;
      bombsweeper.PlaceBombs(bombas);

      /*
            NOTA: Pueden hacer uso de argumentos para que el usuario que ejecuta el comando pueda personalizar su juego.
            */

      //Ahora vamos a reemplazar los objetos del tablero por los emojis
      let tablero = bombsweeper.board; // "board" es el tablero que se ha generado

      /*
            Haciendo un doble ciclo 'for' vamos a acceder a cada uno de los elementos de nuestro tablero y lo cambiaremos por los emojis!
            */
      for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 10; i++) {
          tablero[i][j] = emojis[tablero[i][j]];
        }
      }

      // �Listo! ahora s�lo queda enviar el mensaje!
      message.channel.send(tablero);
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
