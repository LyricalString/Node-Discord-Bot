const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Slowmode extends Command {
    constructor(client) {
        super(client, {
            name: 'slowmode',
            description: ['Sets the slowmode on the channel.', 'Establece el modo lento a un canal.'],
            usage: ['<duration>', '<duración>'],
            permissions: ['MANAGE_CHANNELS'],
            botpermissions: ['MANAGE_CHANNELS'],
            args: true,
            moderation: true,
            category: 'Moderacion',
            nochannel: true
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
                message.reply({
                    content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``
                })
            } else {
                if (!message.deleted) message.delete().catch((e) => console.log(e))
            }
            if (isNaN(args[0]) || parseInt(args[0]) < 0) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.SLOWMODE[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (parseInt(args[0]) > 21600) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.SLOWMODE[4])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            const duration = args[0]

            message.channel.setRateLimitPerUser(duration)

            const embed = new MessageEmbed()
                .setTitle('SlowMode')
                .setColor(process.env.EMBED_COLOR)
                .setDescription(
                    `<a:tick:836295873091862568> ${client.language.SLOWMODE[5]} **\`${duration}\`** ${client.language.SLOWMODE[6]} **\`.slowmode 0\`**`
                )
                .addFields({ name: client.language.SLOWMODE[7], value: `<#${message.channel.id}>`, inline: true })
                .addFields({ name: client.language.SLOWMODE[8], value: `<@${message.author.id}>`, inline: true })
                .setTimestamp()
                .setFooter({
                    text: `${client.language.SLOWMODE[9]} ${message.member.displayName}`,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    })
                })

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
