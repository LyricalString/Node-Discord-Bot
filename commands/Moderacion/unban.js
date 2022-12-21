const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const GuildSchema = require('../../models/guild.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Ban extends Command {
    constructor() {
        super({
            name: 'unban',
            description: ['Unbans a user.', 'Quita el veto a un usuario.'],
            usage: ['<user id>', '<id del usuario>'],
            permissions: ['BAN_MEMBERS'],
            botpermissions: ['BAN_MEMBERS'],
            args: true,
            category: 'Moderacion',
            moderation: true,
            nochannel: true
        })
    }
    async run(message, args, prefix) {
        try {
            await message.guild.bans
                .remove(args[1])
                .then(() => {
                    const embed = new MessageEmbed()
                        .setColor(message.client.language.SUCCESSEMBED)
                        .setTitle(message.client.language.UNBAN[1])
                        .setDescription(
                            `${message.client.language.UNBAN[2]} ${args[1]} ${message.client.language.UNBAN[3]}`
                        )
                    message.channel.send({ embeds: [embed] })
                })
                .catch((e) => {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.UNBAN[4])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                })
        } catch (e) {
            sendError(e, message)
        }
    }
}
