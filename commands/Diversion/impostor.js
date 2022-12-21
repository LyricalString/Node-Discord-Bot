const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Impostor extends Command {
    constructor() {
        super({
            name: 'impostor',
            description: ["Are you the impostor? Let's try it.", '¿Eres el impostor? Probémoslo.'],
            usage: ['<@user/id>', '<@usuario/id>'],
            alias: ['sus', 'suspicious'],
            category: 'diversion'
        })
    }
    async run(message, args) {
        try {
            let mencionado
            if (args[0]) {
                mencionado =
                    message.mentions.members.first() ||
                    (await message.guild.members.fetch(args[0].replace('<@', '').replace('>', '')).catch((e) => {
                        return
                    }))
            }
            if (!mencionado && args[0]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.IMPOSTOR[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            let random = [message.client.language.IMPOSTOR[1], message.client.language.IMPOSTOR[2]] //Hacemos frases para ver si es o no

            if (!mencionado)
                //Si el autor no menciono a nadie

                return message.channel.send(`. 　　　。　　　　•　 　ﾟ　　。 　　.
    
            　　　.　　　 　　.　　　　　。　　 。　. 　
    
            .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•
    
            　　ﾟ　　 ${message.author.username} ${random[Math.floor(Math.random() * random.length)]} 　 。　.
    
            　　'　　　  　 　　。     ,         ﾟ             ,   ﾟ      .       ,        .             ,
    
            　　ﾟ　　　.　　　. ,　　　　.　 .`) //Enviamos el mensaje

            //Pero si menciona

            message.channel.send(`. 　　　。　　　　•　 　ﾟ　　。 　　.
    
            　　　.　　　 　　.　　　　　。　　 。　. 　
    
            .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•.                                     .
    
            　　ﾟ　　 ${mencionado.user.username} ${random[Math.floor(Math.random() * random.length)]} 　 。　.
    
            　　'　　　  　 　　。                                          .
            。  
            　　ﾟ　　　.　　　. ,　　　　.　 .`)
        } catch (e) {
            sendError(e, message)
        }
    }
}
