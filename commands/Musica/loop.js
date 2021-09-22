require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Loop extends Command {
	constructor(client) {
		super(client, {
			name: "loop",
			description: [
				"Loop your song or queue!",
				"¡Haz un bucle con tu canción o cola!",
			],
			usage: ["<song/queue>", "<song/queue>"],
			alias: ["lp"],
			subcommands: ["song", "queue"],
			botpermissions: ["CONNECT", "SPEAK"],
			args: true,
			category: "musica",
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			const player = client.manager.players.get(message.guild.id);
			if (!player) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						client.language.LOOP[5]
					)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({embeds: [errorembed]})
			}
			if (player.voiceChannel) {
				if (
					!message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR') &&
					player.voiceChannel != message.member.voice.channelId
				)
					return;
			}
			if (!args[0] || args[0].toLowerCase() == "song") {
				if (!player.trackRepeat) {
					player.setTrackRepeat(true);
					const embed = new Discord.MessageEmbed()
						.setColor(process.env.EMBED_COLOR)
						.setDescription(client.language.LOOP[1])
						.setTitle(`Loop`);
					return message.channel.send({embeds: [embed]});
				} else {
					player.setTrackRepeat(false);
					const embed = new Discord.MessageEmbed()
						.setColor(process.env.EMBED_COLOR)
						.setDescription(client.language.LOOP[2])
						.setTitle(`Loop`);
					return message.channel.send({embeds: [embed]});
				}
			} else if (args[0].toLowerCase() == "queue") {
				if (player.queueRepeat) {
					player.setQueueRepeat(false);
					const embed = new Discord.MessageEmbed()
						.setColor(process.env.EMBED_COLOR)
						.setDescription(client.language.LOOP[3])
						.setTitle(`Loop`);
					return message.channel.send({embeds: [embed]});
				} else {
					player.setQueueRepeat(true);
					const embed = new Discord.MessageEmbed()
						.setColor(process.env.EMBED_COLOR)
						.setDescription(client.language.LOOP[4])
						.setTitle(`Loop`);
					return message.channel.send({embeds: [embed]});
				}
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
			} catch (e) {}
		}
	}
};