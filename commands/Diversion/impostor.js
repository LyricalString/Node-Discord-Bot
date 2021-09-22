require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

module.exports = class Impostor extends Command {
	constructor(client) {
		super(client, {
			name: "impostor",
			description: [
				"Are you the impostor? Let's try it.",
				"¿Eres el impostor? Probémoslo.",
			],
			usage: ["<@user/id>", "<@usuario/id>"],
			alias: ["sus", "suspicious"],
			category: "diversion",
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			let mencionado;
			if (args[0]) {
				mencionado = message.mentions.members.first() || await message.guild.members.fetch(args[0].replace("<@", "").replace(">", "")).catch(e => {
					return
				})
			}
			if (!mencionado && args[0]) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						client.language.IMPOSTOR[3]
					)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({embeds: [errorembed]})
			}
			let random = [client.language.IMPOSTOR[1], client.language.IMPOSTOR[2]]; //Hacemos frases para ver si es o no

			if (!mencionado)
				//Si el autor no menciono a nadie

				return message.channel.send(`. 　　　。　　　　•　 　ﾟ　　。 　　.
    
            　　　.　　　 　　.　　　　　。　　 。　. 　
    
            .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•
    
            　　ﾟ　　 ${message.author.username} ${random[Math.floor(Math.random() * random.length)]
					} 　 。　.
    
            　　'　　　  　 　　。     ,         ﾟ             ,   ﾟ      .       ,        .             ,
    
            　　ﾟ　　　.　　　. ,　　　　.　 .`); //Enviamos el mensaje

			//Pero si menciona

			message.channel.send(`. 　　　。　　　　•　 　ﾟ　　。 　　.
    
            　　　.　　　 　　.　　　　　。　　 。　. 　
    
            .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•.                                     .
    
            　　ﾟ　　 ${mencionado.user.username} ${random[Math.floor(Math.random() * random.length)]
				} 　 。　.
    
            　　'　　　  　 　　。                                          .
            。  
            　　ﾟ　　　.　　　. ,　　　　.　 .`);
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
