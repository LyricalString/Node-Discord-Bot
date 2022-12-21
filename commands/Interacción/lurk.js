const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Lurk extends Command {
    constructor() {
        super({
            name: 'lurk',
            description: ['Shows that you are lurking.', 'Muestra que estás espiando.'],
            category: 'Interaccion'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.LURK[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('lurk'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
