const { MessageEmbed } = require('discord.js')

const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Fishing extends Command {
    constructor() {
        super({
            name: 'fishing',
            botpermissions: ['CREATE_INSTANT_INVITE'],
            description: ['Starts a fishing session together.', 'Comienza una sesión de pescar.'],
            category: 'Sesiones'
        })
    }
    async run(message, args, prefix, lang) {
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
                targetApplication: '814288819477020702',
                targetType: 2,
                maxAge
            })

            // send the invite link to the user
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(
                            `<a:arrowright:835907836352397372> **${message.client.language.BETRAYAL[1]}(${invite.url} 'Enlace de Fishington.io') <a:flechaizquierda:836295936673579048>**`
                        )
                ]
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
