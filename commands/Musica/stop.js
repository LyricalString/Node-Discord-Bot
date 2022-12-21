const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class stop extends Command {
    constructor() {
        super({
            name: 'stop',
            description: ['Stops and deletes the current song.', 'Detiene y elimina la cola de reproducción.'],
            category: 'musica',
            botpermissions: ['ADD_REACTIONS'],
            alias: ['leave', 'l']
        })
    }
    async run(message, args, prefix) {
        try {
            const player = message.client.manager.players.get(message.guild.id)
            if (!player) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.STOP)
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
            player.destroy()
            return message.react('⏹')
        } catch (e) {
            sendError(e, message)
        }
    }
}
