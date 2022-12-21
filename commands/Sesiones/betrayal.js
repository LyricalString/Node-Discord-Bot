const { MessageEmbed } = require('discord.js')

const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Betrayal extends Command {
    constructor(client) {
        super(client, {
            name: 'betrayal',
            description: ['Starts a betrayal session together.', 'Comienza una sesión de betrayal.'],
            botpermissions: ['CREATE_INSTANT_INVITE'],
            category: 'Sesiones'
        })
    }
    /**
     *
     * @param {*} client
     * @param {import('discord.js').Message<true>} message
     * @param {*} args
     * @param {*} prefix
     * @param {*} lang
     * @param {*} webhookClient
     * @param {*} ipc
     * @returns
     */
    async run(client, message, args, prefix, lang, ipc) {
        try {
            // check if the user is in a voice channel
            if (!message.member.voice.channel)
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle(client.language.ERROREMBED)
                            .setDescription(client.language.BETRAYAL[2])
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
                            .setTitle(client.language.ERROREMBED)
                            .setDescription(client.language.YOUTUBE[5])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    ]
                })

            // create an invite to the voice channel
            const maxAge = args[0]?.toLowerCase() === '--unlimited' ? 0 : 900
            const invite = await message.member.voice.channel.createInvite({
                targetApplication: '773336526917861400',
                targetType: 2,
                maxAge
            })

            // send the invite link to the user
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(
                            `<a:arrowright:835907836352397372> **${client.language.BETRAYAL[1]}(${invite.url} 'Enlace de Betrayal.io') <a:flechaizquierda:836295936673579048>**`
                        )
                ]
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
