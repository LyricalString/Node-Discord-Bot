const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Cringe extends Command {
    constructor() {
        super({
            name: 'cringe',
            description: ['Shows that something is giving you cringe.', 'Muestra que alguien te está dando cringe.'],
            category: 'Interaccion'
        })
    }
    async run(message, args) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.CRINGE[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('cringe'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
