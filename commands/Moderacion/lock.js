const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Lock extends Command {
    constructor() {
        super({
            name: 'lock',
            description: ['Locks the channel.', 'Bloquea el canal.'],
            permissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
            botpermissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
            moderation: true,
            category: 'Moderacion',
            nochannel: true
        })
    }
    async run(message, args, prefix) {
        try {
            if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_GUILD')) {
                message.reply({
                    content: `${message.client.language.MESSAGE[1]} \`"MANAGE_GUILD"\``
                })
            }
            if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
                message.reply({
                    content: `${message.client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``
                })
            } else {
                if (!message.deleted) message.delete().catch((e) => console.log(e))
            }
            message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: false
            })
            const embed = new MessageEmbed()
                .setTitle(message.client.language.LOCK[3])
                .setDescription(
                    `<:IconPrivateThreadIcon:859608405497217044> ${message.channel} ${message.client.language.LOCK[2]}`
                )
                .setColor(process.env.EMBED_COLOR)
            await message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
