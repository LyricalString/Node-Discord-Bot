const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class FacePalm extends Command {
    constructor(client) {
        super(client, {
            name: 'facepalm',
            alias: ['fp'],
            description: ['Shows that you are facepalming yourself.', 'Muestra que te golpeas la cara a tí mismo.'],
            category: 'Interaccion'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            const { soyultro } = require('soyultro')
            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${client.language.DIE[1]}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('facepalm'))

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
