const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Nervous extends Command {
    constructor(client) {
        super(client, {
            name: 'nervous',
            description: ['Shows that you are nervous.', 'Muestra que estás nervioso.'],
            category: 'Interaccion'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${client.language.NERVOUS[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('nervous'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
