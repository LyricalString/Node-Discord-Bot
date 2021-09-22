const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Betrayal extends Command {
	constructor(client) {
		super(client, {
			name: "betrayal",
			description: [
				"Starts a betrayal session together.",
				"Comienza una sesión de betrayal.",
			],
			botpermissions: ["CREATE_INSTANT_INVITE"],
			category: "Sesiones",
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			const { DiscordTogether } = require('discord-together');

			client.discordTogether = new DiscordTogether(client);
			const Guild = await client.guilds.fetch(message.guild.id); // Getting the guild.
			await Guild.members.fetch(message.member.id).then(async Member => {
				const channel = await Member.voice.channel;
				if (!Guild) return;
				if (!Member) return;
				if (!channel) {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.BETRAYAL[2])
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
				if (args[0]) {
					if (args[0].toLowerCase() == "--unlimited") {
						client.discordTogether.createTogetherCode(channel.id, 'betrayal', 0).then(async invite => {
							if (invite.code === 50013) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CREATEINVITEPERMS)
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}
							const embed = new Discord.MessageEmbed();
							if (!invite.code) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.BETRAYAL[2])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}
							embed.setColor(process.env.EMBED_COLOR);
							embed.setDescription(
								`<a:arrowright:835907836352397372> **${client.language.BETRAYAL[1]}(${invite.code} 'Enlace de Youtube') <a:flechaizquierda:836295936673579048>**`
							);
							return message.channel.send({ embeds: [embed] });
						}).catch(e => {
							if (e == 'Your bot lacks permissions to perform that action') {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.YOUTUBE[5]
									)
									.setFooter(message.author.username, message.author.avatarURL());
								return message.channel.send({ embeds: [errorembed] });
							}
						})
					} else {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(
								`${client.language.YOUTUBE[3]} ${prefix}${client.language.YOUTUBE[4]}`
							)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({ embeds: [errorembed] });
					}
					return;
				}
				client.discordTogether.createTogetherCode(channel.id, 'betrayal', 900).then(async invite => {
					if (invite.code === 50013) {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(client.language.CREATEINVITEPERMS)
							.setFooter(
								message.author.username,
								message.author.avatarURL()
							);
						return message.channel.send({ embeds: [errorembed] });
					}
					const embed = new Discord.MessageEmbed();
					if (!invite.code) {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(client.language.BETRAYAL[2])
							.setFooter(
								message.author.username,
								message.author.avatarURL()
							);
						return message.channel.send({ embeds: [errorembed] });
					}
					embed.setColor(process.env.EMBED_COLOR);
					embed.setDescription(
						`<a:arrowright:835907836352397372> **${client.language.BETRAYAL[1]}(${invite.code} 'Enlace de Youtube') <a:flechaizquierda:836295936673579048>**`
					);
					return message.channel.send({ embeds: [embed] });
				}).catch(e => {
					if (e == 'Your bot lacks permissions to perform that action') {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(
								client.language.YOUTUBE[5]
							)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({ embeds: [errorembed] });
					}
				})
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
