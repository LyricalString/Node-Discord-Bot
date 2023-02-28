const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Seek extends Command {
    constructor() {
        super({
            name: 'seek',
            description: ['Skips to a timestamp in the song.', 'Avanza hasta cierto segundo en la cancion.'],
            usage: [],
            category: 'musica',
            args: true,
            role: 'tester'
        })
    }
    async run(message, args) {
        try {
            if (isNaN(args[0])) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(
                        `${message.client.language.SEEK[1]} ${prefix}seek <${message.client.language.SEEK[2]}>`
                    )
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            const player = message.client.manager.players.get(message.guild.id)
            if (args[0] * 1000 >= player.queue.current.length || args[0] < 0) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.SEEK[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            player.seek(args[0] * 1000)
            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(message.client.language.SUCCESSEMBED)
                .setDescription(`${message.client.language.SEEK[4]} ${args[0]}${message.client.language.SEEK[5]}`)
                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
