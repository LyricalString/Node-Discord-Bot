require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const GuildModel = require("../../models/guild.js");
const {
	DiscordMenus,
	ButtonBuilder,
	MenuBuilder
} = require("discord-menus");
const fs = require("fs");
require("discord-reply");
let descripcion, usage;
let encendido = false;
module.exports = class Commands extends Command {
	constructor(client) {
		super(client, {
			name: "commands",
			description: [
				"List all of my commands and its uses.",
				"Muestra todos mis comandos y la información de los mismos.",
			],
			cooldown: 5,
			alias: ["comandos", "commandos", "comands"],
			usage: ["<command>", "<commando>"],
			botpermissions: ["ADD_REACTIONS"],
			category: "Info",
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			// if (message.member.user.OLDMODE) {
			// 	let mod = new MessageButton()
			// 		.setStyle("blurple") //default: blurple
			// 		.setLabel(` ${client.language.COMMANDS[1]}`) //default: NO_LABEL_PROVIDED
			// 		.setEmoji("🔒")
			// 		.setID("b1");
			// 	let games = new MessageButton()
			// 		.setStyle("blurple") //default: blurple
			// 		.setLabel(` ${client.language.COMMANDS[2]}`) //default: NO_LABEL_PROVIDED
			// 		.setEmoji("🎮")
			// 		.setID("b2");
			// 	let music = new MessageButton()
			// 		.setStyle("blurple") //default: blurple
			// 		.setLabel(` ${client.language.COMMANDS[3]}`) //default: NO_LABEL_PROVIDED
			// 		.setEmoji("🎶")
			// 		.setID("b3");
			// 	let utility = new MessageButton()
			// 		.setStyle("blurple") //default: blurple
			// 		.setLabel(` ${client.language.COMMANDS[4]}`) //default: NO_LABEL_PROVIDED
			// 		.setEmoji("🌐")
			// 		.setID("b4");
			// 	let info = new MessageButton()
			// 		.setStyle("blurple") //default: blurple
			// 		.setLabel(` ${client.language.COMMANDS[5]}`) //default: NO_LABEL_PROVIDED
			// 		.setEmoji("🛠️")
			// 		.setID("b5");
			// 	let ButtonArray = [mod, games, music, utility, info];

			// 	const embed = new Discord.MessageEmbed()
			// 		.setColor(process.env.EMBED_COLOR)
			// 		.setDescription(
			// 			`<a:828830816486293608:836296002893381682> ${client.language.COMMANDS[6]} \`${message.guild.prefix}help <${client.language.COMMANDS[7]}>\` ${client.language.COMMANDS[8]}.`
			// 		)
			// 		.addField(client.language.COMMANDS[9], client.language.COMMANDS[10])
			// 		.setThumbnail(message.author.avatarURL({
			// 			dynamic: true
			// 		}))
			// 		.setTitle(`✨ - ${client.language.COMMANDS[11]}`);
			// 	//let user = client.users.cache.get(message.author.id)

			// 	//message.lineReply('¡Te he enviado un mensaje privado con mis comandos!')
			// 	message.channel.send({
			// 		embeds: embed,
			// 		buttons: ButtonArray,
			// 	});
			// 	if (encendido == false) {
			// 		client.on("clickButton", async (button, err) => {
			// 			if (err) return;
			// 			try {
			// 				if (button.id === "b1") {
			// 					let test = "";
			// 					client.commands.forEach((cmd) => {
			// 						descripcion =
			// 							lang == "en_US" ? cmd.description[0] : cmd.description[1];
			// 						if (cmd.usage) {
			// 							usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			// 						} else {
			// 							usage = "";
			// 						}
			// 						if (cmd.category === "Moderacion") {
			// 							if (
			// 								usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role != "dev"
			// 							) {
			// 								test += ` **${message.guild.prefix}${cmd.name} ** -${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			// 							} else if (
			// 								!usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role != "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			// 							}
			// 						}
			// 					});
			// 					const embed = new Discord.MessageEmbed().setDescription(test);
			// 					await button.reply.send({
			// 						embed: embed,
			// 						ephemeral: true
			// 					});
			// 				} else if (button.id === "b2") {
			// 					let test = "";
			// 					client.commands.forEach((cmd) => {
			// 						if (cmd.usage) {
			// 							usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			// 						} else {
			// 							usage = "";
			// 						}
			// 						descripcion =
			// 							lang == "en_US" ? cmd.description[0] : cmd.description[1];
			// 						if (cmd.category === "Juego") {
			// 							if (
			// 								usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			// 							} else if (
			// 								!usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			// 							}
			// 						}
			// 					});
			// 					const embed = new Discord.MessageEmbed().setDescription(test);
			// 					await button.reply.send({
			// 						embed: embed,
			// 						ephemeral: true
			// 					});
			// 				} else if (button.id === "b3") {
			// 					let test = "";

			// 					client.commands.forEach((cmd) => {
			// 						if (cmd.usage) {
			// 							usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			// 						} else {
			// 							usage = "";
			// 						}
			// 						descripcion =
			// 							lang == "en_US" ? cmd.description[0] : cmd.description[1];
			// 						if (cmd.category === "Musica") {
			// 							if (
			// 								usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			// 							} else if (
			// 								!usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			// 							}
			// 						}
			// 					});
			// 					const embed = new Discord.MessageEmbed().setDescription(test);
			// 					await button.reply.send("", {
			// 						embed: embed,
			// 						ephemeral: true
			// 					});
			// 				} else if (button.id === "b4") {
			// 					let test = "";
			// 					client.commands.forEach((cmd) => {
			// 						if (cmd.usage) {
			// 							usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			// 						} else {
			// 							usage = "";
			// 						}
			// 						descripcion =
			// 							lang == "en_US" ? cmd.description[0] : cmd.description[1];
			// 						if (cmd.category === "Utils") {
			// 							if (
			// 								usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			// 							} else if (
			// 								!usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			// 							}
			// 						}
			// 					});
			// 					const embed = new Discord.MessageEmbed().setDescription(test);
			// 					await button.reply.send("", {
			// 						embed: embed,
			// 						ephemeral: true
			// 					});
			// 				} else if (button.id === "b5") {
			// 					let test = "";
			// 					client.commands.forEach((cmd) => {
			// 						if (cmd.usage) {
			// 							if (cmd.usage) {
			// 								usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			// 							}
			// 						} else {
			// 							usage = "";
			// 						}
			// 						descripcion =
			// 							lang == "en_US" ? cmd.description[0] : cmd.description[1];
			// 						if (cmd.category === "Info") {
			// 							if (
			// 								usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			// 							} else if (
			// 								!usage &&
			// 								!cmd.inactive &&
			// 								!cmd.production &&
			// 								cmd.role !== "dev"
			// 							) {
			// 								test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			// 							}
			// 						}
			// 					});
			// 					const embed = new Discord.MessageEmbed().setDescription(test);
			// 					await button.reply.send("", {
			// 						embed: embed,
			// 						ephemeral: true
			// 					});
			// 				}
			// 			} catch (e) {
			// 				console.error(e);
			// 			}
			// 		});
			// 		encendido = true;
			// 	} else return;
			// } else {
				const MenusManager = new DiscordMenus(client);
				const myCoolMenu = new MenuBuilder()
					.addLabel(client.language.COMMANDS[18], {
						description: client.language.COMMANDS[20],
						value: "m6",
						emoji: {
							name: "🕵️‍♀️",
						},
					})
					.addLabel(client.language.COMMANDS[1], {
						description: client.language.COMMANDS[13],
						value: "m1",
						emoji: {
							name: "🔒",
						},
					})
					.addLabel(client.language.COMMANDS[2], {
						description: client.language.COMMANDS[14],
						value: "m2",
						emoji: {
							name: "🎮",
						},
					})
					.addLabel(client.language.COMMANDS[19], {
						description: client.language.COMMANDS[21],
						value: "m7",
						emoji: {
							name: "🎭",
						},
					})
					.addLabel(client.language.COMMANDS[3], {
						description: client.language.COMMANDS[15],
						value: "m3",
						emoji: {
							name: "🎶",
						},
					})
					.addLabel(client.language.COMMANDS[4], {
						description: client.language.COMMANDS[16],
						value: "m4",
						emoji: {
							name: "🌐",
						},
					})
					.addLabel(client.language.COMMANDS[5], {
						description: client.language.COMMANDS[17],
						value: "m5",
						emoji: {
							name: "🛠️",
						},
					})
					.setMaxValues(1)
					.setCustomID("menucommands")
					.setPlaceHolder(client.language.COMMANDS[12]);
				const embed = new Discord.MessageEmbed()
					.setColor(process.env.EMBED_COLOR)
					.setDescription(
						`<a:828830816486293608:836296002893381682> ${client.language.COMMANDS[6]} \`${message.guild.prefix}help <${client.language.COMMANDS[7]}>\` ${client.language.COMMANDS[8]}.`
					)
					.addField(client.language.COMMANDS[9], client.language.COMMANDS[10])
					.setFooter(
						client.language.oldDiscord,
						message.author.avatarURL({
							dynamic: true,
						})
					)
					.setThumbnail(
						message.author.avatarURL({
							dynamic: true,
						})
					)
					.setTitle(`✨ - ${client.language.COMMANDS[11]}`);
				await MenusManager.sendMenu(message, embed, {
					menu: myCoolMenu,
				});

				if (encendido == false) {
					MenusManager.on("MENU_CLICKED", async (menu) => {
						let lang;
						GuildModel.findOne({guildID: menu.guildID}).then(async (guild, err) => {
							if (err) return
							if (!guild) return
							if (client.users.cache.get(menu.member.id)) {
								lang = await client.users.cache.get(menu.member.id).LANG;
							} else {
								await client.users.fetch(menu.member.id).then(user2 => {
									lang = user2.LANG
								}).catch(e => {
									console.log(e)
									lang = "es_ES";
								})
							}
							if (menu.values[0].toLowerCase() == "m1") {
								try {
									let test = "";
									client.commands.forEach((cmd) => {
										descripcion =
											lang == "en_US" ? cmd.description[0] : cmd.description[1];
										if (cmd.usage) {
											usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
										} else {
											usage = "";
										}
										if (cmd.category.toLowerCase() == "moderacion") {
											if (
												usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role != "dev"
											) {
												test += ` **${guild.PREFIX}${cmd.name} ** -${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `;
											} else if (
												!usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role != "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `;
											}
										}
									});
									const embed = new Discord.MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test);
									await menu.reply(embed, {
										ephemeral: true,
									});
								} catch (error) {
									console.error(error);
								}
							} else if (menu.values[0].toLowerCase() == "m2") {
								try {
									let test = "";
									client.commands.forEach((cmd) => {
										if (cmd.usage) {
											usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
										} else {
											usage = "";
										}
										descripcion =
											lang == "en_US" ? cmd.description[0] : cmd.description[1];
										if (cmd.category.toLowerCase() == "sesiones") {
											if (
												usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `;
											} else if (
												!usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `;
											}
										}
									});
									const embed = new Discord.MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test);
									await menu.reply(embed, {
										ephemeral: true,
									});
								} catch (error) {
									console.error(error);
								}
							} else if (menu.values[0].toLowerCase() == "m3") {
								try {
									let test = "";
									client.commands.forEach((cmd) => {
										if (cmd.usage) {
											usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
										} else {
											usage = "";
										}
										descripcion =
											lang == "en_US" ? cmd.description[0] : cmd.description[1];
										if (cmd.category.toLowerCase() == "musica") {
											if (
												usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `;
											} else if (
												!usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `;
											}
										}
									});
									const embed = new Discord.MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test);
									await menu.reply(embed, {
										ephemeral: true,
									});
								} catch (error) {
									console.error(error);
								}
							} else if (menu.values[0].toLowerCase() == "m4") {
								try {
									let test = "";
									client.commands.forEach((cmd) => {
										if (cmd.usage) {
											usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
										} else {
											usage = "";
										}
										descripcion =
											lang == "en_US" ? cmd.description[0] : cmd.description[1];
										if (cmd.category.toLowerCase() == "diversion") {
											if (
												usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `;
											} else if (
												!usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `;
											}
										}
									});
									const embed = new Discord.MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test);
									await menu.reply(embed, {
										ephemeral: true,
									});
								} catch (error) {
									console.error(error);
								}
							} else if (menu.values[0].toLowerCase() == "m5") {
								try {
									let test = "";
									client.commands.forEach((cmd) => {
										if (cmd.usage) {
											if (cmd.usage) {
												usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
											}
										} else {
											usage = "";
										}
										descripcion =
											lang == "en_US" ? cmd.description[0] : cmd.description[1];
										if (cmd.category.toLowerCase() === "info") {
											if (
												usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `;
											} else if (
												!usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `;
											}
										}
									});
									const embed = new Discord.MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test);
									await menu.reply(embed, {
										ephemeral: true,
									});
								} catch (error) {
									console.error(error);
								}
							} else if (menu.values[0].toLowerCase() == "m6") {
								try {
									let test = "";
									client.commands.forEach((cmd) => {
										if (cmd.usage) {
											usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
										} else {
											usage = "";
										}
										descripcion =
											lang == "en_US" ? cmd.description[0] : cmd.description[1];
										if (cmd.category.toLowerCase() == "administracion") {
											if (
												usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `;
											} else if (
												!usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `;
											}
										}
									});
									const embed = new Discord.MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test);
									await menu.reply(embed, {
										ephemeral: true,
									});
								} catch (error) {
									console.error(error);
								}
							} else if (menu.values[0].toLowerCase() == "m7") {
								try {
									let test = "";
									client.commands.forEach((cmd) => {
										if (cmd.usage) {
											usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
										} else {
											usage = "";
										}
										descripcion =
											lang == "en_US" ? cmd.description[0] : cmd.description[1];
										if (cmd.category.toLowerCase() == "interaccion") {
											if (
												usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `;
											} else if (
												!usage &&
												!cmd.inactive &&
												!cmd.production &&
												cmd.role !== "dev"
											) {
												test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `;
											}
										}
									});
									const embed = new Discord.MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test);
									await menu.reply(embed, {
										ephemeral: true,
									});
								} catch (error) {
									console.error(error);
								}
							}
							encendido = true;
						})
					});
				}
			//}
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