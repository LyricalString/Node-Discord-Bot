const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Happy extends Command {
    constructor() {
        super({
            name: 'happy',
            description: ['Shows that you are happy.', 'Muestra que estás feliz.'],
            category: 'Interaccion'
        })
    }
    async run(message, args) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.HAPPY[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('happy'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
