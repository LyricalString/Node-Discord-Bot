const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Loop extends Command {
    constructor() {
        super({
            name: 'loop',
            description: ['Loop your song or queue!', '¡Haz un bucle con tu canción o cola!'],
            usage: ['<song/queue>', '<song/queue>'],
            alias: ['lp'],
            subcommands: ['song', 'queue'],
            botpermissions: ['CONNECT', 'SPEAK'],
            args: true,
            category: 'musica'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            const player = message.client.manager.players.get(message.guild.id)
            if (!player) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.LOOP[5])
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
            if (!args[0] || args[0].toLowerCase() == 'song') {
                if (!player.trackRepeat) {
                    player.setTrackRepeat(true)
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(message.client.language.LOOP[1])
                        .setTitle(`Loop`)
                    return message.channel.send({ embeds: [embed] })
                } else {
                    player.setTrackRepeat(false)
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(message.client.language.LOOP[2])
                        .setTitle(`Loop`)
                    return message.channel.send({ embeds: [embed] })
                }
            } else if (args[0].toLowerCase() == 'queue') {
                if (player.queueRepeat) {
                    player.setQueueRepeat(false)
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(message.client.language.LOOP[3])
                        .setTitle(`Loop`)
                    return message.channel.send({ embeds: [embed] })
                } else {
                    player.setQueueRepeat(true)
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(message.client.language.LOOP[4])
                        .setTitle(`Loop`)
                    return message.channel.send({ embeds: [embed] })
                }
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
