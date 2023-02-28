const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Shrug extends Command {
    constructor() {
        super({
            name: 'shrug',
            description: ['Shows that you are shruging.', 'Muestra que estás encogiendote de hombros.'],
            category: 'Interaccion'
        })
    }
    async run(message, args) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.SHRUG[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('shrug'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
