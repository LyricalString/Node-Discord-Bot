require("dotenv").config();

const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class RoleInfo extends Command {
	constructor(client) {
		super(client, {
			name: "role-info",
			description: [
				"Shows the information of that role.",
				"Muestra la información de un rol.",
			],
			alias: ["roleinfo", "roleinf", "ri"],
			usage: ["<@role/id>", "<@rol/id>"],
			cooldown: 5,
			args: true,
			category: "Info",
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			let role = await message.guild.roles.fetch(args[0]) || message.mentions.roles.first()
			if (!role) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.ROLEINFO[9])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({embeds: [errorembed]});
			}
			const guild = message.guild;
			const rol = new Discord.MessageEmbed()
				.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp()
				.setColor(role.displayHexColor || process.env.EMBED_COLOR)
				.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
				.addField(
					`<:serverowner:863983092930183169> ${client.language.ROLEINFO[1]}: `,
					"```" + `${role.name}` + "```",
					true
				) //Nombre del rol
				.addField(
					`<:textchannelblurple:863983092893220885> ${client.language.ROLEINFO[2]}: `,
					"```" + `${role.id}` + "```",
					true
				) //Id del rol
				.addField(
					`🔢 ${client.language.ROLEINFO[4]}: `,
					"```" +
					`${Math.abs(role.rawPosition - message.guild.roles.cache.size)}` +
					"```",
					true
				) //Su pocision en cuanto los otros roles
				.addField(
					`🎩 ${client.language.ROLEINFO[5]}: `,
					"```" + `${role.hexColor}` + "```",
					true
				) //Su hexColor
				.addField(
					`<:roles:864116470648930304> ${client.language.ROLEINFO[6]}: `,
					role.mentionable
						? "```" + client.language.ROLEINFO[10] + "```"
						: "```" + client.language.ROLEINFO[11] + "```",
					true
				) //Devolvera true o false, segun si se puede mencionar este rol o no
				.addField(
					`<:guideblurple:863983092707229696> ${client.language.ROLEINFO[7]}: `,
					role.hoist
						? "```" + client.language.ROLEINFO[10] + "```"
						: "```" + client.language.ROLEINFO[11] + "```",
					true
				) //Devolvera true o false, segun si se esta separado(visible ante los roles) o no
				.addField(
					`<:cmd:864107735255220235> ${client.language.ROLEINFO[8]}: `,
					role.managed
						? "```" + client.language.ROLEINFO[10] + "```"
						: "```" + client.language.ROLEINFO[11] + "```",
					true
				) //Devolvera true o false, segun si lo creo el sistema(El propio discord)
				.setImage(guild.bannerURL({ dynamic: true }));

			return message.channel.send({ embeds: [rol]});
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
			} catch (e) { }
		}
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
