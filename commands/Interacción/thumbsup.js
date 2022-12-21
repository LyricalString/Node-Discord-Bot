const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class ThumbsUp extends Command {
    constructor(client) {
        super(client, {
            name: 'thumbsup',
            description: [
                'Shows that you are saying yes with your thumb.',
                'Muestra que estás diciendo que sí con el pulgar.'
            ],
            category: 'Interaccion'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${client.language.THUMBSUP[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('thumbsup'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
