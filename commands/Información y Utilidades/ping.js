const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: ['Shows the real-time ping of the bot.', 'Muestra el ping en tiempo real del bot.'],
            cooldown: 5,
            category: 'Info'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            let ping = Math.abs(message.createdTimestamp - Date.now())
            const embed = new MessageEmbed()

                .setTitle(`Ping:`)
                .setColor(process.env.EMBED_COLOR)
                .addFields({
                    name: `API: ${Math.round(message.client.ws.ping)} ms`,
                    value: message.client.language.PING[1]
                })
                .addFields({ name: `Bot: ${ping} ms`, value: message.client.language.PING[2] })
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
