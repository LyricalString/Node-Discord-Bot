const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Sad extends Command {
    constructor() {
        super({
            name: 'sad',
            description: ['Shows that you are sad.', 'Muestra que estás triste.'],
            category: 'Interaccion'
        })
    }
    async run(message, args, prefix) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.SAD[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('sad'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
