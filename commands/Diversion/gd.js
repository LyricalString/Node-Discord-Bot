const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class GD extends Command {
    constructor() {
        super({
            name: 'gd',
            description: ['Shows an embed with the text input.', 'Muestra un embed con la entrada de texto.'],
            usage: ['<text>', '<texto>'],
            category: 'diversion',
            args: true
        })
    }
    async run(message, args, prefix, lang) {
        try {
            let args2 = args.join('%20')
            if (args2.length > 50) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.GD[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            const exampleEmbed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setImage(`https://gdcolon.com/tools/gdlogo/img/${args2}`)
            message.channel.send({ embeds: [exampleEmbed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
