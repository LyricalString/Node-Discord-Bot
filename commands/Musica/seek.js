const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Seek extends Command {
    constructor(client) {
        super(client, {
            name: 'seek',
            description: ['Skips to a timestamp in the song.', 'Avanza hasta cierto segundo en la cancion.'],
            usage: [],
            category: 'musica',
            args: true,
            role: 'tester'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            if (isNaN(args[0])) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.SEEK[1]} ${prefix}seek <${client.language.SEEK[2]}>`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            const player = client.manager.players.get(message.guild.id)
            if (args[0] * 1000 >= player.queue.current.length || args[0] < 0) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.SEEK[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            player.seek(args[0] * 1000)
            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.SUCCESSEMBED)
                .setDescription(`${client.language.SEEK[4]} ${args[0]}${client.language.SEEK[5]}`)
                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
