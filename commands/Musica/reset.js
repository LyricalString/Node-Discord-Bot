const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Reset extends Command {
    constructor(client) {
        super(client, {
            name: 'reset',
            alias: ['r', 'musicreset'],
            description: ["Resets Node's music functions.", 'Resetea las funciones de música de Node'],
            permissions: ['ADMINISTRATOR'],
            category: 'musica'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            const player = client.manager.players.get(message.guild.id)
            if (!player) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.RESET)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            player.destroy()
        } catch (e) {
            sendError(e, message)
        }
    }
}
