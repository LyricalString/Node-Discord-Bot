require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const {
	MessageEmbed
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Shards extends Command {
	constructor(client) {
		super(client, {
			name: "shards",
			description: [
				"Displays the current shard info.",
				"Muestra información de las shards.",
			],
			category: "Administracion",
			alias: ["shard"],
			inactive: true
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			delete require.cache[require.resolve(`../../estadisticas.json`)];
			let data = require('../../estadisticas.json')
			const embed = new MessageEmbed()
				.setColor("GREEN")
				.setAuthor("Información de Node");

			for (let index2 in data.clusters) {
				let cluster = data.clusters[index2]
				let shards = cluster.shards
				let guilds = cluster.guilds
				let ram = cluster.ram
				let exclusiveGuilds = cluster.exclusiveGuilds
				let ping = 0
				let index = 0
				for (index in cluster.shardsStats) {
					ping += parseInt(cluster.shardsStats[index].ping)
				}
				let averagePing = Math.trunc(ping / (cluster.shardsStats.length))
				embed.addField(`${client.language.SHARDS[1]} ${index}`,
					`\`\`\`js\n${client.language.SHARDS[2]}: ${shards}\n${client.language.SHARDS[3]}: ${guilds}\n${client.language.SHARDS[4]}: ${Math.trunc(parseInt(ram))} MB\n${client.language.SHARDS[5]}: ${moment.duration(client.uptime).format( `DD:HH:mm:ss` )}\n${client.language.SHARDS[6]}: ${exclusiveGuilds}\n${client.language.SHARDS[7]}: ${averagePing} ms\`\`\``, true);
			}
			message.channel.send({embeds: [embed]})
		} catch (e) {
			console.error(e)
			message.channel.send({ embeds: [new Discord.MessageEmbed().setColor("RED").setTitle(client.language.ERROREMBED).setDescription(client.language.fatal_error).setFooter(message.author.username, message.author.avatarURL())]})
			webhookClient.send(
				`Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
			);
			try {
				message.author.send('Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>').catch(e)
			} catch (e) {}
		}
	}
};