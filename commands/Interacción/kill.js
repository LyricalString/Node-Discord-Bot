require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Kill extends Command {
	constructor(client) {
		super(client, {
			name: "kill",
			description: ["Kills the mentioned user.", "Mata al usuario mencionado."],
			usage: ["<@user>", "<@usuario>"],
			category: "Interaccion",
			tos: true,
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			let user;
			if (args[0]) {
				user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(e => {
					return
				})
			} else {
				if (message.mentions.repliedUser) {
					user = await message.guild.members.fetch(message.mentions.repliedUser.id).catch(e => {
						return
					})
				} else {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.NOARGS)
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
			}
			if (!user) {
				const {
					soyultro
				} = require("soyultro");
				let author = message.author.username;
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(`${author} ${client.language.KILL[5]}`)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			if (user.id == message.author.id) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.KILL[3])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			const {
				soyultro
			} = require("soyultro");
			let author = message.author.username;
			let embed = new Discord.MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
				.setTitle(`${author} ${client.language.KILL[2]} ${user.user.username}`)
				.setColor(process.env.EMBED_COLOR)
				.setImage(soyultro("kill"));

			message.channel.send({ embeds: [embed] });
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
	}
};