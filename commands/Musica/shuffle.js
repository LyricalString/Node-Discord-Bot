const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Shuffle extends Command {
    constructor() {
        super({
            name: 'shuffle',
            description: ['Shuffles the queue.', 'Revuelve la cola de reproducción.'],
            category: 'musica',
            botpermissions: ['ADD_REACTIONS'],
            alias: ['sh']
        })
    }
    async run(message, args, prefix) {
        try {
            const { channel } = message.member.voice
            const player = message.client.manager.players.get(message.guild.id)

            if (player && player.voiceChannel) {
                if (
                    !message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR') &&
                    player.voiceChannel != message.member.voice.channelId
                )
                    return
            }
            if (channel && player) {
                if (channel.id === player.voiceChannel) {
                    player.queue.shuffle()
                    message.react('🔀')
                }
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
