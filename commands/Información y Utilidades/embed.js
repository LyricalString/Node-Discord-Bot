const Command = require("../../structures/Commandos.js");
const Discord = require("discord.js");
const { Console } = require("@sentry/node/dist/integrations");

module.exports = class Embed extends Command {
	constructor(client) {
		super(client, {
			name: "embed",
			description: ["Sends an embed.", "Envía un embed."],
			usage: [
				"<Channel> + <Color> + <Title> + <Message>",
				"<Canal> + <Color> + <Título> + <Mensaje> (el símbolo de suma también)",
			],
			permissions: ["ADMINISTRATOR"],
			cooldown: 1,
			category: "Info",
			args: true,
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			args = args.join(" ").split(" + ");

			if (!args[0]) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.CREATEEMBED[5])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			if (!args[1]) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.CREATEEMBED[1])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			if (!args[2]) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.CREATEEMBED[2])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			if (!args[3]) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.CREATEEMBED[3])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			let canal, descripcion, color, titulo;

			canal =
				message.mentions.channels.first() ||
				message.guild.channels.cache.get(args[0]);
			descripcion = args[3];
			titulo = args[2];
			if (!canal) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.CREATEEMBED[4])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			let colors = [
				"DEFAULT",
				"AQUA",
				"DARK_AQUA",
				"GREEN",
				"DARK_GREEN",
				"BLUE",
				"DARK_BLUE",
				"PURPLE",
				"DARK_PURPLE",
				"LUMINOUS_VIVID_PINK",
				"DARK_VIVID_PINK",
				"GOLD",
				"DARK_GOLD",
				"ORANGE",
				"DARK_ORANGE",
				"RED",
				"DARK_RED",
				"GREY",
				"DARK_GREY",
				"DARKER_GREY",
				"LIGHT_GREY",
				"NAVY",
				"DARK_NAVY",
				"YELLOW",
			];
			for (let index in colors) {
				if (args[1].toUpperCase() == colors[index]) {
					color = colors[index];
				}
			}
			if (!color) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.CREATEEMBED[6])
					.setFooter(message.author.username, message.author.avatarURL())
					.setImage("https://i.postimg.cc/gj8NSLsy/embed-colors.png");
				return message.channel.send({ embeds: [errorembed] });
			}
			var embed = new Discord.MessageEmbed()
				.setDescription(`${descripcion}`)
				.setColor(`${color}`);

			if (
				(titulo || titulo !== "null") &&
				titulo != "none" &&
				titulo != "ninguno" &&
				titulo != "no" &&
				titulo != "''" &&
				titulo != '""'
			) {
				embed.setTitle(titulo);
			}
			if (!canal.permissionsFor(process.env.botID).has(['SEND_MESSAGES', 'EMBED_LINKS', 'VIEW_CHANNEL'])) {
				message.channel.send({content: "No tengo los permisos \`SEND_MESSAGES\`, \`EMBED_LINKS\` ni \`VIEW_CHANNEL\`, que son necesarios para enviar el embed."})
				return
			};
			canal.send({ embeds: [embed] });
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
