const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class EightBall extends Command {
    constructor() {
        super({
            name: '8ball',
            description: ['Ask your question to 8ball.', 'Hazle tu pregunta a 8ball.'],
            usage: ['<question>', '<pregunta>'],
            category: 'diversion',
            args: true
        })
    }
    async run(message, args, prefix) {
        try {
            let respuesta = message.client.language.QUESTIONBALL[4]
            let argumentos = args.join(' ')
            if (!argumentos.includes('?')) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.QUESTIONBALL[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            var random = respuesta[Math.floor(Math.random() * respuesta.length)] //aqui decimos que va a elegir una respuesta random de el let respuesta
            const embed = new MessageEmbed() //definimos el embed
                .addFields({ name: message.client.language.QUESTIONBALL[1], value: `${args.join(' ')}` }) //primer valor decimos a su pregunta y en el segundo valor va la pregunta que iso el usuario
                .addFields({ name: message.client.language.QUESTIONBALL[2], value: `${random}` }) //primer valor decimos "Mi respuesta" y en el segundo decimos que va a agarrar el var random
                .setColor(process.env.EMBED_COLOR) //un color random
            message.channel.send({ embeds: [embed] }) //y que mande el embed
        } catch (e) {
            sendError(e, message)
        }
    }
}
