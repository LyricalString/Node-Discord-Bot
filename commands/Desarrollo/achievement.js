const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Achievement extends Command {
    constructor() {
        super({
            name: 'achievement',
            description: ['Returns a custom Minecraft achievement!', '¡Devuelve un logro personalizado de Minecraft!'],
            alias: ['mcachievement', 'logro', 'mclogro'],
            usage: ['<block>, <title>, <message>, <message2>', '<bloque>, <titulo>, <mensaje>, <mensaje2>'],
            category: 'Diversion',
            //role: "tester",
            production: true
        })
    }
    async run(message, args) {
        try {
            let args1 = args.join(' ')
            let args2 = args1.split(', ')
            if (!args2[1] || !args2[2]) {
                const error = new MessageEmbed()
                    .setTitle(message.client.language.ACHIEVEMENT)
                    .addFields({ name: '\u200b', value: `\`${message.client.language.ACHIEVEMENTEMBED}\`` })
                    .setColor(process.env.EMBED_COLOR)
                message.channel.send({ embeds: [error] })
            }
            let title = args2[1].replace(/ /g, '..')
            let message2 = args2[2].replace(/ /g, '..')
            if (args2[3]) {
                let message3 = args2[3].replace(/ /g, '..')
                message.channel.send(
                    `https://minecraft-api.com/api/achivements/${args2[0]}/${title}/${message2}/${message3}`
                )
                return
            }
            message.channel.send(`https://minecraft-api.com/api/achivements/${args2[0]}/${title}/${message2}/`)
        } catch (e) {
            sendError(e, message)
        }
    }
}
