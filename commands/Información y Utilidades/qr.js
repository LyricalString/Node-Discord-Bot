require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const QRCode = require("easyqrcodejs-nodejs");
let argumentos;

module.exports = class qr extends Command {
	constructor(client) {
		super(client, {
			name: "qr",
			botpermissions: ["ATTACH_FILES"],
			description: [
				"Generate a QR code from a link.",
				"Genera un codigo QR desde un enlace inserta por el usuario.",
			],
			usage: [
				"<link or phrase to search> [image attached]",
				"<link o frase para buscar en google> [imagen adjunta]",
			], //recuerda que el usage debe de tener 2 items, el primero para inglés y el segundo para español.
			category: "Info",
			args: true,
			spam: true
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
				message.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``})
			  } else {
				if (!message.deleted) message.delete().catch((e) => console.log(e));
			  }
			if (!args[0]) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(client.language.QR[1])
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({ embeds: [errorembed] });
			}
			for (let index in args) {
				if (args[index].length > 500) {
					const errorembed = new Discord.MessageEmbed()
						.setColor("RED")
						.setTitle(client.language.ERROREMBED)
						.setDescription(client.language.VOICEKICK[1])
						.setFooter(message.author.username, message.author.avatarURL());
					return message.channel.send({ embeds: [errorembed] });
				}
			}
			var options = {
				// ====== Basic
				text: "", //PARAMETRO 0
				width: 256,
				height: 256,
				colorDark: `#000000`, //PARAMETRO 1
				colorLight: `#ffffff`, //PARAMETRO 2
				correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
				dotScale: 1,

				// ====== Logo
				/*logoWidth: width/3.5, / / fixed logo width.default is `width/3.5`
						logoHeight: heigth/3.5, // fixed logo height. default is `heigth/3.5`
						logoMaxWidth: undefined, // Maximum logo width. if set will ignore `logoWidth` value
						logoMaxHeight: undefined, // Maximum logo height. if set will ignore `logoHeight` value
						logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
						logoBackgroundTransparent: false, // Whether use transparent image, default is false
					    
						// ====== Backgroud Image
						/*
						backgroundImage: '', // Background Image
						backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1. 
						autoColor: false, // Automatic color adjustment(for data block)
						autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
						autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color
						*/
			};
			let count = 0;
			let count2 = 0;
			let argumentos = [];
			const embed = new Discord.MessageEmbed();
			for (let index in args) {
				if (isUrl(args[index])) {
					count += 1;
					options.text = args[index];
				} else if (
					(args[index] == "--transparent" ||
						args[index] == "--logotransparent") &&
					count2 < 1
				) {
					count2 += 1;
				} else if (args[index].startsWith("#") && args[index].length == 7) {
					options.colorDark = args[index];
				} else {
					argumentos.push(args[index]);
				}
			}
			if (count > 1)
				return message.channel.send(
					"Solo puedes insertar un URL para el código QR."
				);
			if (count == 0) {
				options.text = args.join(" ");
				argumentos = [];
			}
			if (message.attachments.size == 0) {
				var qrcode = new QRCode(options);
				//  Save PNG Images to file
				qrcode
					.saveImage({
						path: "./temp/qr.png", // file path
					})
					.then(() => {
						const cap = new Discord.MessageAttachment("./temp/qr.png");
						embed.setColor(process.env.EMBED_COLOR);
						embed.setImage("attachment://qr.png");
						embed.setFooter(message.author.username, message.author.avatarURL());

						if (argumentos[0]) embed.addField(argumentos.join(" "), "\u200b");
						message.channel.send({ embeds: [embed], files: [cap] }).then(() => {
							const fs = require("fs");
							// delete a file
							fs.unlink("./temp/qr.png", (err) => {
								if (err) {
									throw err;
								}
							});
						});
					});
			}
			Array.from(message.attachments, ([key, value]) => {
				if (
					value &&
					value.attachment
				)
					options.logo = value.attachment;
				if (args && args.length > 1) {
					if (
						count2 &&
						value &&
						value.attachment
					) {
						options.logoBackgroundTransparent = true;
					} else if (count2 && !value) {
						const errorembed = new Discord.MessageEmbed()
							.setColor("RED")
							.setTitle(client.language.ERROREMBED)
							.setDescription(client.language.QR[5])
							.setFooter(message.author.username, message.author.avatarURL());
						return message.channel.send({ embeds: [errorembed] });
					}
				}
				var qrcode = new QRCode(options);
				//  Save PNG Images to file
				qrcode
					.saveImage({
						path: "./temp/qr.png", // file path
					})
					.then(() => {
						const cap = new Discord.MessageAttachment("./temp/qr.png");
						embed.setColor(process.env.EMBED_COLOR);
						embed.setImage("attachment://qr.png");
						embed.setFooter(message.author.username, message.author.avatarURL());

						if (argumentos[0]) embed.addField(argumentos.join(" "), "\u200b");
						message.channel.send({ embeds: [embed], files: [cap] }).then(() => {
							const fs = require("fs");
							// delete a file
							fs.unlink("./temp/qr.png", (err) => {
								if (err) {
									throw err;
								}
							});
						});
					});
			})
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

function isUrl(s) {
	var regexp =
		/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(s);
}
