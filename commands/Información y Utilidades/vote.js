const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Invite extends Command {
    constructor() {
        super({
            name: 'vote',
            description: ['Gives the votation link to vote the bot.', 'Te da el enlace para votar al bot.'],
            cooldown: 3,
            category: 'Info'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            let embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setDescription(message.client.language.VOTE)
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
