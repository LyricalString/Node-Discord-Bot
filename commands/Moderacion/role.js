/*
guildID -> message.guild.id
configloval => mongodb.find in a schema
lang -> this.language
Discord = const Discord = require("discord.js")
defaultPrefix -> subcomandos
Schema -> (Schema Mongo Datos)
mongoose -> Conexion mongoose
configFile --> Guadar
config -> todo lo que hay dentro de ConfigFile
dict_categorias -> ¿? IA creo
Dict_Inputs -> no me acuerdo, creo que el input IA
Entrenamientos -> IA
*/
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
let role;
let user;

module.exports = class Role extends Command {
  constructor(client) {
    super(client, {
      name: "role",
      category: "Moderacion",
      description: ["Adds a role to the user!", "¡Agrega un rol a un usuario!"],
      cooldown: 5,
      permissions: ["MANAGE_ROLES"],
      botpermissions: ["MANAGE_ROLES"],
      usage: [
        "add/del <role id/@role> <user id/@role>",
        "add/del <id del rol/@role> <id del usuario/@usuario>",
      ],
      subcommands: ["add", "del"],
      args: true,
      moderation: true,
      nochannel: true,
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
        message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``})
      } else {
        if (!message.deleted) message.delete().catch((e) => console.log(e));
      }
      if (args[0].toLowerCase() == "add") {
        if (!args[2]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[1])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (!args[1]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[2])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        role =
          message.mentions.roles.first() ||
          message.guild.roles.cache.find(
            (r) => r.id == args[1].replace("<@&", "").replace(">", "")
          );

        user =
          message.mentions.members.first() || await message.guild.members.fetch(args[2].replace("<@", "").replace(">", "")).catch(e => {
            return
          });
        let owner = message.guild.ownerId;

        if (message.author.id == owner) {
          // Esto sirve para que si el dueño del servidor usa el comando no le pida permisos y pueda agregar role a cualquier persona, No lo explico porque es lo que verán abajo.

          if (!user) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[3])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (!role) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[4])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (!role.editable) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[12])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (user.roles.cache.has(role.id)) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(
                `${client.language.ROLE[5]} ${user} ${client.language.ROLE[6]} ${role}.`
              )
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          await user.roles.add(role.id); //añadimos el rol al usuario.
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.SUCCESSEMBED)
            .setDescription(
              `${client.language.ROLE[7]} ${role} ${client.language.ROLE[8]} ${user} ${client.language.ROLE[9]}`
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [embed]});
        }

        if (!args[2]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[1])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (!user) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[3])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (user.id == owner) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[10])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (user == message.author.id) {
          // Si el usuario mencionado es el autor del mensaje puede añadirse un rol no igual o mas alto que el suyo, tampoco lo explico por que es lo mismo de abajo

          if (!args[2]) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[2])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }
          if (!role) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[4])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (role.comparePositionTo(message.member.roles.highest) >= 0) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[11])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (!role.editable) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[12])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (user.roles.cache.has(role.id)) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(`${client.language.ROLE[13]} ${role}.`)
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          await user.roles.add(role.id);
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.SUCCESSEMBED)
            .setDescription(
              `${user} ${client.language.ROLE[14]} ${role} ${client.language.ROLE[15]}`
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [embed]});
        }

        if (
          message.member.roles.highest.comparePositionTo(user.roles.highest) <=
          0
        ) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[16])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (!args[1]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[2])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (!role) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[4])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (role.comparePositionTo(message.member.roles.highest) >= 0) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[17])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (!role.editable) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[12])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (user.roles.cache.has(role.id)) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(`${client.language.ROLE[18]} ${role}`)
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        await user.roles.add(role.id); // Agrega el rol mencionado al usuario mencionado
        const embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setTitle(client.language.SUCCESSEMBED)
          .setDescription(
            `${client.language.ROLE[7]} ${role} ${client.language.ROLE[8]} ${user} ${client.language.ROLE[9]}`
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [embed]});
      } else if (args[0].toLowerCase() == "del") {
        if (!args[2]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[1])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (!args[1]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[2])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        role =
          message.mentions.roles.first() ||
          message.guild.roles.cache.find(
            (r) => r.id == args[1].replace("<@&", "").replace(">", "")
          );
        user =
          message.mentions.members.first() ||
          (await message.guild.members.fetch(
            args[2].replace("<@", "").replace(">", "")
          )).catch(e => {
            return
          });
        let owner = message.guild.ownerId;

        if (message.author.id == owner) {
          // Esto sirve para que si el dueño del servidor usa el comando no le pida permisos y pueda agregar role a cualquier persona, No lo explico porque es lo que verán abajo.

          if (!user) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[3])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (!role) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[4])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (!role.editable) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[12])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          await user.roles.remove(role.id);
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.SUCCESSEMBED)
            .setDescription(
              `${client.language.ROLE[7]} ${role} ${client.language.ROLE[23]} ${user} ${client.language.ROLE[9]}`
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [embed]});
        }

        if (!args[2]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[1])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (!user) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[2])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (user.id == owner) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[22])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (user == message.author.id) {
          // Si el usuario mencionado es el autor del mensaje puede añadirse un rol no igual o mas alto que el suyo, tampoco lo explico por que es lo mismo de abajo

          if (!args[1]) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[2])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }
          if (!role) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[4])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (role.comparePositionTo(message.member.roles.highest) >= 0) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[17])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          if (!role.editable) {
            const errorembed = new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle(client.language.ERROREMBED)
              .setDescription(client.language.ROLE[12])
              .setFooter(message.author.username, message.author.avatarURL());
            return message.channel.send({embeds: [errorembed]});
          }

          await user.roles.remove(role.id);
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setTitle(client.language.SUCCESSEMBED)
            .setDescription(
              `${client.language.ROLE[7]} ${role} ${client.language.ROLE[23]} ${user} ${client.language.ROLE[9]}`
            )
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [embed]});
        }

        if (
          message.member.roles.highest.comparePositionTo(user.roles.highest) <=
          0
        ) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[16])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (!args[1]) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[2])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (!role) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[4])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }
        if (role.comparePositionTo(message.member.roles.highest) >= 0) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[17])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        if (!role.editable) {
          const errorembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(client.language.ERROREMBED)
            .setDescription(client.language.ROLE[12])
            .setFooter(message.author.username, message.author.avatarURL());
          return message.channel.send({embeds: [errorembed]});
        }

        await user.roles.remove(role.id); // Agrega el rol mencionado al usuario mencionado
        const embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setTitle(client.language.SUCCESSEMBED)
          .setDescription(
            `${client.language.ROLE[7]} ${role} ${client.language.ROLE[23]} ${user} ${client.language.ROLE[9]}`
          )
          .setFooter(message.author.username, message.author.avatarURL());
        return message.channel.send({embeds: [embed]});
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
      } catch (e) {}
    }
  }
};