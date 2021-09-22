require("dotenv").config();
const Discord = require("discord.js");
const fs = require('fs');
const prefix = process.env.prefix;
const botID = process.env.botID;
const Event = require("../../structures/Event.js");
const UserModel = require("../../models/user.js");
const VoteSchema = require("../../models/vote.js")
const GuildModel = require("../../models/guild.js");
const CommandModel = require("../../models/command.js");
const getRole = require("../../utils/checkpremium.js");
const cooldown = new Discord.Collection();
const AdminState = require("../../utils/checkAdminuser.js");
const archivo = require("../../lang/index.json");
const MutesModel = require("../../models/mutes.js")
let args;
let command;
const settings = require('../../settings.json')
let usage;
const SwitchThings = require("../../utils/SwitchThings")
let errorWebhookID = process.env.errorWebhookID
let errorWebhookToken = process.env.errorWebhookToken
const webhookClient = new Discord.WebhookClient({
	id: errorWebhookID,
	token: errorWebhookToken
});
const unshorten = require('../../utils/unshorten.js')
const axios = require('axios')
var Bottleneck = require("bottleneck"); //Node only
const limiter2 = new Bottleneck({
	maxConcurrent: 2,
	minTime: 1000
})

module.exports = class messageCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message, ipc) {
		if (!message.guild) return
		if ((process.env.mode == 'maintenance' || process.env.mode == 'development') && message.guild.id == '834440041010561074') return

		if (!message.channel.guild) return;
		const messageLower = message.content.toLowerCase();
		let prefix;
		let guild;
		let cmd;

		async function doActions(client2, message2, datos2, tiempo2, variable) {
			const guild = message2.guild
			let configs = {
				"FloodDetection": guild.config.FloodDetection,
				"PhishingDetection": guild.config.PhishingDetection
			}
			if (guild.config) {
				if (configs[variable]) {
					if (configs[variable] == guild.config.FloodDetection && configs[variable].Enabled == true) {
						let toDel = 0
						let index = 0
						for (index in datos2) {
							index = parseInt(index)
							if ((Date.now() - datos2[index].date) < (tiempo2 * 1000)) {
								toDel += 1
							}
						}
						if ((message2.author.bot && configs[variable].Bots) || (message2.guild.members.cache.get(message2.author.id) && message2.guild.members.cache.get(message2.author.id).permissions.has('ADMINISTRATOR') && configs[variable].AdminBypass)) {
							//nothing
						} else {
							SwitchThings(client2, configs[variable], configs[variable].Action.Todo, message2, toDel)
						}
					} else if (configs[variable] == guild.config.PhishingDetection && configs[variable].Enabled == true) {
						SwitchThings(client2, configs[variable], configs[variable].Action.Todo, message2, 1)
					} else if (configs[variable] == guild.config.PhishingDetection) {
						message2.delete().catch(() => {})
					}
				}
			}
		}

		let Guild = this.client.guilds.cache.get(message.guild.id);
		let User = this.client.users.cache.get(message.author.id)
		if (this.client.messages.get(message.author.id)) {
			for (let index in this.client.messages.get(message.author.id)) {
				if (Guild.config && Guild.config.FloodDetection.Filter && (Date.now() - this.client.messages.get(message.author.id)[index].date) > parseInt(Guild.config.FloodDetection.Filter.Seconds) * 1000) {
					this.client.messages.get(message.author.id).splice(index, index + 1)
				}
			}
			let colamensajes = Guild.config?.FloodDetection.Filter?.Messages
			let tiempo = Guild.config?.FloodDetection.Filter?.Seconds
			if (colamensajes && tiempo) {
				this.client.messages.get(message.author.id).push({
					"date": Date.now(),
					"messageID": message.id,
					"content": message.content,
					"guild": message.guild.id
				})
				const datos = this.client.messages.get(message.author.id)
				if (datos.length >= colamensajes) {
					var diferencia = Math.abs(datos[datos.length - colamensajes].date - datos[datos.length - 1].date) / 1000
					if (diferencia < tiempo) {
						if (message.guild.isINDB) {
							doActions(this.client, message, datos, tiempo, "FloodDetection")
						} else {
							fetchGuild(this.client, message).then(() => {
								doActions(this.client, message, datos, tiempo, "FloodDetection")
							})
						}
					}
				}
			} 
		} else {
			if (Guild.config?.FloodDetection.Filter?.Seconds) {
				this.client.messages.set(message.author.id, [{
					"date": Date.now(),
					"content": message.content,
					"messageID": message.id,
					"guild": message.guild.id
				}])
			}
		}
		if (Guild.isINDB) {
			CheckPredefinedBannedWords(this.client, message, messageLower)
			CheckGuildBannedWords(this.client, message, messageLower, Guild)
			if (User && !User.isINDB) {
				await fetchUser(this.client, message)
				User.timestamp = Date.now()
				commandRun(this.client)
			} else {
				commandRun(this.client)
			}
		} else {
			await fetchGuild(this.client, message).then(async () => {
				CheckPredefinedBannedWords(this.client, message, messageLower)
				CheckGuildBannedWords(this.client, message, messageLower, Guild)
				if (User && !User.isINDB) {
					await fetchUser(this.client, message)
					User.timestamp = Date.now()
					commandRun(this.client)
				} else {
					commandRun(this.client)
				}
			})
		}

		async function CheckPredefinedBannedWords(client, message, messageLower) {
			var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
			let args = message.content.split(' ')
			let bannedWords = require('../../predefinedBannedWords.json')
			if (message.embeds[0]) {
				if (message.embeds[0].title) {
					let titulo = message.embeds[0].title.split(' ')
					for (let index2 in titulo) {
						if (regexp.test(titulo[index2])) {
							for (let index in bannedWords) {
								if (titulo[index2].indexOf(bannedWords[index]) !== -1) {
									doActions(client, message, titulo[index2], 0, "PhishingDetection")
								}
							}
							unshortenBWRLinks(client, message, titulo[index2], 0)
						}
					}
				}
				if (message.embeds[0].description) {
					let description = message.embeds[0].description.split(' ')
					for (let index2 in description) {
						if (regexp.test(description[index2])) {
							for (let index in bannedWords) {
								if (description[index2].indexOf(bannedWords[index]) !== -1) {
									doActions(client, message, description[index2], 0, "PhishingDetection")
								}
							}
							unshortenBWRLinks(client, message, description[index2], 0)
						}
					}
				}
				if (message.embeds[0].url) {
					for (let index in bannedWords) {
						if (message.embeds[0].url.indexOf(bannedWords[index]) !== -1) {
							doActions(client, message, message.embeds[0].url, 0, "PhishingDetection")
						}
					}
					unshortenBWRLinks(client, message, message.embeds[0].url, 1)
				}
				if (message.embeds[0].footer) {
					let footer = message.embeds[0].footer.text.split(' ')
					for (let index2 in footer) {
						if (regexp.test(footer[index2])) {
							for (let index in bannedWords) {
								if (footer[index2].indexOf(bannedWords[index]) !== -1) {
									doActions(client, message, footer[index2], 0, "PhishingDetection")
								}
							}
							unshortenBWRLinks(client, message, footer[index2], 0)
						}
					}
				}
				if (message.embeds[0].fields) {
					for (let field in message.embeds[0].fields) {
						let field2 = message.embeds[0].fields[field].value.split(' ')
						for (let index2 in field2) {
							if (regexp.test(field2[index2])) {
								for (let index in bannedWords) {
									if (field2[index2].indexOf(bannedWords[index]) !== -1) {
										doActions(client, message, field2[index2], 0, "PhishingDetection")
									}
								}
								unshortenBWRLinks(client, message, field2[index2], 0)
							}
						}
						let field3 = message.embeds[0].fields[field].name.split(' ')
						for (let index2 in field3) {
							if (regexp.test(field3[index2])) {
								for (let index in bannedWords) {
									if (field3[index2].indexOf(bannedWords[index]) !== -1) {
										doActions(client, message, field3[index2], 0, "PhishingDetection")
									}
								}
								unshortenBWRLinks(client, message, field3[index2], 0)
							}
						}
					}
				}
			}
			for (let index2 in args) {
				if (regexp.test(args[index2])) {
					for (let index in bannedWords) {
						if (args[index2].indexOf(bannedWords[index]) !== -1) {
							doActions(client, message, args[index2], 0, "PhishingDetection")
						}
					}
					unshortenBWRLinks(client, message, args[index2], 0)
				}
			}
		}

		async function CheckGuildBannedWords(client, message, messageLower, Guild) {
			var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
			let args = messageLower.split(' ')
			if (!Guild.config) return
			let bannedWords = Guild.config.PhishingDetection.BannedWords
			if (message.embeds[0]) {
				if (message.embeds[0].title) {
					let titulo = message.embeds[0].title.split(' ')
					for (let index2 in titulo) {
						if (regexp.test(titulo[index2])) {
							for (let index in bannedWords) {
								if (titulo[index2].indexOf(bannedWords[index]) !== -1) {
									doActions(client, message, titulo[index2], 0, "PhishingDetection")
								}
							}
							unshortenGuildLinks(client, message, titulo[index2], 0, Guild)
						}
					}
				}
				if (message.embeds[0].description) {
					let description = message.embeds[0].description.split(' ')
					for (let index2 in description) {
						if (regexp.test(description[index2])) {
							for (let index in bannedWords) {
								if (description[index2].indexOf(bannedWords[index]) !== -1) {
									doActions(client, message, description[index2], 0, "PhishingDetection")
								}
							}
							unshortenGuildLinks(client, message, description[index2], 0, Guild)
						}
					}
				}
				if (message.embeds[0].url) {
					for (let index in bannedWords) {
						if (message.embeds[0].url.indexOf(bannedWords[index]) !== -1) {
							doActions(client, message, message.embeds[0].url, 0, "PhishingDetection")
						}
					}
					unshortenGuildLinks(client, message, message.embeds[0].url, 0, Guild)
				}
				if (message.embeds[0].footer) {
					let footer = message.embeds[0].footer.text.split(' ')
					for (let index2 in footer) {
						if (regexp.test(footer[index2])) {
							for (let index in bannedWords) {
								if (footer[index2].indexOf(bannedWords[index]) !== -1) {
									doActions(client, message, footer[index2], 0, "PhishingDetection")
								}
							}
							unshortenGuildLinks(client, message, footer[index2], 0, Guild)
						}
					}
				}
				if (message.embeds[0].fields) {
					for (let field in message.embeds[0].fields) {
						let field2 = message.embeds[0].fields[field].value.split(' ')
						for (let index2 in field2) {
							if (regexp.test(field2[index2])) {
								for (let index in bannedWords) {
									if (field2[index2].indexOf(bannedWords[index]) !== -1) {
										doActions(client, message, field2[index2], 0, "PhishingDetection")
									}
								}
								unshortenGuildLinks(client, message, field2[index2], 0, Guild)
							}
						}
						let field3 = message.embeds[0].fields[field].name.split(' ')
						for (let index2 in field3) {
							if (regexp.test(field3[index2])) {
								for (let index in bannedWords) {
									if (field3[index2].indexOf(bannedWords[index]) !== -1) {
										doActions(client, message, field3[index2], 0, "PhishingDetection")
									}
								}
								unshortenGuildLinks(client, message, field3[index2], 0, Guild)
							}
						}
					}
				}
			} else {
				for (let index2 in args) {
					if (regexp.test(args[index2])) {
						for (let index in bannedWords) {
							if (args[index2].indexOf(bannedWords[index]) !== -1) {
								doActions(client, message, args[index2], 0, "PhishingDetection")
							}
						}
						unshortenGuildLinks(client, message, args[index2], 0, Guild)
					}
				}
			}
		}

		async function fetchUser(client2, message) {
			return await new Promise(resolve => {
				client2.users.fetch(message.author.id).then(() => {
					UserModel.findOne({
						USERID: message.author.id.toString()
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
							if (!User.TESTER && message.member && message.member.roles.cache.has("835835433082028062")) {
								User.TESTER = true
								s.Roles.Tester = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.ROLES.Notifications.Enabled && message.member && message.member.roles.cache.has("845037268330741760")) {
								User.ROLES.Notifications.Enabled = true
								s.Roles.Notifications = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.ROLES.Booster.Enabled && message.member && message.member.roles.cache.has("850530981349687296")) {
								User.ROLES.Booster.Enabled = true
								s.Roles.Booster = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.ROLES.Support.Enabled && message.member && message.member.roles.cache.has("834461420165922817")) {
								User.ROLES.Support.Enabled = true
								s.Roles.Support = {
									Enabled: true,
									Date: Date.now()
								}
							}
							if (!User.PREMIUM && message.member && message.member.roles.cache.has("834461423060123688")) {
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
							resolve(User)
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
							if (!User.TESTER && message.member && message.member.roles.cache.has("835835433082028062")) {
								User.TESTER = true
							}
							if (!User.PREMIUM && message.member && message.member.roles.cache.has("834461423060123688")) {
								User.PREMIUM = true
								if (Date.now() < 1630447201000) {
									User.ROLES.EarlyPremium.Enabled = true
								}
							}
							if (!User.ROLES.Notifications.Enabled && message.member && message.member.roles.cache.has("845037268330741760")) {
								User.ROLES.Notifications.Enabled = true
							}
							if (!User.ROLES.Booster.Enabled && message.member && message.member.roles.cache.has("850530981349687296")) {
								User.ROLES.Booster.Enabled = true
							}
							if (!User.ROLES.Support.Enabled && message.member && message.member.roles.cache.has("834461420165922817")) {
								User.ROLES.Support.Enabled = true
							}
							resolve(User)
						}
					});
				});
			})
		}


		async function fetchGuild(client2, message) {
			return await new Promise(resolve => {
				client2.guilds.fetch(message.guild.id).then((Guild2) => {
					let Guild = Guild2;
					if (Guild2) {
						//coge de la db el guild y lo mete con la config de la db
						GuildModel.findOne({
							guildID: message.guild.id.toString()
						}).then((s, err) => {
							if (s) {
								Guild.prefix = s.PREFIX;
								Guild.creado = s.CREADO;
								Guild.isINDB = true;
								Guild.config = s.config
								Guild.refered = s.REFERED;
								Guild.partner = s.Partner;
								Guild.last_timestamp = s.LAST_TIMESTAMP;
								s.LAST_TIMESTAMP = Date.now();
								s.save().catch((err) => s.update());
							} else {
								var guild3 = new GuildModel({
									guildID: message.guild.id,
									PREFIX: process.env.prefix,
									Creado: Date.now(),
									REFERED: false,
									LAST_TIMESTAMP: Date.now(),
									config: {
										FloodDetection: {
											AdminBypass: false,
											Enabled: true,
											Action: {
												Todo: "Mute",
												Mute: {
													Reason: "El usuario ha realizo un Spam de 3 mensajes seguidos en menos de 1 segundo",
													Infinite: false,
													Time: 3,
													Logs_Channel: "829044199113883718"
												}
											},
											DeleteAllMsgs: true
										},
										PhishingDetection: {
											AdminBypass: false,
											BannedWords: [],
											Enabled: true,
											Action: {
												Todo: "Mute",
												Mute: {
													Reason: "El usuario ha enviado un enlace de phishing.",
													Infinite: false,
													Time: 3,
													Logs_Channel: "829044199113883718"
												}
											},
											DeleteMessage: true
										},
										tos: true,
										spam: true,
										CHANNELID: [],
										DISABLED_COMMANDS: [],
										DISABLED_CATEGORIES: [],
										MUSIC_CHANNELS: []
									}
								});
								guild3.save().catch((err) => console.error(err));
								Guild.prefix = process.env.prefix;
								Guild.isINDB = true;
								Guild.refered = false;
								Guild.partner = false;
								Guild.config = {
									FloodDetection: {
										AdminBypass: false,
										Enabled: true,
										Action: {
											Todo: "Mute",
											Mute: {
												Reason: "El usuario ha realizo un Spam de 3 mensajes seguidos en menios de 1 segundo",
												Infinite: true,
												Time: 3,
												Logs_Channel: "829044199113883718"
											}
										}
									},
									PhishingDetection: {
										AdminBypass: false,
										BannedWords: [],
										Enabled: true,
										Action: {
											Todo: "DeleteMessage",
											Mute: {
												Reason: "El usuario ha enviado un enlace de phishing.",
												Infinite: false,
												Time: 3,
												Logs_Channel: "829044199113883718"
											}
										}
									},
									tos: true,
									spam: true,
									CHANNELID: [],
									DISABLED_COMMANDS: [],
									DISABLED_CATEGORIES: [],
									MUSIC_CHANNELS: []
								}
								Guild.creado = Date.now();
								Guild.last_timestamp = Date.now();
							}
							resolve(Guild)
						});
					}
				})
			})
		}

		async function commandRun(client) {
			if (message.author.bot) return;
			if (!message.member) return
			message.member.user = User
			if (Guild) {
				if (messageLower == `<@!${process.env.botID}>` || messageLower == `<@${process.env.botID}>`) {
					if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
					if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
					if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
						return message.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
					}
					const embed = new Discord.MessageEmbed()
						.setColor(process.env.EMBED_COLOR)
						.setDescription(`${client.language.MESSAGE[14]} \`${Guild.prefix}\``);
					return message.channel.send({ embeds: [embed] })
				}
				if (messageLower.startsWith(Guild.prefix)) { //hace log de Guild a ver si le da tiempo de cogerla
					prefix = Guild.prefix;
				} else if (messageLower.split(" ")[0] == `<@!${process.env.botID}>` || messageLower.split(" ")[0] == `<@${process.env.botID}>`) {
					prefix = '<@!828771710676500502>';
				} else {
					return
				}
			} else return
			if (prefix) {
				if (prefix == '<@!828771710676500502>') {
					args = message.content.split(" ");
					args.shift();
					command = args.shift().toLowerCase();
				} else if (prefix == Guild.prefix && prefix.endsWith(" ")) {
					args = message.content.split(" ");
					args.shift();
					command = args.shift().toLowerCase();
				} else if (!prefix.endsWith(" ")) {
					args = message.content.split(" ");
					command = args.shift().toLowerCase().slice(prefix.length);
				} else {
					args = message.content.split(" ");
					command = args.shift().toLowerCase();
				}
			}
			//ejecutamos el comando
			if (client.commands.has(command) || client.aliases.has(command)) {
				cmd = client.commands.get(command) || client.aliases.get(command);
				if (cmd) {
					if (cmd.inactive) return;
					if (cmd.production && process.env.mode != 'development' && process.env.mode != 'maintenance') return
					if (cmd.usage) {
						usage = User.LANG == 'en_US' ? cmd.usage[0] : cmd.usage[1]
					}

					if (!Guild.config.tos && cmd.tos) return
					if (!Guild.config.spam && cmd.spam) return

					if (User.LANG == 'es-ES') {
						User.LANG = 'es_ES'
					} else if (User.LANG == 'en-US') {
						User.LANG = 'en_US'
					}
					if (message.member.user.LANG) {
						client.language = JSON.parse(fs.readFileSync("./lang/" + archivo.find(language => language.nombre == User.LANG).archivo))
					} else {
						client.language = JSON.parse(fs.readFileSync("./lang/" + archivo.find(language => language.nombre == 'es_ES').archivo))
					}

					if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
					if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
					if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
						return message.reply({ content: `${client.language.MESSAGE[1]} \`"EMBED_LINKS"\`.` })
					}
					if (!message.channel.permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS")) {
						return message.reply({ content: `${client.language.MESSAGE[1]} \`"USE_EXTERNAL_EMOJIS"\`.` })
					}

					if (process.env.mode != 'development' && process.env.mode != 'maintenance') {
						if (Guild.config.CHANNELID) {
							if (Guild.config.CHANNELID.length !== 0) {
								if (!cmd.moderation && !cmd.nochannel) {
									if (!Guild.config.CHANNELID.includes(message.channel.id)) return
								}
							}
						}
					}
					if ((Guild.config.DISABLED_COMMANDS.includes(cmd.name.toLowerCase()) || Guild.config.DISABLED_CATEGORIES.includes(cmd.category.toLowerCase())) && !message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR')) {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(
								client.language.MESSAGE[2]
							)
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({ embeds: [errorembed] })
					}

					if (User) {
						if (!User.COMMANDS_EXECUTED) User.COMMANDS_EXECUTED = 0
						User.COMMANDS_EXECUTED += 1;
						if (User.BANNED) {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.MESSAGE[15]
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}
						if ((cmd.role === "dev" || cmd.role === "developer") && !User.DEV) {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									`${client.language.MESSAGE[3]} <a:pepeRiendose:835905480160444466>`
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}
						if (cmd.role === "tester" && !User.TESTER && !Guild.partner) {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.MESSAGE[4]
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}
						if (cmd.role === "premium" && !User.PREMIUM && !Guild.partner) {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.MESSAGE[5]
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}
						if (cmd.role === "voter" && !User.VOTER) {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.MESSAGE[6]
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}

						if (cmd.permissions && !message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR')) {
							for (let index2 in cmd.permissions) {
								if (!message.channel.permissionsFor(message.author).has(cmd.permissions[index2]) && !User.DEV) {
									const errorembed = new Discord.MessageEmbed()
										.setColor("RED")
										.setTitle(client.language.ERROREMBED)
										.setDescription(
											`${client.language.NOPERMS[1]} \`${cmd.permissions[index2]}\` ${client.language.NOPERMS[2]}`
										)
										.setFooter(message.author.username, message.author.avatarURL());
									return message.channel.send({ embeds: [errorembed] })
								}
							}
						}

						if (cmd.botpermissions && !message.channel.permissionsFor(message.guild.me).has("ADMINISTRATOR")) {
							for (let index3 in cmd.botpermissions) {
								if (!message.channel.permissionsFor(message.guild.me).has(cmd.botpermissions[index3])) {
									const errorembed = new Discord.MessageEmbed()
										.setColor("RED")
										.setTitle(client.language.ERROREMBED)
										.setDescription(
											`${client.language.BOTNOPERMS[1]} \`${cmd.botpermissions[index3]}\` ${client.language.BOTNOPERMS[2]}`
										)
										.setFooter(message.author.username, message.author.avatarURL());
									return message.channel.send({ embeds: [errorembed] })
								}
							}
						}
						if (cmd.subcommands && (!args[0] || (args[0] != cmd.subcommands[cmd.subcommands.indexOf(args[0])]))) {
							if (usage) {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										`${client.language.MESSAGE[7]} \`${cmd.name}\`${client.language.MESSAGE[8]}\`${prefix}${cmd.name} ${usage}\`.`
									)
									.setFooter(message.author.username, message.author.avatarURL());
								return message.channel.send({ embeds: [errorembed] })
							} else {
								const errorembed = new Discord.MessageEmbed()
									.setColor("RED")
									.setTitle(client.language.ERROREMBED)
									.setDescription(
										`${client.language.MESSAGE[7]} \`${cmd.name}\`${client.language.MESSAGE[8]} \`${prefix}help ${cmd.name}\`.`
									)
									.setFooter(message.author.username, message.author.avatarURL());
								return message.channel.send({ embeds: [errorembed] })
							}
						}
						if (args[0] == '') args.shift()
						if (cmd.args && !args[0]) {
							let reply = `${client.language.NOARGS} ${message.author}!.`;

							if (usage) {
								reply += `\n${client.language.PROPERUSAGE} \`${prefix}${cmd.name} ${usage}\`.`;
							}

							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									reply
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}
						if (cmd.exclusive && message.guild.id != '834440041010561074') {
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.MESSAGE[13]
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}

						const getRoleDev = User.DEV ? true : false;
						const getRolePremium = User.PREMIUM ? true : false;
						if (getRoleDev == false || getRolePremium == false) {
							if (!cooldown.has(cmd.name)) {
								cooldown.set(cmd.name, new Discord.Collection());
							}
						}
						if (getRoleDev == false || getRolePremium == false) {
							const time = cooldown.get(cmd.name);
							const cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000;

							if (!time.has(message.author.id)) {
								time.set(message.author.id, Date.now());
								setTimeout(
									() => time.delete(message.author.id),
									cooldownAmount
								);
							} else {
								const expire = time.get(message.author.id) + cooldownAmount;
								const left = (expire - Date.now()) / 1000;
								if (Date.now() < expire && left > 0.9) {
									const errorembed = new Discord.MessageEmbed()
										.setColor("RED")
										.setTitle(client.language.ERROREMBED)
										.setDescription(
											`${client.language.MESSAGE[10]} \`${left.toFixed(1)}\` ${client.language.MESSAGE[11]} ${cmd.name}.`
										)
										.setFooter(message.author.username, message.author.avatarURL());
									return message.channel.send({ embeds: [errorembed] })
								}
							}
						}
						try {
							console.debug(cmd.name + " [" + User.id + "] " + "[" + Guild.id + "]")
							limiter2.schedule(async () => {
								CommandModel.findOne({
									name: cmd.name
								}).then(async (s, err) => {
									if (s) {
										s.uses += 1
										s.save().catch(e => console.error(e))
									} else if (!s) {
										var command2 = new CommandModel({
											name: cmd.name,
											aliases: cmd.aliases,
											description: cmd.description,
											uses: 1
										});
										command2.save().catch((err) => console.error(err));
									}
								})
							})
							cmd.run(client, message, args, prefix, message.member.user.LANG, webhookClient, ipc);
						} catch (e) {
							console.error(e);
							const errorembed = new Discord.MessageEmbed()
								.setColor("RED")
								.setTitle(client.language.ERROREMBED)
								.setDescription(
									client.language.MESSAGE[12]
								)
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [errorembed] })
						}
					} else {
						return message.channel.send("Hubo un error en la caché. Por favor repórtelo en el servidor de soporte ( <https://support.nodebot.xyz> )");
					}
				} else return;
			}
		}
	}
};

function unshortenBWRLinks(client, message, url, notify) {
	let bannedWords = require('../../predefinedBannedWords.json')
	axios.get(url, {
		timeout: 2 * 1000
	}).then((res) => {
		if (!res) return null;
		if (res.status == 301) {
			return unshorten(response.redirect_destination);
		} else if (res.status == 200) {
			for (let index in bannedWords) {
				if (res.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
					if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
						return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
					}
					if (notify == 1) {
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
							.setDescription(client.language.MESSAGE[17])
							.setFooter(message.author.username, message.author.avatarURL());
						try {
							if (!message.deleted) message.delete().catch(e => {
								const embed = new Discord.MessageEmbed()
									.setColor(process.env.EMBED_COLOR)
									.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
									.setDescription(client.language.MESSAGE[17])
									.setFooter(message.author.username, message.author.avatarURL());
								return message.channel.send({ embeds: [embed] });
							})
						} catch (e) {
							const embed = new Discord.MessageEmbed()
								.setColor(process.env.EMBED_COLOR)
								.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
								.setDescription(client.language.MESSAGE[17])
								.setFooter(message.author.username, message.author.avatarURL());
							return message.channel.send({ embeds: [embed] });
						}
						return message.channel.send({ embeds: [embed] });
					} else {
						if (!message.deleted) return message.delete().catch(e => console.error(e))
					}
				}
			}
		} else if (res.status == 404) {
			console.error("Error unshorten message.js");
		} else if (res.status == 499) {
			for (let index in bannedWords) {
				if (res.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
					if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
						return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
					}
					if (notify == 1) {
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
							.setDescription(client.language.MESSAGE[17])
							.setFooter(message.author.username, message.author.avatarURL());
						if (!message.deleted) message.delete().catch(e => console.error(e))
						return message.channel.send({ embeds: [embed] });
					} else {
						if (!message.deleted) return message.delete().catch(e => console.error(e))
					}
				}
			}
		} else {
			console.debug(res.status);
			return;
		}
	}).catch((e) => {
		if (e.request && e.request.res && e.request.res.responseUrl) {
			for (let index in bannedWords) {
				if (e.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
					if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
					if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
					if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
						return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
					}
					if (notify == 1) {
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
							.setDescription(client.language.MESSAGE[17])
							.setFooter(message.author.username, message.author.avatarURL());
						if (!message.deleted) message.delete().catch(e => console.error(e))
						return message.channel.send({ embeds: [embed] });
					} else {
						if (!message.deleted) return message.delete().catch(e => console.error(e))
					}
				}
			}
		} else if (e.request && e.request._options && e.request._options.href) {
			for (let index in bannedWords) {
				if (e.request._options.href.indexOf(bannedWords[index]) !== -1) {
					if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
					if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
					if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
						return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
					}
					if (notify == 1) {
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
							.setDescription(client.language.MESSAGE[17])
							.setFooter(message.author.username, message.author.avatarURL());
						if (!message.deleted) message.delete().catch(e => console.error(e))
						return message.channel.send({ embeds: [embed] });
					} else {
						if (!message.deleted) return message.delete().catch(e => console.error(e))
					}
				}
			}
		}
	});
};

function unshortenGuildLinks(client, message, url, notify, Guild) {
	let bannedWords = Guild.config.PhishingDetection.BannedWords
	axios.get(url, {
		timeout: 2 * 1000
	}).then((res) => {
		if (!res) return null;
		if (res.status == 301) {
			return unshorten(response.redirect_destination);
		} else if (res.status == 200) {
			for (let index in bannedWords) {
				if (res.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
					if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
					if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
					if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
						return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
					}
					if (notify == 1) {
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
							.setDescription(client.language.MESSAGE[18])
							.setFooter(message.author.username, message.author.avatarURL());
						if (!message.deleted) message.delete().catch(e => console.error(e))
						return message.channel.send({ embeds: [embed] });
					} else {
						if (!message.deleted) return message.delete().catch(e => console.error(e))
					}
				}
			}
		} else if (res.status == 404) {
			console.error("Error unshorten message.js");
		} else if (res.status == 499) {
			for (let index in bannedWords) {
				if (res.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
					if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
					if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
					if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
						return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
					}
					if (notify == 1) {
						const embed = new Discord.MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
							.setDescription(client.language.MESSAGE[18])
							.setFooter(message.author.username, message.author.avatarURL());
						if (!message.deleted) message.delete().catch(e => console.error(e))
						return message.channel.send({ embeds: [embed] });
					} else {
						if (!message.deleted) return message.delete().catch(e => console.error(e))
					}
				}
			}
		} else {
			console.debug(res.status);
			return;
		}
	})
		.catch((e) => {
			if (e.request && e.request.res && e.request.res.responseUrl) {
				for (let index in bannedWords) {
					if (e.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
						if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
						if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
						if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
							return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
						}
						if (notify == 1) {
							const embed = new Discord.MessageEmbed()
								.setColor(process.env.EMBED_COLOR)
								.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
								.setDescription(client.language.MESSAGE[18])
								.setFooter(message.author.username, message.author.avatarURL());
							if (!message.deleted) message.delete().catch(e => console.error(e))
							return message.channel.send({ embeds: [embed] });
						} else {
							if (!message.deleted) return message.delete().catch(e => console.error(e))
						}
					}
				}
			} else if (e.request && e.request._options && e.request._options.href) {
				for (let index in bannedWords) {
					if (e.request._options.href.indexOf(bannedWords[index]) !== -1) {
						if (!message.channel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")) return
						if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return
						if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
							return message.reply({ content: `${client.language.MESSAGE[19]} \`"MANAGE_MESSAGES"\` ${client.language.MESSAGE[20]}` })
						}
						if (notify == 1) {
							const embed = new Discord.MessageEmbed()
								.setColor(process.env.EMBED_COLOR)
								.setTitle(`${client.language.MESSAGE[16]} <:notcheck:864102874983825428>`)
								.setDescription(client.language.MESSAGE[18])
								.setFooter(message.author.username, message.author.avatarURL());
							if (!message.deleted) message.delete().catch(e => console.error(e))
							return message.channel.send({ embeds: [embed] });
						} else {
							if (!message.deleted) return message.delete().catch(e => console.error(e))
						}
					}
				}
			}
		});
};