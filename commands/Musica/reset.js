const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Reset extends Command {
    constructor() {
        super({
            name: 'reset',
            alias: ['r', 'musicreset'],
            description: ["Resets Node's music functions.", 'Resetea las funciones de música de Node'],
            permissions: ['ADMINISTRATOR'],
            category: 'musica'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            const player = message.client.manager.players.get(message.guild.id)
            if (!player) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.RESET)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            player.destroy()
        } catch (e) {
            sendError(e, message)
        }
    }
}
