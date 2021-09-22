const Command = require("../../structures/Commandos.js");
const fs = require("fs");
const Discord = require("discord.js");
const Sentry = require("@sentry/browser");
const categories = fs.readdirSync("./commands");

module.exports = class Reload extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			description: [
				"Reload all commands.",
				"Vuelve a cargar todos los comandos.",
			],
			alias: ["rl", "rld"],
			permissions: ["ADMINISTRATOR"],
			role: "dev",
			category: "administracion",
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			categories.forEach(async (category) => {
				fs.readdir(`./commands/${category}`, (err) => {
					if (err) return console.error(err);
					const iniciar = async () => {
						const commands = fs
							.readdirSync(`./commands/${category}`)
							.filter((archivo) => archivo.endsWith(".js"));
						for (const archivo of commands) {
							const a = require(`../../commands/${category}/${archivo}`);
							delete require.cache[
								require.resolve(`../../commands/${category}/${archivo}`)
							];
							const command = new a(client);
							client.commands.set(command.name.toLowerCase(), command);
							if (command.aliases && Array.isArray(command.aliases)) {
								for (let i = 0; i < command.aliases.length; i++) {
									client.aliases.set(command.aliases[i], command);
								}
							}
						}
					};
					iniciar();
				});
			});
			const embed = new Discord.MessageEmbed()
				.setColor(process.env.EMBED_COLOR)
				.setTitle(client.language.SUCCESSEMBED)
				.setDescription("Todo ha sido recargado correctamente")
				.setFooter(message.author.username, message.author.avatarURL());
			return message.channel.send({embeds: [embed]});
		} catch (e) {
			console.error(e);
			message.channel.send(
				new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle(client.language.ERROREMBED)
				.setDescription(client.language.fatal_error)
				.setFooter(message.author.username, message.author.avatarURL())
			);
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