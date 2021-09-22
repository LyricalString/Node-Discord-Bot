const memory = '../../settings.json';
const file = require(memory);
const Event = require("../../structures/Event.js");
const chalk = require("chalk");
const mongoose = require("mongoose");
const {
	Manager
} = require("erela.js")
const UserModel = require("../../models/user.js");
const fetch = require("node-fetch");
const Discord = require("discord.js");
require("dotenv").config();
const CreateManager = require("../../things/player.js")
const {
	Guild
} = require("discord.js");
const GuildSchema = require("../../models/guild.js");
const clearcache = require('../../utils/clearcache.js')
const MutesModel = require('../../models/mutes.js')
const BansModel = require('../../models/bans.js')

let started = false
module.exports = class Ready extends Event {
	constructor(...args) {
		super(...args);
	}

	async run() {
		console.log('Shard number ' + this.client.shard.ids[0] + ' is now running.')

		mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});

		CreateManager(this.client)
		clearcache(this.client)

		let client = this.client;

		setInterval(async function () {
			checkMutes(client)
		}, 5000)

		setInterval(async function () {
			checkBans(client)
		}, 60000)

		setInterval(async function () {
			updateStatus(client)
		}, 900000)

		this.client.manager.init(this.client.user.id);
		this.client.on("raw", (d) => this.client.manager.updateVoiceState(d));

		// this.client.api.applications(process.env.botID).commands.post({
		// 	data: fnprofilecommand
		// })

		// this.client.api.applications(process.env.botID).commands.post({
		// 	data: twitchcommand
		// })

		// this.client.api.applications(process.env.botID).commands.post({
		// 	data: configcommand
		// })

		if (this.client.shard.ids[0] == this.client.shard.count - 1) {
			if (!started) {
				//dashboardAPI(client, GuildSchema)

				GuildSchema.find({ "config.Pvc.TemporaryChannels.0": { $exists: true } }).then((s, err) => {
					if (!s) return
					if (err) return
					s.forEach(guild => {
						if (!guild || !guild.config.Pvc || !guild.config.Pvc.TemporaryChannels) return
						guild.config.Pvc.TemporaryChannels.forEach((channel, index) => {
							let channelID = channel.slice(0, 18)
							this.client.channels.fetch(channelID).then(channel2 => {
								if (channel2.members.size === 0) {
									guild.config.Pvc.TemporaryChannels.splice(index, index + 1)
									channel2.delete()
								}
							}).catch(async e => {
								await guild.config.Pvc.TemporaryChannels.splice(index, index + 1)
								return guild.save().catch(e => console.log(e))
							})
						})
						guild.save().catch(e => console.log(e))
					})
				})
			}

			this.client.on("error", (code) => {
				console.log(code);
			});

			started = true
			// if (process.env.mode == 'development') {
			//     client.backend(client)
			// }
		}
	}
}

async function checkMutes(client2) {
	MutesModel.find({}).then(async (s, err) => {
		await s.forEach(data => {
			data.GUILDS.forEach(async data2 => {
				if ((Date.now() - data2.MUTE_TIMESTAMP) > data2.MUTE_TIME) {
					const guild = client2.guilds.cache.get(data2.ID)
					if (!guild) return
					GuildSchema.findOne({ guildID: data2.ID.toString() }).then((s2, err) => {
						if (err) return
						guild.roles.fetch(s2.config.MutedRole).then(role => {
							if (!role) return
							guild.members.fetch(data.USERID).then(member => {
								if (!member) return
								member.roles.remove(role.id).catch(() => { })
							})
						})
					})
					data2.remove()
				}
			})
			data.save().catch(e => console.log(e))
		})
	})
}

async function checkBans(client2) {
	BansModel.find({}).then(async (s, err) => {
		await s.forEach(data => {
			data.GUILDS.forEach(async data2 => {
				if ((Date.now() - data2.BAN_TIMESTAMP) > data2.BAN_TIME) {
					const guild = client2.guilds.cache.get(data2.ID)
					if (!guild) return
					guild.members.unban(data.USERID).catch(() => { })
					data2.remove()
				}
			})
			data.save().catch(e => console.log(e))
		})
	})
}

async function updateStatus(client2) {
	const guildNum2 = await client2.shard.fetchClientValues(
		"guilds.cache.size"
	);
	const memberNum2 = await client2.shard.broadcastEval(client =>
		client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)
	);
	const totalMembers2 = memberNum2.reduce(
		(prev, memberCount) => prev + memberCount,
		0
	);
	const totalGuilds2 = guildNum2.reduce((total, shard) => total + shard, 0);

	await client2.user.setActivity(
		" Servidores: " + totalGuilds2 + ` Miembros: ${totalMembers2} || .help`, {
		type: "LISTENING"
	}
	);
}

async function dashboardAPI(client2, guildSchema) {
	// Cargar el modulo HTTP
	var http = require('http');

	const guildNum2 = await client2.shard.fetchClientValues(
		"guilds.cache.size"
	);

	const channelNum2 = await client2.shard.fetchClientValues(
		"channels.cache.size"
	);

	const memberNum2 = await client2.shard.broadcastEval(client =>
		client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)
	);
	const members = memberNum2.reduce(
		(prev, memberCount) => prev + memberCount,
		0
	);
	const guilds = guildNum2.reduce((total, shard) => total + shard, 0);
	const channels = channelNum2.reduce((total, shard) => total + shard, 0);



	// Configurar una respuesta HTTP para todas las peticiones
	function onRequest(request, response) {
		response.writeHead(200, { "Content-Type": "text/html" });
		if(request.headers.guildid){
			console.log('Actualizando: ' + request.headers.guildid);
			updateGuild(client2, guildSchema, request.headers.guildid)
			.then(res => {
				console.log(res)
			}).catch(err => {
				console.log(err)
			})
			response.end();
		}else{

		var guildmsg2 = JSON.stringify({
 	        "channels": channels,
            	"guilds": guilds,
            	"members": members
        	})
		console.log(guildmsg2);
		response.end(guildmsg2);
		}
	}

	var server = http.createServer(onRequest);

	// Escuchar al puerto 8080
	server.listen(8080);

	// Poner un mensaje en la consola
	console.log("Servidor funcionando en http://localhost:8080/");
}

async function updateGuild(client2, GuildModel, guildId) {
	if (!guildId) return
	let Guild = client2.guilds.cache.get(guildId);
	return await new Promise((resolve, reject) => {
		client2.guilds.fetch(guildId).then((Guild2) => {
			let Guild = Guild2;
			if (Guild2) {
				//coge de la db el guild y lo mete con la config de la db
				GuildModel.findOne({
					guildID: guildId.toString()
				}).then((s, err) => {
					if (!s) reject('Ese servidor no existe en la base de datos.')
					if (err) reject('Ha ocurrido un error al buscar el servidor en Mongo.')
					if (s) {
						Guild.prefix = s.PREFIX;
						Guild.isINDB = true;
						Guild.config = s.config
					}
					resolve(`La guild con ID ${guildId} ha sido actualizada correctamente.`)
				});
			}
		})
	})
}

let backupcommand = {
	name: "backup",
	description: "Comando principal para la configuración de las copias de seguridad.",
	options: [
		{
			type: 1,
			name: "autobackup",
			description: "Configuración de las copias de seguridad automáticas.",
			options: [
				{
					type: 3,
					name: "tiempo",
					description: "Intervalo de tiempo entre copias de seguridad.",
					choices: [
						{
							name: "12 horas",
							value: "12"
						},
						{
							name: "1 día",
							value: "1"
						},
						{
							name: "3 días",
							value: "3"
						},
						{
							name: "7 días",
							value: "7"
						}
					],
					required: true
				}
			]
		},
		{
			type: 1,
			name: "create",
			description: "Crea una nueva copia de seguridad.",
			options: [
				{
					type: 3,
					name: "messages",
					description: "Permite seleccionar el número de mensajes por canal que se guardarán.",
					choices: [
						{
							name: "Ninguno",
							value: "0"
						},
						{
							name: "5 mensajes por canal",
							value: "5"
						},
						{
							name: "10 mensajes por canal",
							value: "10"
						},
						{
							name: "20 mensajes por canal",
							value: "20"
						}
					],
					required: true
				},
				{
					type: 3,
					name: "id",
					description: "Identificador personalizado para la copia de seguridad."
				}
			]
		},
		{
			type: 1,
			name: "delete",
			description: "Borra una copia de seguridad antigua.",
			options: [
				{
					type: 3,
					name: "id",
					description: "Identificador de las copias de seguridad.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "list",
			description: "Lista de los identificadores de las copias de seguridad."
		},
		{
			"type": 1,
			"name": "load",
			"description": "Carga una copia de seguridad en el servidor.",
			"options": [
				{
					"type": 3,
					"name": "id",
					"description": "Identificador de la copia de seguridad.",
					"required": true
				}
			]
		},
		{
			type: 1,
			name: "stats",
			description: "Permite ver las estadísticas de una copia de seguridad.",
			options: [
				{
					type: 3,
					name: "id",
					description: "Identificador de las copias de seguridad.",
					required: true
				}
			]
		}
	]
}

let fnprofilecommand = {
	name: "fnprofile",
	description: "Muestra las estadísticas de un usuario de Fortnite.",
	options: [
		{
			type: 1,
			name: "pc",
			description: "Selecciona esta opción para ver las estadísticas en PC.",
			options: [
				{
					type: 3,
					name: "user",
					description: "Nombre de Usuario",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "console",
			description: "Selecciona esta opción para ver las estadísticas en consola.",
			options: [
				{
					type: 3,
					name: "user",
					description: "Nombre de Usuario",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "mobile",
			description: "Selecciona esta opción para ver las estadísticas en móvil.",
			options: [
				{
					type: 3,
					name: "user",
					description: "Nombre de Usuario",
					required: true
				}
			]
		}
	]
}

let twitchcommand = {
	name: "twitch",
	description: "Cambia la configuración de Node y la sincronización con Twitch.",
	options: [
		{
			type: 1,
			name: "mode",
			description: "Selecciona si el módulo de Twitch está encendido o apagado.",
			options: [
				{
					type: 5,
					name: "status",
					description: "Selecciona si el módulo de Twitch está encendido o apagado.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "add",
			description: "Agrega un nuevo canal a la lista de streamers.",
			options: [
				{
					type: 3,
					name: "streamer",
					description: "Escribe el nombre de usuario del streamer en minúsculas.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "set",
			description: "Cambia la configuración de la acción que realiza el bot al recibir el evento.",
			options: [
				{
					type: 3,
					name: "streamer",
					description: "Nombre del streamer",
					required: true
				},
				{
					type: 3,
					name: "action",
					description: "La accion que se realizará cuando el streamer encienda stream.",
					choices: [
						{
							name: "Send Message",
							value: "sendmessage"
						}
					],
					required: true
				}
			]
		},
		{
			type: 1,
			name: "delete",
			description: "Borra un canal de la lista de streamers.",
			options: [
				{
					type: 3,
					name: "streamer",
					description: "Nombre en minúsculas del streamer.",
					required: true
				}
			]
		},
		{
			type: 1,
			name: "list",
			description: "Muestra la lista de streamers de este servidor."
		}
	]
};

let configcommand = {
	name: "config",
	description: "Cambia la configuración de Node.",
	options: [
		{
			type: 2,
			name: "automod",
			description: "Cambia los ajustes de la moderación automática.",
			options: [
				{
					type: 1,
					name: "mutedrole",
					description: "Selecciona el rol para los usuarios silenciados.",
					options: [
						{
							type: 8,
							name: "role",
							description: "Establece el rol para los silencios.",
							required: true
						}
					]
				},
				{
					type: 1,
					name: "antiflood",
					description: "Ajusta el filtro tal que no pueda superar x mensajes en x segundos, PE: 3 mensajes en 5 segundos.",
					options: [
						{
							type: 4,
							name: "mensajes",
							description: "Los mensajes máximos que se pueden enviar en x segundos.",
							required: true
						},
						{
							type: 4,
							name: "segundos",
							description: "Los segundos entre el número máximo de mensajes.",
							required: true
						}
					]
				},
				{
					type: 1,
					name: "action",
					description: "Cambia la configuración para una de las funciones de la automoderación.",
					options: [
						{
							type: 3,
							name: "function",
							description: "Selecciona la función a modificar.",
							choices: [
								{
									name: "AntiPhishing",
									value: "antiphishing"
								},
								{
									name: "AntiFlood",
									value: "antiflood"
								}
							],
							required: true
						},
						{
							type: 3,
							name: "to-do",
							description: "Elige la acción a realizar cuando se ejecute el automod.",
							choices: [
								{
									name: "Ban",
									value: "Ban"
								},
								{
									name: "Kick",
									value: "Kick"
								},
								{
									name: "Mute",
									value: "Mute"
								},
								{
									name: "DeleteMessage",
									value: "DeleteMessage"
								}
							],
							required: true
						},
						{
							type: 5,
							name: "notify",
							description: "Selecciona si quieres que notifique en el mismo chat donde se cometa la acción."
						},
						{
							type: 5,
							name: "adminbypass",
							description: "Selecciona si los administradores se verán o no afectados por el automod."
						},
						{
							type: 5,
							name: "botsbypass",
							description: "Selecciona si los bots se verán o no afectados por el automod."
						},
						{
							type: 5,
							name: "status",
							description: "Ajusta si está activo o inactivo."
						},
						{
							type: 4,
							name: "time",
							description: "Selecciona el tiempo que el usuario estará penalizado."
						},
						{
							type: 5,
							name: "infinite",
							description: "Selecciona si la penalización no tiene límite de tiempo."
						},
						{
							type: 5,
							name: "logs",
							description: "Selecciona si se registran los eventos en el canal de logs."
						},
						{
							type: 3,
							name: "reason",
							description: "El motivo que se adjuntará junto a la penalización."
						}
					]
				}
			]
		},
		{
			"type": 2,
			"name": "logs",
			"description": "Habilita un canal para el registro de las acciones.",
			"options": [
				{
					"type": 1,
					"name": "channel",
					"description": "Elige el canal donde se enviarán los eventos que se ejecuten por el automod.",
					"options": [
						{
							"type": 7,
							"name": "channel",
							"description": "Elige el canal donde se enviarán los eventos que se ejecuten por el automod.",
							"required": true
						}
					]
				},
				// {
				// 	"type": 1,
				// 	"name": "status",
				// 	"description": "Elige el estado del registro de eventos ejecutados por el automod.",
				// 	"options": [
				// 		{
				// 			"type": 5,
				// 			"name": "status",
				// 			"description": "Elige el estado del registro de eventos ejecutados por el automod.",
				// 			"required": true
				// 		}
				// 	]
				// }
			]
		},
		{
			type: 2,
			name: "modes",
			description: "Habilita y deshabilita los diferentes modos de Node.",
			options: [
				{
					type: 1,
					name: "tosmode",
					description: "Habilita o deshabilita los comandos al límite de los términos de conducta de Discord.",
					options: [
						{
							type: 5,
							name: "status",
							description: "Establece si el modo está habilitado o deshabilitado.",
							required: true
						}
					]
				},
				{
					type: 1,
					name: "spammode",
					description: "Habilita o deshabilita los comandos con los cuales los usuarios se podrían hacer publicidad.",
					options: [
						{
							type: 5,
							name: "status",
							description: "Establece si el modo está habilitado o deshabilitado.",
							required: true
						}
					]
				}
			]
		},
		{
			type: 2,
			name: "pvc",
			description: "Cambia la configuración de Node para los canales de voz privados.",
			options: [
				{
					type: 1,
					name: "mode",
					description: "Selecciona si el módulo de canales de voz privados está encendido o apagado.",
					options: [
						{
							type: 5,
							name: "status",
							description: "Selecciona si el módulo de canales de voz privados está encendido o apagado.",
							required: true
						}
					]
				},
				{
					type: 1,
					name: "category",
					description: "Selecciona la nueva categoría donde se crearán los canales de voz privados.",
					options: [
						{
							type: 7,
							name: "category",
							description: "Selecciona la categoría donde se crearán los canales de voz privados.",
							required: true
						}
					]
				},
				{
					type: 1,
					name: "startingchannel",
					description: "Selecciona el canal principal donde se deberán de unir para crear el canal de voz privado.",
					options: [
						{
							type: 7,
							name: "channel",
							description: "Selecciona el canal principal donde se deberán de unir para crear el canal de voz privado.",
							required: true
						}
					]
				}
			]
		}
	]
}
