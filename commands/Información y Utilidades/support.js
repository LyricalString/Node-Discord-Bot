const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Support extends Command {
    constructor() {
        super({
            name: 'support',
            description: [
                'This command shows how to get support.',
                'Este comando muestra cómo obtener soporte de node.'
            ],
            cooldown: 5,
            category: 'Info'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            let embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setDescription(message.client.language.SUPPORT)
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
