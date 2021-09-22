require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const GuildSchema = require("../../models/guild.js");

module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			name: "unban",
			description: ["Unbans a user.", "Quita el veto a un usuario."],
			usage: ["<user id>", "<id del usuario>"],
			permissions: ["BAN_MEMBERS"],
			botpermissions: ["BAN_MEMBERS"],
			args: true,
			category: "Moderacion",
			moderation: true,
			nochannel: true,
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			await message.guild.bans.remove(args[1])
			.then(() => {
				const embed = new Discord.MessageEmbed()
					.setColor(client.language.SUCCESSEMBED)
					.setTitle(client.language.UNBAN[1])
					.setDescription(
						`${client.language.UNBAN[2]} ${args[1]} ${client.language.UNBAN[3]}`
					)
				message.channel.send({ embeds: [embed] });
			}).catch((e) => {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						client.language.UNBAN[4]
					)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
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
