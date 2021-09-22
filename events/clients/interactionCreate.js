require("dotenv").config();
const Discord = require("discord.js");
const prefix = process.env.prefix;
const botID = process.env.botID;
const Event = require("../../structures/Event.js");
const UserModel = require("../../models/user.js");
const GuildModel = require("../../models/guild.js");
const axios = require('axios')
const fetch = require('node-fetch')
const moment = require("moment");
const Bottleneck = require("bottleneck");
const backup = require("discord-backup");
const backupModel = require('../../models/backups.js')
const limiter = new Bottleneck({
	maxConcurrent: 2,
	minTime: 1000
})

const limiter2 = new Bottleneck({
	minTime: 1000
});

const flags = {
	DISCORD_EMPLOYEE: "Discord Employee",
	PARTNERED_SERVER_OWNER: "Discord Partner",
	BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
	BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
	HYPESQUAD_EVENTS: "HypeSquad Events",
	HOUSE_BRAVERY: "House of Bravery",
	HOUSE_BRILLIANCE: "House of Brilliance",
	HOUSE_BALANCE: "House of Balance",
	EARLY_SUPPORTER: "Early Supporter",
	TEAM_USER: "Team User",
	SYSTEM: "System",
	VERIFIED_BOT: "Verified Bot",
	EARLY_VERIFIED_BOT_DEVELOPER: "Verified Bot Developer",
	DISCORD_CERTIFIED_MODERATOR: "Discord Certified Moderator"
};

module.exports = class Interaction extends Event {
	constructor(...args) {
		super(...args);
	}
	async run(interaction) {
		let guild = await this.client.guilds.cache.get(interaction.guildId)
		await fetchGuild(this.client, guild).then(async (results, err) => {
			let guild = results[0]
			let s = results[1]
			if (err) return
			if (interaction.commandName == 'Avatar') {
				limiter2.schedule(async () => {
					if (!guild) return
					let member =
						await guild.members.fetch(interaction.targetId).catch(e => {
							return
						});
					let embed = new Discord.MessageEmbed();
					embed.setColor("00ff00");
					embed.setImage(
						member.user.displayAvatarURL({
							dynamic: true,
							size: 4096,
						})
					);
					return this.client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								content: "",
								embeds: [embed]
							}
						}
					})
				})
			} else if (interaction.commandName == 'Hi') {
				limiter2.schedule(async () => {
					if (!guild) return
					let member =
						await guild.members.fetch(interaction.targetId)
					if (!member) {
						const { soyultro } = require("soyultro");
						let author = interaction.member.user.username
						let embed = new Discord.MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
							.setTitle(`${author} ${this.client.language.HI[3]} ${args.join(" ")}`)
							.setColor(process.env.EMBED_COLOR)
							.setImage(soyultro("hi"));
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: "",
									embeds: [embed],
									falgs: 64
								}
							}
						})
					}
					if (member.id == interaction.member.user.id) {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(this.client.language.ERROREMBED)
							.setDescription(this.client.language.HI[1])
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: "",
									embeds: [errorembed],
									falgs: 64
								}
							}
						})
					}
					const { soyultro } = require("soyultro");
					let author = interaction.member.user.username;
					let embed = new Discord.MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
						.setTitle(`${author} ${this.client.language.HI[3]} ${member.user.username}`)
						.setColor(process.env.EMBED_COLOR)
						.setImage(soyultro("hi"));
					return this.client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								content: "",
								embeds: [embed]
							}
						}
					})
				})
			} else if (interaction.commandName == 'Kiss') {
				limiter2.schedule(async () => {
					if (!guild) return
					let member =
						await guild.members.fetch(interaction.targetId).catch(e => {
							return
						});

					if (!member) return
					if (member.id == interaction.member.user.id) {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(this.client.language.ERROREMBED)
							.setDescription(this.client.language.KISS[1])
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: "",
									embeds: [errorembed],
									falgs: 64
								}
							}
						})
					}
					const { soyultro } = require("soyultro");
					let embed = new Discord.MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
						.setTitle(`${interaction.member.user.username} ${this.client.language.KISS[3]} ${member.user.username}`)
						.setColor(process.env.EMBED_COLOR)
						.setImage(soyultro("kiss"));
					return this.client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								content: "",
								embeds: [embed]
							}
						}
					})
				})
			} else if (interaction.commandName == 'Love') {
				limiter2.schedule(async () => {
					if (!guild) return
					let member =
						await guild.members.fetch(interaction.targetId).catch(e => {
							return
						});
					if (member.user.id == interaction.member.user.id) {
						let embed = new Discord.MessageEmbed()
							.setTimestamp(" ")
							.setColor("RED")
							.setFooter(
								this.client.language.LOVE[2]
							);
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: "",
									embeds: [embed],
									falgs: 64
								}
							}
						})
					}
					if (member.user.id == this.client.user.id) {
						let embed = new Discord.MessageEmbed()
							.setTimestamp(" ")
							.setColor("RED")
							.setFooter(
								this.client.language.LOVE[3]
							);
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: "",
									embeds: [embed],
									falgs: 64
								}
							}
						})
					}

					const random = Math.floor(Math.random() * 100);
					let emoji = "";
					if (random < 50) {
						emoji = "<a:331263527c8547b29dc5d4c1ccca311b:835912709605949541>";
					} else if (random < 80) {
						emoji = "<a:239cb599aefe44e38294b04b3d86aec5:835912603528069132> "; // Un pequeño Match.Floor para hacerlo random y no de el mismo resultado!
					} else if (random < 101) {
						emoji = "<a:pog:835912234201907220>";
					}
					const { soyultro } = require("soyultro");
					let resp = [
						this.client.language.LOVE[4] +
						`${interaction.member.user.username} & ${member.user.username}` +
						this.client.language.LOVE[5],
						this.client.language.LOVE[6] +
						`${interaction.member.user.username} & ${member.user.username}` +
						this.client.language.LOVE[7],
					];
					let msg = resp[Math.floor(Math.random() * resp.length)];
					const embed = new Discord.MessageEmbed()
						.setAuthor(`${msg}`)
						.setDescription(`${emoji} ${random}% ${emoji}`) //Resultado aleatorio de lo anterior estructurado
						.setColor(process.env.EMBED_COLOR)
						.setImage(soyultro("love"));
					return this.client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								content: "",
								embeds: [embed]
							}
						}
					})
				})
			} else if (interaction.commandName == 'UserInfo') {
				limiter2.schedule(async () => {
					if (!guild) return
					let member =
						await guild.members.fetch(interaction.targetId).catch(e => {
							return
						});
					let User = member.user
					UserModel.findOne({
						USERID: interaction.targetId.toString()
					}).then(async (s, err) => {
						if (err) {
							client.err(err);
						}
						if (s) {
							if (s.BANNED) return;
							User._id = s._id
							User.VOTED = s.VOTED;
							User.ROLES = s.Roles
							User.LANG = s.LANG
							User.COMMANDS_EXECUTED = s.COMMANDS_EXECUTED
							User.PREMIUM = s.Roles ? s.Roles.Premium.Enabled : false;
							User.BANNED = s.BANNED;
							User.DEV = s.Roles ? s.Roles.Developer.Enabled : false;
							User.TESTER = s.Roles ? s.Roles.Tester.Enabled : false;
							User.PREMIUM_COMMANDS = s.PREMIUM_COMMANDS;
							User.INTERACCIONES = s.Interacciones ? s.Interacciones : "none";
							User.isINDB = true;
							User.OLDMODE = s.OLDMODE;
							if (!User.TESTER && member.roles.cache.has("835835433082028062")) {
								User.TESTER = true
								s.Roles.Tester = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.ROLES.Notifications.Enabled && member.roles.cache.has("845037268330741760")) {
								User.ROLES.Notifications.Enabled = true
								s.Roles.Notifications = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.ROLES.Booster.Enabled && member.roles.cache.has("850530981349687296")) {
								User.ROLES.Booster.Enabled = true
								s.Roles.Booster = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.ROLES.Support.Enabled && member.roles.cache.has("834461420165922817")) {
								User.ROLES.Support.Enabled = true
								s.Roles.Support = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.PREMIUM && member.roles.cache.has("834461423060123688")) {
								User.PREMIUM = true
								s.Roles.Premium = {
									Enabled: true,
									Date: Date.now()
								}
								if (Date.now() < 1630447201000) {
									User.ROLES.EarlyPremium.Enabled = true
									s.Roles.EarlyPremium = {
										Enabled: true,
										Date: Date.now()
									}
								}
							}
							s.save().catch((err) => s.update());
						} else {
							User.COMMANDS_EXECUTED = 0;
							User.VOTED = false;
							User.PREMIUM = false;
							User.ROLES = {
								Premium: {
									Enabled: false
								},
								EarlyPremium: {
									Enabled: false
								},
								Tester: {
									Enabled: false
								},
								Notifications: {
									Enabled: false
								},
								Developer: {
									Enabled: false
								},
								Booster: {
									Enabled: false
								},
								Support: {
									Enabled: false
								}
							},
								User.BANNED = false;
							User.DEV = false;
							User.LANG = 'es_ES'
							User.TESTER = false;
							User.PREMIUM_COMMANDS = [];
							User.isINDB = true;
							User.OLDMODE = false;
							if (!User.TESTER && member.roles.cache.has("835835433082028062")) {
								User.TESTER = true
							}
							if (!User.PREMIUM && member.roles.cache.has("834461423060123688")) {
								User.PREMIUM = true
								if (Date.now() < 1630447201000) {
									User.ROLES.EarlyPremium.Enabled = true
								}
							}
							if (!User.ROLES.Notifications.Enabled && member.roles.cache.has("845037268330741760")) {
								User.ROLES.Notifications.Enabled = true
							}
							if (!User.ROLES.Booster.Enabled && member.roles.cache.has("850530981349687296")) {
								User.ROLES.Booster.Enabled = true
							}
							if (!User.ROLES.Support.Enabled && member.roles.cache.has("834461420165922817")) {
								User.ROLES.Support.Enabled = true
							}
						}
						let emblemas = member.user.ROLES;
						let badges = [];
						const roles = member.roles.cache
							.sort((a, b) => b.position - a.position)
							.map((role) => role.toString())
							.slice(0, -1);
						const userFlags = member.user.flags.toArray();
						const embed = new Discord.MessageEmbed().setTimestamp(" ");
						if (member.user.displayAvatarURL())
							embed.setThumbnail(
								member.user.displayAvatarURL({
									dynamic: true,
								})
							);
						if (guild.name)
							embed.setAuthor(
								guild.name,
								guild.iconURL({
									dynamic: true,
								})
							);
						if (guild.bannerURL())
							embed.setImage(
								guild.bannerURL({
									dynamic: true,
								})
							);
						if (member.displayHexColor && member.displayHexColor != '#000000') {
							embed.setColor(member.displayHexColor);
						} else {
							embed.setColor(process.env.EMBED_COLOR);
						}
						if (member.user && member.user.username)
							embed.addField(
								`<:serverowner:863983092930183169> ${this.client.language.USERINFO[1]}`,
								"```" + `${member.user.username}` + "```"
							);
						if (member.user && member.user.discriminator)
							embed.addField(
								"<:textchannelblurple:863983092893220885> " +
								this.client.language.USERINFO[2],
								"```" + `${member.user.discriminator}` + "```",
								true
							);
						if (member.id)
							embed.addField(
								`<:settings:864103218828017694> ${this.client.language.USERINFO[3]}`,
								"```" + `${member.id}` + "```",
								true
							);
						if (userFlags)
							embed.addField(
								`<:ticketblurple:863983092783382548> ${this.client.language.USERINFO[11]}`,
								"```" +
								`${userFlags.length
									? userFlags.map((flag) => flags[flag]).join(", ")
									: this.client.language.USERINFO[8]
								}` +
								"```",
								true
							);
						if (member.user && member.user.createdTimestamp)
							embed.addField(
								`📆 ${this.client.language.USERINFO[5]}`,
								"```" +
								`${moment(member.user.createdTimestamp).format("LT")}\n${moment(
									member.user.createdTimestamp
								).format("LL")}\n${moment(
									member.user.createdTimestamp
								).fromNow()}` +
								"```",
								true
							);
						if (member.user && member.user.presence && member.user.presence.game)
							embed.addField(
								`<:screenshare:864126217941942353> ${this.client.language.USERINFO[12]}`,
								"```" +
								`${member.user.presence.game || this.client.language.USERINFO[16]}` +
								"```",
								true
							);
						if (member.roles && member.roles.highest.id && member.roles.highest.name)
							embed.addField(
								`<:upvote:864107632411541514> ${this.client.language.USERINFO[13]}`,
								"```" +
								`${member.roles.highest.id === guild.id
									? this.client.language.USERINFO[8]
									: member.roles.highest.name
								}` +
								"```",
								true
							);
						if (member.joinedAt)
							embed.addField(
								"<:join:864104115076595762>" + this.client.language.USERINFO[4],
								"```" + `${moment(member.joinedAt).format("LL LTS")}` + "```",
								true
							);
						if (member.roles)
							embed.addField(
								`<:lupablurple:863983093030060062>${this.client.language.USERINFO[14]}`,
								`${member.roles.hoist
									? member.roles.hoist
									: this.client.language.USERINFO[8]
								}`,
								true
							);
						if (member.user.displayAvatarURL())
							embed.addField(
								"<:linkblurple:863983092711817247> Avatar",
								`[${this.client.language.USERINFO[15]}](${member.user.displayAvatarURL({
									dynamic: true,
								})})`,
								true
							);
						if (emblemas && emblemas.Premium.Enabled)
							badges.push("<a:premium:866135287258939393>");
						if (emblemas && emblemas.EarlyPremium.Enabled)
							badges.push("<a:earlypremium:866135322886012978>");
						if (emblemas && emblemas.Tester.Enabled)
							badges.push("<:tester:871395085017813002>");
						if (emblemas && emblemas.Notifications.Enabled)
							badges.push("<:notifications:864103839266897951>");
						if (emblemas && emblemas.Developer.Enabled)
							badges.push("<:developer:866134938185367552>");
						if (emblemas && emblemas.Booster.Enabled)
							badges.push("<:serverbooster:864102069728313354>");
						if (emblemas && emblemas.Support.Enabled)
							badges.push("<:support:863983092702904350>");
						embed.addField(
							this.client.language.USERINFO[18],
							`${badges.length > 0 ? badges.join(" ") : this.client.language.USERINFO[8]}`,
							true
						);
						if (roles[0])
							embed.addField(
								`<:star:864103299900243970> Roles [${roles.length}]`,
								`${roles.length < 10
									? roles.join(" ")
									: roles.length > 10
										? trimArray(roles)
										: this.client.language.USERINFO[8]
								}`
							);

						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: "",
									embeds: [embed]
								}
							}
						})
					});
				})
			} else if (interaction.commandName == 'config') {
				if (!guild) return
				if (!interaction.member.permissions.has('ADMINISTRATOR')) return
				limiter2.schedule(async () => {
					switch (interaction.options._group) {
						case 'automod':
							switch (interaction.options._subcommand) {
								case 'mutedrole':
									let role = interaction.options._hoistedOptions[0].value
									s.config.MutedRole = role
									guild.config.MutedRole = role
									s.save().catch(e => console.log(e)).then(() => {
										interaction.reply({ content: 'Se ha seleccionado el rol <@&' + role + '> como rol para los silencios.', ephemeral: true })
									})
									break
								case 'antiflood':
									if (!s.config.FloodDetection.Filter) {
										s.config.FloodDetection.Filter = {
											Messages: interaction.options._hoistedOptions[0].value,
											Seconds: interaction.options._hoistedOptions[1].value
										}
										guild.config.FloodDetection.Filter = {
											Messages: interaction.options._hoistedOptions[0].value,
											Seconds: interaction.options._hoistedOptions[1].value
										}
										s.save().catch(e => console.log(e)).then(() => {
											interaction.reply({ content: `Se ha ajustado el filtro tal que no se podrán enviar más de ${interaction.options._hoistedOptions[0].value} mensajes en ${interaction.options._hoistedOptions[1].value} segundos.`, ephemeral: true })
										})
										return
									}
									s.config.FloodDetection.Filter.Messages = interaction.options._hoistedOptions[0].value
									s.config.FloodDetection.Filter.Seconds = interaction.options._hoistedOptions[1].value
									guild.config.FloodDetection.Filter.Messages = interaction.options._hoistedOptions[0].value
									guild.config.FloodDetection.Filter.Seconds = interaction.options._hoistedOptions[1].value
									s.save().catch(e => console.log(e)).then(() => {
										interaction.reply({ content: `Se ha ajustado el filtro tal que no se podrán enviar más de ${interaction.options._hoistedOptions[0].value} mensajes en ${interaction.options._hoistedOptions[1].value} segundos.`, ephemeral: true })
									})
									break
								case 'action':
									switch (interaction.options._hoistedOptions[0].value) {
										case 'antiphishing':
											s.config.PhishingDetection.Action.Todo = interaction.options._hoistedOptions[1].value
											guild.config.PhishingDetection.Action.Todo = interaction.options._hoistedOptions[1].value
											for (let index in interaction.options._hoistedOptions) {
												if (interaction.options._hoistedOptions[index].name == 'notify') {
													s.config.PhishingDetection.Action.NotifyOnChat = interaction.options._hoistedOptions[index].value
													guild.config.PhishingDetection.Action.NotifyOnChat = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'adminbypass') {
													s.config.PhishingDetection.AdminBypass = interaction.options._hoistedOptions[index].value
													guild.config.PhishingDetection.AdminBypass = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'botsbypass') {
													s.config.PhishingDetection.Bots = interaction.options._hoistedOptions[index].value
													guild.config.PhishingDetection.Bots = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'time') {
													if (s.config.PhishingDetection.Action.Mute) {
														s.config.PhishingDetection.Action.Mute.Time = interaction.options._hoistedOptions[index].value
													} else {
														s.config.PhishingDetection.Action.Mute = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
													if (s.config.PhishingDetection.Action.Ban) {
														s.config.PhishingDetection.Action.Ban.Time = interaction.options._hoistedOptions[index].value
													} else {
														s.config.PhishingDetection.Action.Ban = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
													if (guild.config.PhishingDetection.Action.Mute) {
														guild.config.PhishingDetection.Action.Mute.Time = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.PhishingDetection.Action.Mute = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
													if (guild.config.PhishingDetection.Action.Ban) {
														guild.config.PhishingDetection.Action.Ban.Time = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.PhishingDetection.Action.Ban = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
												}
												if (interaction.options._hoistedOptions[index].name == 'infinite') {
													if (s.config.PhishingDetection.Action.Mute) {
														s.config.PhishingDetection.Action.Mute.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														s.config.PhishingDetection.Action.Mute = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}
													if (s.config.PhishingDetection.Action.Ban) {
														s.config.PhishingDetection.Action.Ban.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														s.config.PhishingDetection.Action.Ban = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}

													if (guild.config.PhishingDetection.Action.Mute) {
														guild.config.PhishingDetection.Action.Mute.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.PhishingDetection.Action.Mute = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}
													if (guild.config.PhishingDetection.Action.Ban) {
														guild.config.PhishingDetection.Action.Ban.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.PhishingDetection.Action.Ban = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}
												}
												if (interaction.options._hoistedOptions[index].name == 'logs') {
													s.config.PhishingDetection.Logs = interaction.options._hoistedOptions[index].value
													guild.config.PhishingDetection.Logs = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'status') {
													s.config.PhishingDetection.Enabled = interaction.options._hoistedOptions[index].value
													guild.config.PhishingDetection.Enabled = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'reason') {
													if (s.config.PhishingDetection.Action.Mute) {
														s.config.PhishingDetection.Action.Mute.Reason = interaction.options._hoistedOptions[index].value
													} else {
														s.config.PhishingDetection.Action.Mute = {
															Reason: interaction.options._hoistedOptions[index].value
														}
													}
													
													if (s.config.PhishingDetection.Action.Ban) {
														s.config.PhishingDetection.Action.Ban.Reason = interaction.options._hoistedOptions[index].value
													} else {
														s.config.PhishingDetection.Action.Ban = {
															Reason: interaction.options._hoistedOptions[index].value
														}
													}

													if (s.config.PhishingDetection.Action.Kick) {
														s.config.PhishingDetection.Action.Kick.Reason = interaction.options._hoistedOptions[index].value
													} else {
														s.config.PhishingDetection.Action.Kick = {
															Reason: interaction.options._hoistedOptions[index].value
														}
													}

													guild.config.PhishingDetection.Action.Mute ? guild.config.PhishingDetection.Action.Mute.Reason = interaction.options._hoistedOptions[index].value : guild.config.PhishingDetection.Action.Mute = {
														Reason: interaction.options._hoistedOptions[index].value
													}
													
													guild.config.PhishingDetection.Action.Ban ? guild.config.PhishingDetection.Action.Ban.Reason = interaction.options._hoistedOptions[index].value : guild.config.PhishingDetection.Action.Ban = {
														Reason: interaction.options._hoistedOptions[index].value
													}
													guild.config.PhishingDetection.Action.Kick ? guild.config.PhishingDetection.Action.Kick.Reason = interaction.options._hoistedOptions[index].value : guild.config.PhishingDetection.Action.Kick = {
														Reason: interaction.options._hoistedOptions[index].value
													}
												}
											}

											s.save().catch(e => console.log(e)).then(() => {
												interaction.reply({ content: 'Se ejecutará la acción ' + interaction.options._hoistedOptions[1].value + ' cuando se supere el límite del filtro de AntiFlood.', ephemeral: true })
											})
											break
										case 'antiflood':
											if (!s.config.FloodDetection.Filter) return interaction.reply({ content: 'Antes de ajustar los parámetros del antiflood debes de personalizar el filtro en \`/config automod antiflood\`.', ephemeral: true })
											s.config.FloodDetection.Action.Todo = interaction.options._hoistedOptions[1].value
											guild.config.FloodDetection.Action.Todo = interaction.options._hoistedOptions[1].value
											for (let index in interaction.options._hoistedOptions) {
												if (interaction.options._hoistedOptions[index].name == 'notify') {
													s.config.FloodDetection.Action.NotifyOnChat = interaction.options._hoistedOptions[index].value
													guild.config.FloodDetection.Action.NotifyOnChat = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'adminbypass') {
													s.config.FloodDetection.AdminBypass = interaction.options._hoistedOptions[index].value
													guild.config.FloodDetection.AdminBypass = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'botsbypass') {
													s.config.FloodDetection.Bots = interaction.options._hoistedOptions[index].value
													guild.config.FloodDetection.Bots = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'time') {
													if (s.config.FloodDetection.Action.Mute) {
														s.config.FloodDetection.Action.Mute.Time = interaction.options._hoistedOptions[index].value
													} else {
														s.config.FloodDetection.Action.Mute = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
													if (s.config.FloodDetection.Action.Ban) {
														s.config.FloodDetection.Action.Ban.Time = interaction.options._hoistedOptions[index].value
													} else {
														s.config.FloodDetection.Action.Ban = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
													if (guild.config.FloodDetection.Action.Mute) {
														guild.config.FloodDetection.Action.Mute.Time = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.FloodDetection.Action.Mute = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
													if (guild.config.FloodDetection.Action.Ban) {
														guild.config.FloodDetection.Action.Ban.Time = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.FloodDetection.Action.Ban = {
															Time: interaction.options._hoistedOptions[index].value
														}
													}
												}
												if (interaction.options._hoistedOptions[index].name == 'infinite') {
													if (s.config.FloodDetection.Action.Mute) {
														s.config.FloodDetection.Action.Mute.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														s.config.FloodDetection.Action.Mute = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}
													if (s.config.FloodDetection.Action.Ban) {
														s.config.FloodDetection.Action.Ban.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														s.config.FloodDetection.Action.Ban = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}

													if (guild.config.FloodDetection.Action.Mute) {
														guild.config.FloodDetection.Action.Mute.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.FloodDetection.Action.Mute = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}
													if (guild.config.FloodDetection.Action.Ban) {
														guild.config.FloodDetection.Action.Ban.Infinite = interaction.options._hoistedOptions[index].value
													} else {
														guild.config.FloodDetection.Action.Ban = {
															Infinite: interaction.options._hoistedOptions[index].value
														}
													}
												}
												if (interaction.options._hoistedOptions[index].name == 'logs') {
													s.config.FloodDetection.Logs = interaction.options._hoistedOptions[index].value
													guild.config.FloodDetection.Logs = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'status') {
													s.config.FloodDetection.Enabled = interaction.options._hoistedOptions[index].value
													guild.config.FloodDetection.Enabled = interaction.options._hoistedOptions[index].value
												}
												if (interaction.options._hoistedOptions[index].name == 'reason') {
													if (s.config.FloodDetection.Action.Mute) {
														s.config.FloodDetection.Action.Mute.Reason = interaction.options._hoistedOptions[index].value
													} else {
														s.config.FloodDetection.Action.Mute = {
															Reason: interaction.options._hoistedOptions[index].value
														}
													}
													
													if (s.config.FloodDetection.Action.Ban) {
														s.config.FloodDetection.Action.Ban.Reason = interaction.options._hoistedOptions[index].value
													} else {
														s.config.FloodDetection.Action.Ban = {
															Reason: interaction.options._hoistedOptions[index].value
														}
													}

													if (s.config.FloodDetection.Action.Kick) {
														s.config.FloodDetection.Action.Kick.Reason = interaction.options._hoistedOptions[index].value
													} else {
														s.config.FloodDetection.Action.Kick = {
															Reason: interaction.options._hoistedOptions[index].value
														}
													}

													guild.config.FloodDetection.Action.Mute ? guild.config.FloodDetection.Action.Mute.Reason = interaction.options._hoistedOptions[index].value : guild.config.FloodDetection.Action.Mute = {
														Reason: interaction.options._hoistedOptions[index].value
													}
													
													guild.config.FloodDetection.Action.Ban ? guild.config.FloodDetection.Action.Ban.Reason = interaction.options._hoistedOptions[index].value : guild.config.FloodDetection.Action.Ban = {
														Reason: interaction.options._hoistedOptions[index].value
													}
													guild.config.FloodDetection.Action.Kick ? guild.config.FloodDetection.Action.Kick.Reason = interaction.options._hoistedOptions[index].value : guild.config.FloodDetection.Action.Kick = {
														Reason: interaction.options._hoistedOptions[index].value
													}
												}
											}

											s.save().catch(e => console.log(e)).then(() => {
												interaction.reply({ content: 'Se ejecutará la acción ' + interaction.options._hoistedOptions[1].value + ' cuando se supere el límite del filtro de AntiFlood.', ephemeral: true })
											})
											break
									}
							}
							break
						case 'logs':
							switch (interaction.options._subcommand) {
								case 'channel':
									if (interaction.options._hoistedOptions[0].channel.type == 'GUILD_TEXT') {
										s.config.LogsChannel = interaction.options._hoistedOptions[0].value
										guild.config.LogsChannel = interaction.options._hoistedOptions[0].value
										s.save().catch(e => console.log(e))
										interaction.reply({ content: 'El canal <#' + interaction.options._hoistedOptions[0].value + '> se ha seleccionado como el canal de logs.', ephemeral: true })
									}
									break
							}
							break
						case 'pvc':
							switch (interaction.options._subcommand) {
								case 'startingchannel':
									if (interaction.options._hoistedOptions[0].channel.type == 'GUILD_VOICE') {
										if (!s.config.Pvc) {
											s.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													StartingChannel: interaction.options._hoistedOptions[0].value
												}
											}
											guild.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													StartingChannel: interaction.options._hoistedOptions[0].value
												}
											}
										} else {
											s.config.Pvc.StartingChannel = interaction.options._hoistedOptions[0].value
											guild.config.Pvc.StartingChannel = interaction.options._hoistedOptions[0].value
										}
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has seleccionado el canal <#" + interaction.options._hoistedOptions[0].value + "> como canal principal para la creación de los canales privados de voz.",
													flags: 64
												}
											}
										})
									} else {
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "El canal seleccionado no es válido. Debes de seleccionar un canal de voz.",
													flags: 64
												}
											}
										})
									}
								case 'category':
									if (interaction.options._hoistedOptions[0].channel.type == 'GUILD_CATEGORY') {
										if (!s.config.Pvc) {
											s.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													Category: interaction.options._hoistedOptions[0].value
												}
											}
											guild.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													Category: interaction.options._hoistedOptions[0].value
												}
											}
										} else {
											s.config.Pvc.Category = interaction.options._hoistedOptions[0].value
											guild.config.Pvc.Category = interaction.options._hoistedOptions[0].value
										}
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has seleccionado la categoría <#" + interaction.options._hoistedOptions[0].value + "> como la categoría principal donde se crearán los canales privados de voz.",
													flags: 64
												}
											}
										})
									} else {
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "La categoría seleccionada no es válida. Debes de seleccionar una categoría.",
													flags: 64
												}
											}
										})
									}
								case 'mode':
									if (interaction.options._hoistedOptions[0].value == true) {
										if (!s.config.Pvc) {
											const embed = new Discord.MessageEmbed()
												.setColor("RED")
												.setTitle(this.client.language.ERROREMBED)
												.setDescription(
													`Antes de iniciar los canales de voz privados debes de configurar el canal y la categoría. Usa \`/config pvc canalprincipal\` y \`/config pvc categoria\` para ello.`
												)
											return this.client.api.interactions(interaction.id, interaction.token).callback.post({
												data: {
													type: 4,
													data: {
														embeds: [embed],
														flags: 64
													}
												}
											})
										}
										if (!s.config.Pvc.Category) {
											const embed = new Discord.MessageEmbed()
												.setColor("RED")
												.setTitle(this.client.language.ERROREMBED)
												.setDescription(
													`No has configurado la categoría donde se crearán los canales de voz privados. Usa \`/config pvc categoría\` para seleccionarla.`
												)
											return this.client.api.interactions(interaction.id, interaction.token).callback.post({
												data: {
													type: 4,
													data: {
														embeds: [embed],
														flags: 64
													}
												}
											})
										} else if (!s.config.Pvc.StartingChannel) {
											const embed = new Discord.MessageEmbed()
												.setColor("RED")
												.setTitle(this.client.language.ERROREMBED)
												.setDescription(
													`No has configurado el canal donde los usuarios se unirán para crear los canales de voz privados. Usa \`/config pvc canalprincipal\` para seleccionarla.`
												)
											return this.client.api.interactions(interaction.id, interaction.token).callback.post({
												data: {
													type: 4,
													data: {
														embeds: [embed],
														flags: 64
													}
												}
											})
										} else if (!(s.Creado < 1629381609000) && !s.REFERED && !s.Partner) {
											const embed = new Discord.MessageEmbed()
												.setColor("RED")
												.setTitle(this.client.language.ERROREMBED)
												.setDescription(
													`No has participado en el evento de los 25.000 servidores. Para participar debes de canjear un código previamente creado o crear uno usando \`.code generate\` y luego usar \`.code redeem (código)\`.`
												)
											return this.client.api.interactions(interaction.id, interaction.token).callback.post({
												data: {
													type: 4,
													data: {
														embeds: [embed],
														flags: 64
													}
												}
											})
										}
										if (!s.config.Pvc) {
											s.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													Enabled: true
												}
											}
											guild.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													Enabled: true
												}
											}
										} else {
											s.config.Pvc.Enabled = true
											guild.config.Pvc.Enabled = true
										}
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has activado los canales privados de voz. Los canales se crearán en la categoría <#" + s.config.Pvc.Category + ">. Para empezar entra en <#" + s.config.Pvc.StartingChannel + ">.",
													flags: 64
												}
											}
										})
									} else {
										if (!s.config.Pvc) {
											s.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													Enabled: false
												}
											}
											guild.config = {
												FloodDetection: s.config.FloodDetection,
												PhishingDetection: s.config.PhishingDetection,
												tos: s.config.tos,
												spam: s.config.spam,
												CHANNELID: s.config.CHANNELID,
												DISABLED_COMMANDS: s.config.DISABLED_COMMANDS,
												DISABLED_CATEGORIES: s.config.DISABLED_CATEGORIES,
												MUSIC_CHANNELS: s.config.MUSIC_CHANNELS,
												Pvc: {
													Enabled: false
												}
											}
										} else {
											s.config.Pvc.Enabled = false
											guild.config.Pvc.Enabled = false
										}
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has desactivado los canales privados de voz.",
													flags: 64
												}
											}
										})
									}
							}
							break
						case 'modes':
							switch (interaction.options._subcommand) {
								case 'tosmode':
									if (interaction.options._hoistedOptions[0].value == true) {
										s.config.tos = true
										guild.config.tos = true
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has habilitado los comandos al límite de los términos de conducta de Discord.",
													flags: 64
												}
											}
										})
									} else {
										s.config.tos = false
										guild.config.tos = false
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has deshabilitado los comandos al límite de los términos de conducta de Discord.",
													flags: 64
												}
											}
										})
									}
								case 'spammode':
									if (interaction.options._hoistedOptions[0].value == true) {
										s.config.spam = true
										guild.config.spam = true
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has habilitado el modo de publicidad indirecta.",
													flags: 64
												}
											}
										})
									} else {
										s.config.spam = false
										guild.config.spam = false
										s.save().catch(e => console.warn(e))
										return this.client.api.interactions(interaction.id, interaction.token).callback.post({
											data: {
												type: 4,
												data: {
													content: "Has deshabilitado el modo de publicidad indirecta.",
													flags: 64
												}
											}
										})
									}
							}
							break
					}
				})
			} else if (interaction.commandName == 'fnprofile') {
				let user = interaction.options._hoistedOptions[0].value
				await interaction.reply({ content: this.client.language.FNPROFILE[11] });
				limiter.schedule(async () => {
					return axios({
						method: 'get',
						url: `https://fortnite-api.com/v2/stats/br/v2?name=${user}&image=all`,
						timeout: 3000, // only wait for 2s
						headers: {
							"TRN-API-KEY": process.env.trnAPIKey
						}
					})
				}).then(async result => {
					return await interaction.editReply({ content: " ", files: [result.data.data.image] })
				}).catch(e => {
					return interaction.editReply({ content: this.client.language.FNPROFILE[10] })
				})
			} else if (interaction.commandName == 'twitch') {
				switch (interaction.options._subcommand) {
					case "mode":
						console.log('Subcomando mode')
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: 'Has ejecutado el subcomando mode del slash command Twitch',
									flags: 64
								}
							}
						})
					case "add":
						console.log('Subcomando add')
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: 'Has ejecutado el subcomando ad del slash command Twitch',
									flags: 64
								}
							}
						})
					case "set":
						console.log('Subcomando Set')
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: 'Has ejecutado el subcomando Set del slash command Twitch',
									flags: 64
								}
							}
						})
					case "delete":
						console.log('Subcomando delete')
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: 'Has ejecutado el subcomando delete del slash command Twitch',
									flags: 64
								}
							}
						})
					case "list":
						console.log('Subcomando list')
						return this.client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									content: 'Has ejecutado el subcomando list del slash command Twitch',
									flags: 64
								}
							}
						})
				}
			} else if (interaction.commandName == 'backup') {
				backupModel.findOne({guildId: interaction.guildId.toString()}).then((bck, err) => {
					if (err) console.log(err)
					switch (interaction.options._subcommand) {
						case "create":
							if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Este comando es solo para administradores.', ephemeral: true })
							interaction.reply({ content: 'Creando la copia de seguridad...', ephemeral: true }).then(async () => {
								limiter.schedule(async () => {
									backup.create(guild, {
										maxMessagesPerChannel: interaction.options._hoistedOptions[0].value,
										jsonSave: true,
										jsonBeautify: false,
										saveImages: "url",
										backupID: interaction.options._hoistedOptions[1] ? interaction.options._hoistedOptions[1].value : null
									}).then(async (backup) => {
										if (bck) {
											bck.lastBackup = Math.trunc(Date.now() / 1000)
											bck.backups.push(backup.id)
											bck.save().catch(e => console.log(e))
										} else {
											const newBackupModel = new backupModel({
												lastBackup: Math.trunc(Date.now() / 1000),
												guildId: interaction.guildId.toString(),
												backups: [backup.id]
											})
											newBackupModel.save().catch(e => console.log(e))
										}
										interaction.editReply({ content: 'Tu copia de seguridad se ha creado con el identificador \`' + backup.id + '\`', ephemeral: true })
									}).catch(e => {
										if (e == 'Ese ID ya existe.') {
											interaction.editReply({ content: 'Ya existe una copia de seguridad con el identificador \`' + interaction.options._hoistedOptions[1].value + '\`. Por favor elige un nuevo identificador.', ephemeral: true })
										} else {
											console.log(e)
										}
									})
								})
							})
							break;
						case "delete":
							if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Este comando es solo para administradores.', ephemeral: true })
							if (bck) {
								backup.remove(interaction.options._hoistedOptions[0].value)
								bck.backups.splice(bck.backups.indexOf(interaction.options._hoistedOptions[0].value), bck.backups.indexOf(interaction.options._hoistedOptions[0].value) + 1);
								bck.save().catch(e => console.log(e))
								this.client.api.interactions(interaction.id, interaction.token).callback.post({
									data: {
										type: 4,
										data: {
											content: 'Has eliminado la copia de seguridad.',
											flags: 64
										}
									}
								})
							} else {
								return interaction.reply({ content: 'No existe ninguna copia de seguridad para este servidor.', ephemeral: true})
							}
							break;
						case "stats":
							if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Este comando es solo para administradores.', ephemeral: true })
							interaction.reply({ content: 'Obteniendo estadísticas...', ephemeral: true })
							if (bck) {
								if (bck.backups.indexOf(interaction.options._hoistedOptions[0].value) == -1) return interaction.editReply({content: "No existe esa copia de seguridad.", ephemeral: true})
								backup.fetch(interaction.options._hoistedOptions[0].value).then((backupInfos) => {
									const embed = new Discord.MessageEmbed()
										.setColor(process.env.EMBED_COLOR)
										.addField('ID', backupInfos.id)
										.addField('Peso', backupInfos.size + 'kb')
										.setFooter('He consoleado toda la información disponible.')
									interaction.editReply({ content: ' ', embeds: [embed], ephemeral: true })
								}).catch(e => {
									const errorembed = new Discord.MessageEmbed()
										.setColor("RED")
										.setTitle(this.client.language.ERROREMBED)
										.setDescription(
											'No he podido encontrar esa backup.'
										)
									interaction.editReply({ content: ' ', embeds: [errorembed], ephemeral: true })
								})
							} else {
								return interaction.editReply({content: "No existe ninguna copia de seguridad para este servidor.", ephemeral: true})
							}
							break;
						case "list":
							if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Este comando es solo para administradores.', ephemeral: true })
							interaction.reply({content: 'Obteniendo copias de seguridad...', ephemeral: true})
							if (bck && bck.backups.length > 0) {
								console.log(bck)
								const embed = new Discord.MessageEmbed()
								.setColor(process.env.EMBED_COLOR)
								.setTitle('Identificadores')
								.setThumbnail(guild.iconURL({ dynamic: true }))
								.setFooter('Las copias de seguridad están ordenadas de más antiguas a más recientes.')
								for (let index in bck.backups) {
									embed.addField(`nº ${index}`, '**ID: **' + bck.backups[index])
								}
								interaction.editReply({content: " ", embeds: [embed], ephemeral: true})
							} else {
								return interaction.editReply({content: "No existe ninguna copia de seguridad para este servidor.", ephemeral: true})
							}
							break;
						case "load":
							if (!bck ) return interaction.reply({ content: 'No dispones de ninguna copia de seguridad para este servidor.', ephemeral: true })
							if ((parseInt(bck.lastUsedBackup) + 86400) > Math.trunc(Date.now() / 1000)) return interaction.reply({ content: 'Solo puedes usar una backup cada 24 horas por limitaciones en la API de Discord.', ephemeral: true })
							bck.lastUsedBackup = Math.trunc(Date.now() / 1000)
							interaction.reply({ content: 'Cargando la copia de seguridad...', ephemeral: true })
							if (interaction.member.user.id != interaction.member.guild.ownerId) return interaction.editReply({ content: 'El creador del servidor es el único que puede cargar una backup.', ephemeral: true })
							if (bck && bck.backups.length > 0) {
								if (bck.backups.indexOf(interaction.options._hoistedOptions[0].value) != -1) {
									interaction.member.guild.loadingBackup = true
									backup.load(interaction.options._hoistedOptions[0].value, guild, {
										clearGuildBeforeRestore: true
									}).catch(e => {
										console.log(e)
									})
								}
							} else {
								return interaction.editReply({ content: 'Esa copia de seguridad no existe.', ephemeral: true})
							}
							break;
					}
				})
			}
		})
	}
};

function trimArray(arr, maxLen = 10) {
	if (arr.length > maxLen) {
		const len = arr.length - maxLen;
		arr = arr.slice(0, maxLen);
		arr.push(`${len} more...`);
	}
	return arr;
}

async function fetchGuild(client2, guild) {
	return await new Promise((resolve, reject) => {
		GuildModel.findOne({
			guildID: guild.id.toString()
		}).then((s, err) => {
			if (err) reject(err)
			if (s) {
				guild.prefix = s.PREFIX;
				guild.creado = s.CREADO;
				guild.isINDB = true;
				guild.config = s.config
				guild.refered = s.REFERED;
				guild.partner = s.Partner;
				guild.last_timestamp = s.LAST_TIMESTAMP;
				s.save().catch((err) => s.update());
				resolve([guild, s])
			}
		});
	})
}