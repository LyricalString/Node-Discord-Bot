const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const GuildSchema = require('../../models/guild.js')
const { sendError } = require('../../utils/utils.js')
module.exports = class Prefix extends Command {
    constructor() {
        super({
            name: 'prefix',
            description: ['Sets a new prefix for Node.', 'Establece un nuevo prefijo para Node.'],
            usage: ['set <new prefix> or reset', 'set <nuevo prefijo> or reset'],
            permissions: ['ADMINISTRATOR'],
            subcommands: ['set', 'reset'],
            args: true,
            category: 'administracion'
        })
    }
    async run(message.client, message, args, prefix2, lang) {
        try {
            let prefix
            if (args[0]) {
                if (args[0].toLowerCase() == 'set') {
                    if (args[1]) {
                        prefix = args[1].toLowerCase()
                        if (prefix == '') {
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(message.client.language.ERROREMBED)
                                .setDescription(
                                    `${message.client.language.PREFIX[2]} \`${process.env.prefix}prefix set <${message.client.language.PREFIX[3]}>\``
                                )
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({
                                embeds: [errorembed]
                            })
                        }
                        GuildSchema.findOne({
                            guildID: message.guild.id
                        }).then((data) => {
                            prefix = data.PREFIX
                            data.PREFIX = args[1].toLowerCase()
                            data.save().catch((err) => console.error(err))
                        })
                        message.guild.prefix = args[1].toLowerCase()
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(`${message.client.language.PREFIX[1]} \`${prefix}\``)
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(
                                `${message.client.language.PREFIX[2]} \`${process.env.prefix}prefix set <${message.client.language.PREFIX[3]}>\``
                            )
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [errorembed] })
                    }
                }
                if (args[0] == 'reset') {
                    GuildSchema.findOne({
                        guildID: message.guild.id
                    }).then((data) => {
                        data.PREFIX = '.'
                        data.save().catch((err) => console.error(err))
                    })
                    message.guild.prefix = '.'
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setTitle(message.client.language.SUCCESSEMBED)
                        .setDescription(`Se ha reseteado el prefix, ahora vuelve a ser \`.\``)
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [embed] })
                } else {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.PREFIX[4])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
