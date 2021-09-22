require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Clear extends Command {
	constructor(client) {
		super(client, {
			name: "clear",
			description: [
				"Advanced system for message deletion.",
				"Sistema avanzado para el borrado de mensajes.",
			],
			alias: ["clear", "delete", "prune", "purge"],
			permissions: ["MANAGE_MESSAGES"],
			botpermissions: ["MANAGE_MESSAGES"],
			moderation: true,
			usage: ["<amount>", "<cantidad>"],
			category: "Moderacion",
			nochannel: true,
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			try {
				const commands = [
					`${client.language.CLEAR[3]}\`${client.language.CLEAR[4]}`,
					`${client.language.CLEAR[5]}\`${client.language.CLEAR[6]}`,
					`${client.language.CLEAR[7]}\`${client.language.CLEAR[8]}`,
					`${client.language.CLEAR[9]}\`${client.language.CLEAR[10]}`,
					`${client.language.CLEAR[11]}\`${client.language.CLEAR[12]}`,
					`${client.language.CLEAR[13]}\`${client.language.CLEAR[14]}`,
					`${client.language.CLEAR[19]}\`${client.language.CLEAR[20]}`,
					`${client.language.CLEAR[21]}\`${client.language.CLEAR[22]}`,
					`${client.language.CLEAR[23]}\`${client.language.CLEAR[24]}`,
					`${client.language.CLEAR[25]}\`${client.language.CLEAR[26]}`,
					`${client.language.CLEAR[27]}\`${client.language.CLEAR[28]}`,
				];

				const embd = new Discord.MessageEmbed()
					.setColor(process.env.EMBED_COLOR)
					.setTitle(client.language.CLEAR[29])
					.setDescription(
						`\`${prefix}${client.language.CLEAR[32]}\`${client.language.CLEAR[33]
						}\`${prefix}${client.language.CLEAR[34]}${commands.join(
							`\n\`${prefix}${client.language.CLEAR[34]}`
						)}`
					)
					.setFooter(`${client.language.CLEAR[30]}`);

				if (!args[0] || !args.length) return message.channel.send({ embeds: [embd] });
				let amount = Number(args[0], 10) || parseInt(args[0]);
				if (isNaN(amount) || !Number.isInteger(amount)) {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.CLEAR[39])
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
				// if (!amount || amount < 2 || amount > 100) return message.channel.send(client.language.CLEAR[40])

				if (!args[1]) {
					try {
						if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
							message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
						} else {
							if (!message.deleted) message.delete().catch((e) => console.log(e));
						}
						await message.channel.bulkDelete(amount).then(async (m) => {
							let embed = new Discord.MessageEmbed()
								.setColor(process.env.EMBED_COLOR)
								.setDescription(
									`${client.language.CLEAR[41]}${m.size}**/**${amount}${client.language.CLEAR[42]}`
								);

							message.channel
								.send({embeds: [embed]})
								.then((msg) => {
									if (!msg.deleted) {
										setTimeout(() => msg.delete(), 5000);
									}
								}
								)
								.catch((err) => { });
						});
					} catch (e) {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(
								client.language.CLEAR[43]
							)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({ embeds: [errorembed] })
					}
				} else if (args[1]) {
					let msg;
					let data;
					let embed;
					switch (args[1]) {
						case "--bots":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (ms.author.bot && !ms.pinned) data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[44]}${m.size}**/**${amount}${client.language.CLEAR[45]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--humans":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (!ms.author.bot && !ms.pinned) data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;

						/*
										case "--user":
											msg = await message.channel.messages.fetch({
												limit: amount
											})
											data = []
											msg.map(m => m).forEach(ms => {
												message.channel.messages.fetch(ms).then((msg2) => {
													console.log(msg2.array())
													//console.log('Autor: ' + msg2.author.user.id)
												})
												//if (ms.user.id == args[2]) data.push(ms)
											})
			    
											try {
			    
												await message.channel.bulkDelete(data.length ? data : 1, true).then(async (m) => {
			    
													embed = new Discord.MessageEmbed()
														.setColor(process.env.EMBED_COLOR)
														.setDescription(`${client.language.CLEAR[43]}${m.size}**/
						/***${amount}${client.language.CLEAR[44]}`);
			    
													message.channel.send({embeds: [embed]}).then(msg => 
										msg.delete({ timeout: 5000 }))
										.catch(err => {})
												})
			    
											} catch (e) {
											    
												message.channel.send(client.language.CLEAR[42])
											}
			    
											break;
										*/
						case "--embeds":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (ms.embeds.length && !ms.pinned) data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--files":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (ms.attachments.first() && !ms.pinned) data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--text":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										!ms.attachments.first() &&
										!ms.embeds.length &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--mentions":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										(ms.mentions.users.first() ||
											ms.mentions.members.first() ||
											ms.mentions.channels.first() ||
											ms.mentions.roles.first()) &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--pins":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (ms.pinned) data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--match":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (!args[2]) return message.channel.send({ embeds: [embd] });
									if (
										ms.content.includes(args.slice(2).join(" ")) &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--not":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (!args[2]) return message.channel.send({ embeds: [embd] });
									if (
										!ms.content.includes(args.slice(2).join(" ")) &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--startswith":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (!args[2]) return message.channel.send({ embeds: [embd] });
									if (
										ms.content.startsWith(args.slice(2).join(" ")) &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--endswith":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (!args[2]) return message.channel.send({ embeds: [embd] });
									if (
										ms.content.endsWith(args.slice(2).join(" ")) &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--startwith":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (!args[2]) return message.channel.send({ embeds: [embd] });
									if (
										ms.content.startsWith(args.slice(2).join(" ")) &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						case "--endwith":
							msg = await message.channel.messages.fetch({
								limit: amount,
							});
							data = [];
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (!args[2]) return message.channel.send({ embeds: [embd] });
									if (
										ms.content.endsWith(args.slice(2).join(" ")) &&
										!ms.pinned
									)
										data.push(ms);
								});

							try {
								if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
									message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\`` })
								} else {
									if (!message.deleted) message.delete().catch((e) => console.log(e));
								}
								await message.channel
									.bulkDelete(data.length ? data : 1, true)
									.then(async (m) => {
										embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setDescription(
												`${client.language.CLEAR[47]}${m.size}**/**${amount}${client.language.CLEAR[48]}`
											);

										message.channel.send({embeds: [embed]})
											.then((msg) => {
												if (!msg.deleted) {
													setTimeout(() => msg.delete(), 5000);
												}
											}
											)
											.catch((err) => { });
									});
							} catch (e) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.CLEAR[46])
									.setFooter(
										message.author.username,
										message.author.avatarURL()
									);
								return message.channel.send({ embeds: [errorembed] });
							}

							break;
						default:
							return message.channel.send({ embeds: [embd] });
					}
				} else {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.CLEAR[49])
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
			} catch (error) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(`${client.language.CLEAR[50]}\`${error}\``)
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
	}
};
