const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { soyultro } = require('soyultro')

const { sendError } = require('../../utils/utils.js')

module.exports = class Panic extends Command {
    constructor() {
        super({
            name: 'panic',
            description: ['Shows that you are panicking.', 'Muestra que estás en pánico.'],
            category: 'Interaccion'
        })
    }
    async run(message, args) {
        try {
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.PANIC[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('panic'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
