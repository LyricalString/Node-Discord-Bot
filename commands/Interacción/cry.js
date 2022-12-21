const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Cry extends Command {
    constructor() {
        super({
            name: 'cry',
            description: ['Shows that you are crying.', 'Muestra que estás llorando.'],
            category: 'Interaccion'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.CRY[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('cry'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
