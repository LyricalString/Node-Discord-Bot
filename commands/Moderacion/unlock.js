const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Unlock extends Command {
    constructor(client) {
        super(client, {
            name: 'unlock',
            description: ['Unlocks the channel for everyone.', 'Desbloquea el canal para el público general.'],
            permissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
            botpermissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
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
            message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: true
            })
            const embed = new MessageEmbed()
                .setTitle(client.language.LOCK[3])
                .setDescription(`🔓 ${message.channel} ${client.language.UNLOCK}`)
                .setColor(process.env.EMBED_COLOR)
            await message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
