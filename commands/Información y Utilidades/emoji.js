require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Emoji extends Command {
	constructor(client) {
		super(client, {
			name: "emoji",
			description: ["Creates a new emoji.", "Crea un nuevo emoji."],
			permissions: ["ADMINISTRATOR"],
			usage: ["<name> + image attached", "<nombre> + imagen adjunta"],
			category: "Info",
			alias: ["emote"],
			cooldown: 1,
			botpermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
			args: true
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			if (!args[0]) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						`${client.language.EMOJI[2]}\`${prefix}emoji ${client.language.EMOJI[3]}\`. ^^`
					)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			if (message.attachments.size == 0) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.EMOJI[1])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			Array.from(message.attachments, ([key, value]) => {
				let attachment = value.attachment;
				if (!attachment) {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.EMOJI[1])
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
				try {
					message.guild.emojis
						.create(attachment, args[0], {})
						.then((e) => {
							const emoji = client.emojis.cache.get(e.id);
							const embed = new Discord.MessageEmbed()
								.setColor(process.env.EMBED_COLOR)
								.setTitle(client.language.SUCCESSEMBED)
								.setDescription(
									`${client.language.EMOJI[4]} ${emoji}. ${client.language.EMOJI[5]} \`:${args[0]}:\` ${client.language.EMOJI[6]}`
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [embed] });
						})
						.catch((e) => {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(client.language.EMOJI[7])
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] });
						});
				} catch (e) {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.EMOJI[8])
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
			})
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
