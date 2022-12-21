const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Emoji extends Command {
    constructor(client) {
        super(client, {
            name: 'emoji',
            description: ['Creates a new emoji.', 'Crea un nuevo emoji.'],
            permissions: ['ADMINISTRATOR'],
            usage: ['<name> + image attached', '<nombre> + imagen adjunta'],
            category: 'Info',
            alias: ['emote'],
            cooldown: 1,
            botpermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
            args: true
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            if (!args[0]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.EMOJI[2]}\`${prefix}emoji ${client.language.EMOJI[3]}\`. ^^`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (message.attachments.size == 0) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.EMOJI[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            Array.from(message.attachments, ([key, value]) => {
                let attachment = value.attachment
                if (!attachment) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.EMOJI[1])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                try {
                    message.guild.emojis
                        .create(attachment, args[0], {})
                        .then((e) => {
                            const emoji = client.emojis.cache.get(e.id)
                            const embed = new MessageEmbed()
                                .setColor(process.env.EMBED_COLOR)
                                .setTitle(client.language.SUCCESSEMBED)
                                .setDescription(
                                    `${client.language.EMOJI[4]} ${emoji}. ${client.language.EMOJI[5]} \`:${args[0]}:\` ${client.language.EMOJI[6]}`
                                )
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({ embeds: [embed] })
                        })
                        .catch((e) => {
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(client.language.ERROREMBED)
                                .setDescription(client.language.EMOJI[7])
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({
                                embeds: [errorembed]
                            })
                        })
                } catch (e) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.EMOJI[8])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
