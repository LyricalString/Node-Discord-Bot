const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Skip extends Command {
    constructor() {
        super({
            name: 'skip',
            description: ['Skips to the next song in queue', 'Salta a la siguiente canción en cola.'],
            category: 'musica',
            alias: ['s']
        })
    }
    async run(message, args, prefix) {
        try {
            const player = message.client.manager.players.get(message.guild.id)
            if (!player) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.SKIP[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (
                !message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR') &&
                player.voiceChannel != message.member.voice.channelId
            )
                return
            if (player.trackRepeat) player.setTrackRepeat(false)
            if (player.queueRepeat) player.setQueueRepeat(false)

            if (!player.queue.current) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.SKIP[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (player.voiceChannel) {
                if (
                    !message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR') &&
                    player.voiceChannel != message.member.voice.channelId
                )
                    return
            }
            const { title } = player.queue.current

            if (player) player.stop()
            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(message.client.language.SUCCESSEMBED)
                .setDescription(`${title} ${message.client.language.SKIP[4]}`)
                .setFooter({text: message.author.username, message.author.avatarURL()})
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
