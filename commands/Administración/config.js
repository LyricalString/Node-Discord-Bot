const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
require("dotenv").config();
const guildSchema = require("../../models/guild.js");

module.exports = class Config extends Command {
	constructor(client) {
		super(client, {
			name: "config",
			description: [
				"Main command for changing server's configuration.",
				"Comando principal para cambiar la configuración del servidor.",
			],
			role: "dev",
			permissions: ["ADMINISTRATOR"],
			usage: ["<spammode/tosmode> <enable/disable>"],
			args: true,
			production: true,
			category: "administracion",
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			if (args[0].toLowerCase() == "tosmode") {
				if (args[1]) {
					if (args[1].toLowerCase() == "enable") {
						guildSchema
							.findOne({
								guildID: message.guild.id,
							})
							.then((data) => {
								data.config.tos = true;
								data.save().catch((err) => console.error(err));
							});
						message.guild.config.tos = true;
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(client.language.SUCCESSEMBED)
							.setDescription(client.language.TOSMODE[1])
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [embed]});
					} else if (args[1].toLowerCase() == "disable") {
						guildSchema
							.findOne({
								guildID: message.guild.id,
							})
							.then((data) => {
								data.config.tos = false;
								data.save().catch((err) => console.error(err));
							});
						message.guild.config.tos = false;
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(client.language.SUCCESSEMBED)
							.setDescription(client.language.TOSMODE[2])
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [embed]});
					} else {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(
								"Las únicas opciones disponibles son enable/disable."
							)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [errorembed]});
					}
				} else {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(
							`Debes de añadir una de las siguientes opciones al comando: \`enable/disable\`.`
						)
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({embeds: [errorembed]});
				}
			} else if (args[0].toLowerCase() == "spammode") {
				if (args[1]) {
					if (args[1].toLowerCase() == "enable") {
						guildSchema
							.findOne({
								guildID: message.guild.id,
							})
							.then((data) => {
								data.config.spam = true;
								data.save().catch((err) => console.error(err));
							});
						message.guild.config.spam = true;
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(client.language.SUCCESSEMBED)
							.setDescription(client.language.SPAMMODE[1])
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [embed]});
					} else if (args[1].toLowerCase() == "disable") {
						guildSchema
							.findOne({
								guildID: message.guild.id,
							})
							.then((data) => {
								data.config.spam = false;
								data.save().catch((err) => console.error(err));
							});
						message.guild.config.spam = false;
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(client.language.SUCCESSEMBED)
							.setDescription(client.language.SPAMMODE[2])
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [embed]});
					} else {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(
								"Las únicas opciones disponibles son enable/disable."
							)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [errorembed]});
					}
				} else {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(
							`Debes de añadir una de las siguientes opciones al comando: \`enable/disable\`.`
						)
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({embeds: [errorembed]});
				}
			} else if (args[0].toLowerCase() == "mutedrole") {
				if (args[1]) {
					if (args[1].toLowerCase() == "add") {
						let role
						if (args[2]) {
							role = await message.guild.roles.fetch(args[2]) || message.mentions.roles.first()
						}
						if (!role) {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription('No he podido encontrar el rol.')
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({embeds: [errorembed]});
						}
						guildSchema
							.findOne({
								guildID: message.guild.id,
							})
							.then((data) => {
								data.config.MutedRole = role.id;
								data.save().catch((err) => console.error(err));
							});
						message.guild.config.MutedRole = role.id;
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(client.language.SUCCESSEMBED)
							.setDescription(`Has seleccionado <@&${role.id}> como el nuevo rol para los muteos.`)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [embed]});
					} else if (args[1].toLowerCase() == "reset") {
						guildSchema
							.findOne({
								guildID: message.guild.id,
							})
							.then((data) => {
								data.config.MutedRole = "";
								data.save().catch((err) => console.error(err));
							});
						message.guild.config.MutedRole = "";
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(client.language.SUCCESSEMBED)
							.setDescription(`Has reseteado el rol para los muteos. Ahora no se asignará ningun rol.`)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [embed]});
					} else {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(
								"Las únicas opciones disponibles son add <rol> o reset."
							)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({embeds: [errorembed]});
					}
				} else {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(
							`Debes de seguir el siguiente esquema de comando: \`${prefix}config mutedrole <id/mención del rol>\`.`
						)
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({embeds: [errorembed]});
				}
			} else {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						`Esa configuración no existe. Revisa el comando escribiendo \`${prefix}help config\``
					)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({embeds: [errorembed]});
			}
		} catch (e) {
			console.error(e);
			message.channel.send({ embeds: [
				new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.fatal_error)
					.setFooter(message.author.username, message.author.avatarURL())
			]});
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
	}
};
