const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class BannedWordsRefresh extends Command {
    constructor(client) {
        super(client, {
            name: 'bannedwordsrefresh',
            description: ['Refreshes the banned words.', 'Refresca las palabras baneadas.'],
            role: 'developer',
            alias: ['bwr'],
            category: 'Administracion',
            nochannel: true
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            const dirección = '../../predefinedBannedWords.json'
            delete require.cache[require.resolve(dirección)]
            require('../../predefinedBannedWords.json')
            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.SUCCESSEMBED)
                .setDescription(`Se ha actualizado la lista de palabras baneadas.`)
                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
