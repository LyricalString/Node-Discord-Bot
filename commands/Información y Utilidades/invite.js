const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            description: ['Give the invite link for Node Bot.', 'Te da el enlace de invitación para Node Bot.'],
            alias: ['invitacion', 'invitación', 'invitation', 'inv'],
            cooldown: 3,
            category: 'Info'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            let embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(client.language.INVITE)
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
