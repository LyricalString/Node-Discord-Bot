const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const moment = require('moment')
const momentDurationFormatSetup = require('moment-duration-format')
momentDurationFormatSetup(moment)

const { sendError } = require('../../utils/utils.js')

module.exports = class NowPlaying extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            description: ['Shows the actual song being reproduced.', 'Muestra la canción que está siendo reproducida.'],
            alias: ['np'],
            botpermissions: ['ADD_REACTIONS'],
            category: 'musica'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            const { channel } = message.member.voice
            const player = client.manager.players.get(message.guild.id)
            if (!player) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.NOWPLAYING[2])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (!channel) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.NOWPLAYING[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            const { title, author, duration, requester, uri, identifier } = player.queue.current
            const parsedCurrentDuration = moment
                .duration(player.position, 'milliseconds')
                .format('mm:ss', { trim: false })
            const parsedDuration = moment.duration(duration, 'milliseconds').format('mm:ss', { trim: false })
            const part = Math.floor((player.position / duration) * 30)
            const uni = player.playing ? '▶' : '⏸️'
            const thumbnail = `https://img.youtube.com/vi/${identifier}/maxresdefault.jpg`
            const user = `<@${requester.id}>`
            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setAuthor(
                    player.playing ? client.language.NOWPLAYING[3] : client.language.NOWPLAYING[4],
                    'https://i.imgur.com/CCqeomm.gif'
                )
                .setThumbnail(thumbnail)
                .setDescription(`**[${title}](${uri})**`)
                .addField(
                    `${client.language.NOWPLAYING[7]} \`[${parsedDuration}]\``,
                    `\`\`\`${uni} ${'─'.repeat(part) + '⚪' + '─'.repeat(30 - part)} ${parsedCurrentDuration}\`\`\``
                )
            if (author) embed.addFields({ name: client.language.NOWPLAYING[5], author, value: true })
            if (user) embed.addFields({ name: client.language.NOWPLAYING[6], user, value: true })
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
