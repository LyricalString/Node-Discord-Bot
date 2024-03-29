const { MessageEmbed } = require('discord.js')

const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Youtube extends Command {
    constructor() {
        super({
            name: 'youtube',
            botpermissions: ['CREATE_INSTANT_INVITE'],
            description: ['Starts a youtube session together.', 'Comienza una sesión de youtube.'],
            alias: ['yt'],
            cooldown: 5,
            category: 'Sesiones'
        })
    }
    async run(message, args) {
        try {
            // check if the user is in a voice channel
            if (!message.member.voice.channel)
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(message.client.language.BETRAYAL[2])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    ]
                })

            // check if the bot has the permission to create instant invites
            if (
                !message.guild.me.permissions.has('CREATE_INSTANT_INVITE') ||
                !message.member.voice.channel.permissionsFor(message.guild.me).has('CREATE_INSTANT_INVITE')
            )
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(message.client.language.YOUTUBE[5])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    ]
                })

            // create an invite to the voice channel
            const maxAge = args[0]?.toLowerCase() === '--unlimited' ? 0 : 900
            const invite = await message.member.voice.channel.createInvite({
                targetApplication: '880218394199220334',
                targetType: 2,
                maxAge
            })

            // send the invite link to the user
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(
                            `<a:arrowright:835907836352397372> **${message.client.language.BETRAYAL[1]}(${invite.url} 'Enlace de Watch Together') <a:flechaizquierda:836295936673579048>**`
                        )
                ]
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
