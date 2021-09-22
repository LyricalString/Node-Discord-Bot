const GuildModel = require("../models/guild.js");
const MutesModel = require("../models/mutes.js");
const Discord = require('discord.js')
const BansModel = require('../models/bans.js')
const KickModel = require('../models/kick.js')

module.exports = async function (client, Thing, Todo, message2, toDel) {
	if (message2.guild.loadingBackup) return
	if (!Thing.Action) return
	if (Thing.AdminBypass && message2.guild.members.cache.get(message2.author.id).permissions.has('ADMINISTRATOR')) return
	if (Thing.Bots && message2.author.bot) return
	switch (Todo) {
		case "Mute":
			const mute = Thing.Action.Mute;
			if (mute) {
				if (mute.Infinite) {
					if (mute.Reason) {
						MutesModel.findOne({
							USERID: message2.author.id,
						}).then(async (s, err) => {
							if (s) {
								s.GUILDS.push({
									ID: message2.guild.id,
									MUTE_TIMESTAMP: Date.now(),
									MUTE_TIME: 999999999 * 1000,
								});
								s.save().catch(e => console.warn(e));
							} else if (!s) {
								//const role = client2.roles.cache.get("859400100383293470")
								const user2 = new MutesModel({
									USERID: message2.author.id,
									GUILDS: {
										ID: message2.guild.id,
										MUTE_TIMESTAMP: Date.now(),
										MUTE_TIME: 999999999 * 1000,
									},
								});
								user2.save().catch(e => console.warn(e));
							}
							if (message2.member && message2.guild.config.MutedRole) {
								if (!message2.member.roles.cache.has(message2.guild.config.MutedRole)) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_ROLES")) return message2.reply({ content: `${client.language.SWITCHTHINGS[5]}` })
									message2.member.roles.add(message2.guild.config.MutedRole).then(() => {
										if (Thing.Action.NotifyOnChat) {
											if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
											}
											if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
											}
											const embed = new Discord.MessageEmbed()
												.setColor(process.env.EMBED_COLOR)
												.setTitle(client.language.SUCCESSEMBED)
												.setDescription(
													`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.MUTE[1]}`
												)
												.setFooter(message2.author.username, message2.author.avatarURL());
											message2.channel.send({ embeds: [embed] })
										}
										if (Thing.Logs) {
											if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
											}
											if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
											}
											let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
											const embed = new Discord.MessageEmbed()
												.setColor(process.env.EMBED_COLOR)
												.setTitle(client.language.SUCCESSEMBED)
												.setDescription(
													`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.MUTE[1]}`
												)
												.setFooter(message2.author.username, message2.author.avatarURL());
											canal.send({ embeds: [embed] })
										}
									}).catch(e => {
										return message2.reply({ content: client.language.SWITCHTHINGS[6] })
									})
								}
							} else {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[1]
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								message2.channel.send({ embeds: [errorembed] })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[3]
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								return message2.channel.send({ embeds: [errorembed] })
							}
							let msg = await message2.channel.messages.fetch();
							let data = [];
							let counter = 0;
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										ms.author.id == message2.author.id &&
										counter < toDel
									) {
										data.push(ms);
										counter += 1;
									}
								});

							try {
								await message2.channel.bulkDelete(
									data.length ? data : 1,
									true
								);
							} catch (e) {
								console.log(e)
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[4])
								return message2.channel.send({ embeds: [errorembed] });
							}
						});
						return
					} else {
						MutesModel.findOne({
							USERID: message2.author.id,
						}).then(async (s, err) => {
							if (s) {
								s.GUILDS.push({
									ID: message2.guild.id,
									MUTE_TIMESTAMP: Date.now(),
									MUTE_TIME: 999999999 * 1000,
								});
								s.save().catch(e => console.warn(e));
							} else if (!s) {
								//const role = client2.roles.cache.get("859400100383293470")
								const user2 = new MutesModel({
									USERID: message2.author.id,
									GUILDS: {
										ID: message2.guild.id,
										MUTE_TIMESTAMP: Date.now(),
										MUTE_TIME: 999999999 * 1000,
									},
								});
								user2.save().catch(e => console.warn(e));
							}
							if (message2.member && message2.guild.config.MutedRole) {
								if (!message2.member.roles.cache.has(message2.guild.config.MutedRole)) {

									if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_ROLES")) return message2.reply({ content: `${client.language.SWITCHTHINGS[5]}` })
									message2.member.roles.add(message2.guild.config.MutedRole).then(() => {
										if (Thing.Action.NotifyOnChat) {
											if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
											}
											if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
											}
											const embed = new Discord.MessageEmbed()
												.setColor(process.env.EMBED_COLOR)
												.setTitle(client.language.SUCCESSEMBED)
												.setDescription(
													`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.MUTE[1]}`
												)
												.setFooter(message2.author.username, message2.author.avatarURL());
											message2.channel.send({ embeds: [embed] })
										}
										if (Thing.Logs) {
											if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
											if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
											}
											if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
												return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
											}
											let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
											const embed = new Discord.MessageEmbed()
												.setColor(process.env.EMBED_COLOR)
												.setTitle(client.language.SUCCESSEMBED)
												.setDescription(
													`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.MUTE[1]}`
												)
												.setFooter(message2.author.username, message2.author.avatarURL());
											canal.send({ embeds: [embed] })
										}
									}).catch(e => {
										return message2.reply({ content: client.language.SWITCHTHINGS[6] })
									})
								}
							} else {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[1]
									)
								message2.channel.send({ embeds: [errorembed] })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[3]
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								return message2.channel.send({ embeds: [errorembed] })
							}
							let msg = await message2.channel.messages.fetch();
							let data = [];
							let counter = 0;
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										ms.author.id == message2.author.id &&
										counter < toDel
									) {
										data.push(ms);
										counter += 1;
									}
								});

							try {
								await message2.channel.bulkDelete(
									data.length ? data : 1,
									true
								);
							} catch (e) {
								console.log(e)
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[4])
								return message2.channel.send({ embeds: [errorembed] });
							}
						});
						return
					}
				} else if (mute.Time) {
					MutesModel.findOne({
						USERID: message2.author.id,
					}).then(async (s, err) => {
						if (s) {
							s.GUILDS.push({
								ID: message2.guild.id,
								MUTE_TIMESTAMP: Date.now(),
								MUTE_TIME: mute.Time * 1000,
							});
							s.save().catch(e => console.warn(e));
						} else if (!s) {

							const user2 = new MutesModel({
								USERID: message2.author.id,
								GUILDS: {
									ID: message2.guild.id,
									MUTE_TIMESTAMP: Date.now(),
									MUTE_TIME: mute.Time * 1000,
								},
							});
							user2.save().catch(e => console.warn(e));
						}
						if (message2.guild.config.MutedRole) {
							if (message2.member && !message2.member.roles.cache.has(message2.guild.config.MutedRole)) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_ROLES")) return message2.reply({ content: `${client.language.SWITCHTHINGS[5]}` })
								message2.member.roles.add(message2.guild.config.MutedRole).then(() => {
									if (Thing.Action.NotifyOnChat) {
										if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
										if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
										if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
											return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
										}
										if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
											return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
										}
										const embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setTitle(client.language.SUCCESSEMBED)
											.setDescription(
												`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.MUTE[1]}`
											)
											.setFooter(message2.author.username, message2.author.avatarURL());
										message2.channel.send({ embeds: [embed] })
									}
									if (Thing.Logs) {
										if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
										if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
										if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
											return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
										}
										if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
											return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
										}
										let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
										const embed = new Discord.MessageEmbed()
											.setColor(process.env.EMBED_COLOR)
											.setTitle(client.language.SUCCESSEMBED)
											.setDescription(
												`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.MUTE[1]}`
											)
											.setFooter(message2.author.username, message2.author.avatarURL());
										canal.send({ embeds: [embed] })
									}
								}).catch(e => {
									return message2.reply({ content: client.language.SWITCHTHINGS[6] })
								})
							}
						} else {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.SWITCHTHINGS[1]
								)
							message2.channel.send({ embeds: [errorembed] })
						}
						if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.SWITCHTHINGS[3]
								)
								.setFooter(message2.author.username, message2.author.avatarURL());
							return message2.channel.send({ embeds: [errorembed] })
						}
						let msg = await message2.channel.messages.fetch();
						let data = [];
						let counter = 0;
						msg
							.map((m) => m)
							.forEach((ms) => {
								if (
									ms.author.id == message2.author.id &&
									counter < toDel
								) {
									data.push(ms);
									counter += 1;
								}
							});

						try {
							await message2.channel.bulkDelete(
								data.length ? data : 1,
								true
							);
						} catch (e) {
							console.log(e)
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(client.language.SWITCHTHINGS[4])
							return message2.channel.send({ embeds: [errorembed] });
						}
					});
					return
				}
			} else {
				console.error("Error SwitchThings Mute");
			}
			break;
		case "Ban":
			const ban = Thing.Action.Ban;
			if (ban) {
				if (ban.Infinite) {
					if (ban.Reason) {
						BansModel.findOne({
							USERID: message2.author.id,
						}).then(async (s, err) => {
							if (message2.member) message2.member.user.ban({ reason: ban.Reason }).then(() => {
								if (s) {
									s.GUILDS.push({
										ID: message2.guild.id,
										BAN_TIMESTAMP: Date.now(),
										BAN_TIME: ban.Time * 1000,
										EXPIRED: false
									});
									s.save().catch(e => console.warn(e));
								} else if (!s) {
									//const role = client2.roles.cache.get("859400100383293470")
									const user2 = new BansModel({
										USERID: message2.author.id,
										GUILDS: {
											ID: message2.guild.id,
											BAN_TIMESTAMP: Date.now(),
											BAN_TIME: ban.Time * 1000,
											EXPIRED: false
										},
									});
									user2.save().catch(e => console.warn(e));
								}
								if (Thing.Action.NotifyOnChat) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									message2.channel.send({ embeds: [embed] })
								}
								if (Thing.Logs) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									canal.send({ embeds: [embed] })
								}
							}).catch(() => {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[7])
								return message2.channel.send({ embeds: [errorembed] });
							})
							if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[3]
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								return message2.channel.send({ embeds: [errorembed] })
							}
							let msg = await message2.channel.messages.fetch();
							let data = [];
							let counter = 0;
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										ms.author.id == message2.author.id &&
										counter < toDel
									) {
										data.push(ms);
										counter += 1;
									}
								});

							try {
								await message2.channel.bulkDelete(
									data.length ? data : 1,
									true
								);
							} catch (e) {
								console.log(e)
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[4])
								return message2.channel.send({ embeds: [errorembed] });
							}
						});
					} else {
						BansModel.findOne({
							USERID: message2.author.id,
						}).then(async (s, err) => {
							if (message2.member) message2.member.user.ban().then(() => {
								if (s) {
									s.GUILDS.push({
										ID: message2.guild.id,
										BAN_TIMESTAMP: Date.now(),
										BAN_TIME: ban.Time * 1000,
										EXPIRED: false
									});
									s.save().catch(e => console.warn(e));
								} else if (!s) {
									//const role = client2.roles.cache.get("859400100383293470")
									const user2 = new BansModel({
										USERID: message2.author.id,
										GUILDS: {
											ID: message2.guild.id,
											BAN_TIMESTAMP: Date.now(),
											BAN_TIME: ban.Time * 1000,
											EXPIRED: false
										},
									});
									user2.save().catch(e => console.warn(e));
								}
								if (Thing.Action.NotifyOnChat) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									message2.channel.send({ embeds: [embed] })
								}
								if (Thing.Logs) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									canal.send({ embeds: [embed] })
								}
							}).catch(() => {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[7])
								return message2.channel.send({ embeds: [errorembed] });
							})
							if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[3]
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								return message2.channel.send({ embeds: [errorembed] })
							}
							let msg = await message2.channel.messages.fetch();
							let data = [];
							let counter = 0;
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										ms.author.id == message2.author.id &&
										counter < toDel
									) {
										data.push(ms);
										counter += 1;
									}
								});

							try {
								await message2.channel.bulkDelete(
									data.length ? data : 1,
									true
								);
							} catch (e) {
								console.log(e)
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[4])
								return message2.channel.send({ embeds: [errorembed] });
							}
						});
					}
				} else if (ban.Time) {
					if (ban.Reason) {
						BansModel.findOne({
							USERID: message2.author.id,
						}).then(async (s, err) => {
							if (message2.member) message2.member.ban({ reason: ban.Reason }).then(() => {
								if (s) {
									s.GUILDS.push({
										ID: message2.guild.id,
										BAN_TIMESTAMP: Date.now(),
										BAN_TIME: ban.Time * 1000,
										EXPIRED: false
									});
									s.save().catch(e => console.warn(e));
								} else if (!s) {
									//const role = client2.roles.cache.get("859400100383293470")
									const user2 = new BansModel({
										USERID: message2.author.id,
										GUILDS: {
											ID: message2.guild.id,
											BAN_TIMESTAMP: Date.now(),
											BAN_TIME: ban.Time * 1000,
											EXPIRED: false
										},
									});
									user2.save().catch(e => console.warn(e));
								}
								if (Thing.Action.NotifyOnChat) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									message2.channel.send({ embeds: [embed] })
								}
								if (Thing.Logs) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									canal.send({ embeds: [embed] })
								}
							}).catch(() => {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[7])
								return message2.channel.send({ embeds: [errorembed] });
							})
							if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[3]
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								return message2.channel.send({ embeds: [errorembed] })
							}
							let msg = await message2.channel.messages.fetch();
							let data = [];
							let counter = 0;
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										ms.author.id == message2.author.id &&
										counter < toDel
									) {
										data.push(ms);
										counter += 1;
									}
								});

							try {
								await message2.channel.bulkDelete(
									data.length ? data : 1,
									true
								);
							} catch (e) {
								console.log(e)
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[4])
								return message2.channel.send({ embeds: [errorembed] });
							}
						});
					} else {
						BansModel.findOne({
							USERID: message2.author.id,
						}).then(async (s, err) => {
							if (message2.member) message2.member.user.ban().then(() => {
								if (s) {
									s.GUILDS.push({
										ID: message2.guild.id,
										BAN_TIMESTAMP: Date.now(),
										BAN_TIME: ban.Time * 1000,
										EXPIRED: false
									});
									s.save().catch(e => console.warn(e));
								} else if (!s) {
									//const role = client2.roles.cache.get("859400100383293470")
									const user2 = new BansModel({
										USERID: message2.author.id,
										GUILDS: {
											ID: message2.guild.id,
											BAN_TIMESTAMP: Date.now(),
											BAN_TIME: ban.Time * 1000,
											EXPIRED: false
										},
									});
									user2.save().catch(e => console.warn(e));
								}
								if (Thing.Action.NotifyOnChat) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									message2.channel.send({ embeds: [embed] })
								}
								if (Thing.Logs) {
									if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
									if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
									}
									if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
										return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
									}
									let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.setTitle(client.language.SUCCESSEMBED)
										.setDescription(
											`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.BAN[13]}`
										)
										.setFooter(message2.author.username, message2.author.avatarURL());
									canal.send({ embeds: [embed] })
								}
							}).catch(() => {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[7])
								return message2.channel.send({ embeds: [errorembed] });
							})
							if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										client.language.SWITCHTHINGS[3]
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								return message2.channel.send({ embeds: [errorembed] })
							}
							let msg = await message2.channel.messages.fetch();
							let data = [];
							let counter = 0;
							msg
								.map((m) => m)
								.forEach((ms) => {
									if (
										ms.author.id == message2.author.id &&
										counter < toDel
									) {
										data.push(ms);
										counter += 1;
									}
								});

							try {
								await message2.channel.bulkDelete(
									data.length ? data : 1,
									true
								);
							} catch (e) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(client.language.SWITCHTHINGS[3])
								return message2.channel.send({ embeds: [errorembed] });
							}
						});
					}
				}
			} else {
				console.error("Error SwitchThings Ban");
			}
			break;
		case "DeleteMessage":
			if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
				if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
				if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
				if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
					return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
				}
				if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
					return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
				}
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						client.language.SWITCHTHINGS[3]
					)
					.setFooter(message2.author.username, message2.author.avatarURL());
				return message2.channel.send({ embeds: [errorembed] })
			}
			let msg = await message2.channel.messages.fetch();
			let data = [];
			let counter = 0;
			msg
				.map((m) => m)
				.forEach((ms) => {
					if (
						ms.author.id == message2.author.id &&
						counter < toDel
					) {
						data.push(ms);
						counter += 1;
					}
				});

			try {
				await message2.channel.bulkDelete(
					data.length ? data : 1,
					true
				);
			} catch (e) {
				if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
				if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
				if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
					return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
				}
				if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
					return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
				}
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.SWITCHTHINGS[3])
				return message2.channel.send({ embeds: [errorembed] });
			}
			break;
		case "Kick":
			const kick = Thing.Action.Kick;
			if (kick) {
				if (kick.Reason) {
					KickModel.findOne({
						USERID: message2.author.id,
					}).then(async (s, err) => {
						if (s) {
							s.GUILDS.push({
								ID: message2.guild.id,
								KICK_TIMESTAMP: Date.now(),
							});
							s.save().catch(e => console.warn(e));
						} else if (!s) {
							//const role = client2.roles.cache.get("859400100383293470")
							const user2 = new KickModel({
								USERID: message2.author.id,
								GUILDS: {
									ID: message2.guild.id,
									KICK_TIMESTAMP: Date.now(),
								},
							});
							user2.save().catch(e => console.warn(e));
						}
						if (message2.member) message2.member.kick({ reason: kick.Reason }).then(() => {
							if (Thing.Action.NotifyOnChat) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const embed = new Discord.MessageEmbed()
									.setColor(process.env.EMBED_COLOR)
									.setTitle(client.language.SUCCESSEMBED)
									.setDescription(
										`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.KICK[14]}`
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								message2.channel.send({ embeds: [embed] })
							}
							if (Thing.Logs) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
								const embed = new Discord.MessageEmbed()
									.setColor(process.env.EMBED_COLOR)
									.setTitle(client.language.SUCCESSEMBED)
									.setDescription(
										`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.KICK[14]}`
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								canal.send({ embeds: [embed] })
							}
						}).catch(() => {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(client.language.SWITCHTHINGS[8])
							return message2.channel.send({ embeds: [errorembed] });
						})
						if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.SWITCHTHINGS[3]
								)
								.setFooter(message2.author.username, message2.author.avatarURL());
							return message2.channel.send({ embeds: [errorembed] })
						}
						let msg = await message2.channel.messages.fetch();
						let data = [];
						let counter = 0;
						msg
							.map((m) => m)
							.forEach((ms) => {
								if (
									ms.author.id == message2.author.id &&
									counter < toDel
								) {
									data.push(ms);
									counter += 1;
								}
							});

						try {
							await message2.channel.bulkDelete(
								data.length ? data : 1,
								true
							);
						} catch (e) {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(client.language.SWITCHTHINGS[3])
							return message2.channel.send({ embeds: [errorembed] });
						}
					});
				} else {
					KickModel.findOne({
						USERID: message2.author.id,
					}).then(async (s, err) => {
						if (s) {
							s.GUILDS.push({
								ID: message2.guild.id,
								KICK_TIMESTAMP: Date.now(),
							});
							s.save().catch(e => console.warn(e));
						} else if (!s) {
							//const role = client2.roles.cache.get("859400100383293470")
							const user2 = new KickModel({
								USERID: message2.author.id,
								GUILDS: {
									ID: message2.guild.id,
									KICK_TIMESTAMP: Date.now(),
								},
							});
							user2.save().catch(e => console.warn(e));
						}
						if (message2.member) message2.member.kick().then(() => {
							if (Thing.Action.NotifyOnChat) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								const embed = new Discord.MessageEmbed()
									.setColor(process.env.EMBED_COLOR)
									.setTitle(client.language.SUCCESSEMBED)
									.setDescription(
										`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.KICK[14]}`
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								message2.channel.send({ embeds: [embed] })
							}
							if (Thing.Logs) {
								if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
								if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
								}
								if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
									return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
								}
								let canal = message2.guild.channels.cache.get(message2.guild.config.LogsChannel)
								const embed = new Discord.MessageEmbed()
									.setColor(process.env.EMBED_COLOR)
									.setTitle(client.language.SUCCESSEMBED)
									.setDescription(
										`${client.language.KICK[13]} \`${message2.author.id}\` ${client.language.KICK[14]}`
									)
									.setFooter(message2.author.username, message2.author.avatarURL());
								canal.send({ embeds: [embed] })
							}
						}).catch(() => {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(client.language.SWITCHTHINGS[8])
							return message2.channel.send({ embeds: [errorembed] });
						})
						if (!message2.channel.permissionsFor(message2.guild.me).has("MANAGE_MESSAGES")) {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.SWITCHTHINGS[3]
								)
								.setFooter(message2.author.username, message2.author.avatarURL());
							return message2.channel.send({ embeds: [errorembed] })
						}
						let msg = await message2.channel.messages.fetch();
						let data = [];
						let counter = 0;
						msg
							.map((m) => m)
							.forEach((ms) => {
								if (
									ms.author.id == message2.author.id &&
									counter < toDel
								) {
									data.push(ms);
									counter += 1;
								}
							});

						try {
							await message2.channel.bulkDelete(
								data.length ? data : 1,
								true
							);
						} catch (e) {
							if (!message2.channel.permissionsFor(message2.guild.me).has("VIEW_CHANNEL")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("SEND_MESSAGES")) return
							if (!message2.channel.permissionsFor(message2.guild.me).has("EMBED_LINKS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
							}
							if (!message2.channel.permissionsFor(message2.guild.me).has("USE_EXTERNAL_EMOJIS")) {
								return message2.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
							}
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(client.language.SWITCHTHINGS[3])
							return message2.channel.send({ embeds: [errorembed] });
						}
					});
				}
			} else {
				console.error("Error SwitchThings Kick");
			}
			break;
	}
};
