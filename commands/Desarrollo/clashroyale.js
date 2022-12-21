const axios = require('axios')

const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class ClashRoyale extends Command {
    constructor(client) {
        super(client, {
            name: 'clashroyale',
            description: ['Display info about the Github account.', 'Muestra información sobre una cuenta de Github.'],
            usage: ['<username>', '<usuario>'],
            args: false,
            production: true,
            alias: ['clashroyale'],
            category: 'Info'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            if (!args[0]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.INSTAGRAM[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            const sentMessage = await message.channel.send(client.language.TIKTOK[1])
            let response, details
            response = await axios
                .get(`https://api.clashroyale.com/v1/players/#V9rqulj`, {
                    headers: {
                        method: 'GET',
                        scheme: 'https',
                        'accept-encoding': 'gzip, deflate, br',
                        'accept-language': 'en,es-ES;q=0.9,es;q=0.8',
                        'user-agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
                    }
                })
                .catch((e) => {
                    return sentMessage.edit('Ese usuario no existe.')
                })
            const account = await response.data
            console.log(account)
            if (!account) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.INSTAGRAM[13])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (!account.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.INSTAGRAM[13])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            const embed2 = new MessageEmbed().setDescription(response).setColor(process.env.EMBED_COLOR)

            sentMessage.edit({ embed: embed2 })
        } catch (e) {
            sendError(e, message)
        }
    }
}

function formatNumber(parameter) {
    if (parameter.toString().length >= 7) {
        return parameter.toString() / 1000000 + 'M'
    } else if (parameter.toString().length >= 5) {
        return parameter.toString() / 1000 + 'K'
    } else {
        return parameter.toString()
    }
}
