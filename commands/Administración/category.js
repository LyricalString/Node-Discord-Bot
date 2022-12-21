const { MessageEmbed } = require('discord.js')
const guildSchema = require('../../models/guild.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Ctegory extends Command {
    constructor() {
        super({
            name: 'category',
            description: [
                'Allows o denies the usage of commands from a category.',
                'Habilita o deshabilita el uso de comandos de una categoría.'
            ],
            permissions: ['ADMINISTRATOR'],
            subcommands: ['enable', 'disable', 'show', 'list'],
            cooldown: 1,
            nochannel: true,
            alias: ['cat', 'categoria'],
            usage: [
                '<enable/disable> (category name) or category <show/list>',
                '<enable/disable> (nombre de la categoría) o category <show/list>'
            ],
            category: 'Administracion',
            args: true
        })
    }
    async run(message, args, prefix, lang) {
        let categories = [
            'administracion',
            'diversion',
            'musica',
            'moderacion',
            'info',
            'interaccion',
            'sesiones',
            'administration',
            'fun',
            'music',
            'moderation',
            'info',
            'interaction',
            'sessions',
            'informacion',
            'information'
        ]
        try {
            if (args[0].toLowerCase() == 'disable' && args[1]) {
                let category = args[1].toLowerCase()
                if (!categories.includes(category)) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(
                            `**${args[1]}** ${message.client.language.CATEGORY[1]}${prefix}${message.client.language.CATEGORY[13]}`
                        )
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                guildSchema
                    .findOne({
                        guildID: message.guild.id
                    })
                    .then((s, err) => {
                        if (s && s.config.DISABLED_CATEGORIES) {
                            if (!s.config.DISABLED_CATEGORIES.includes(category)) {
                                s.config.DISABLED_CATEGORIES.push(category)
                                message.guild.config.DISABLED_CATEGORIES.push(category)
                                s.save().catch((err) => s.update())
                                const embed = new MessageEmbed()
                                    .setColor(process.env.EMBED_COLOR)
                                    .setTitle(message.client.language.SUCCESSEMBED)
                                    .setDescription(message.client.language.CATEGORY[2] + category)
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({ embeds: [embed] })
                            } else {
                                const errorembed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTitle(message.client.language.ERROREMBED)
                                    .setDescription(message.client.language.CATEGORY[3])
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({
                                    embeds: [errorembed]
                                })
                            }
                        }
                    })
            } else if (args[0].toLowerCase() === 'enable' && args[1]) {
                let category = args[1].toLowerCase()
                guildSchema
                    .findOne({
                        guildID: message.guild.id
                    })
                    .then((s, err) => {
                        if (s) {
                            if (s.config.DISABLED_CATEGORIES.includes(category)) {
                                s.config.DISABLED_CATEGORIES.splice(
                                    s.config.DISABLED_CATEGORIES.indexOf(category),
                                    s.config.DISABLED_CATEGORIES.indexOf(category) + 1
                                )
                                message.guild.config.DISABLED_CATEGORIES.splice(
                                    message.guild.config.DISABLED_CATEGORIES.indexOf(category),
                                    message.guild.config.DISABLED_CATEGORIES.indexOf(category) + 1
                                )
                                s.save().catch((err) => s.update())
                                const embed = new MessageEmbed()
                                    .setColor(process.env.EMBED_COLOR)
                                    .setFooter({
                                        text: message.client.language.CATEGORY[5] + category,
                                        iconURL: message.author.displayAvatarURL()
                                    })
                                    .setTimestamp()
                                message.channel.send({ embeds: [embed] })
                            } else {
                                const errorembed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTitle(message.client.language.ERROREMBED)
                                    .setDescription(message.client.language.CATEGORY[6])
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({
                                    embeds: [errorembed]
                                })
                            }
                        }
                    })
            } else if (args[0].toLowerCase() === 'show') {
                guildSchema
                    .findOne({
                        guildID: message.guild.id
                    })
                    .then((s, err) => {
                        if (s) {
                            if (!s.config.DISABLED_CATEGORIES[0]) {
                                const errorembed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTitle(message.client.language.ERROREMBED)
                                    .setDescription(message.client.language.CATEGORY[7])
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({
                                    embeds: [errorembed]
                                })
                            } else {
                                const embedadmins = new MessageEmbed()
                                    .setTitle(
                                        '<:IconPrivateThreadIcon:859608405497217044>' +
                                            message.client.language.CATEGORY[2]
                                    )
                                    .setColor(process.env.EMBED_COLOR)
                                    .setTimestamp()
                                for (var index = 0; index < s.config.DISABLED_CATEGORIES.length; index++) {
                                    let ListAdmin = s.config.DISABLED_CATEGORIES[index]
                                    embedadmins.addFields({ name: '\u200B', value: '- ' + ListAdmin })
                                }

                                message.channel.send({
                                    embed: embedadmins
                                })
                            }
                        }
                        return
                    })
            } else if (args[0].toLowerCase() === 'reset') {
                guildSchema
                    .findOne({
                        guildID: message.guild.id
                    })
                    .then((s, err) => {
                        if (err) console.error(err)
                        if (s) {
                            for (let index in s.config.DISABLED_CATEGORIES) {
                                s.config.DISABLED_CATEGORIES.splice(index)
                            }
                        }
                        s.save().catch((err) => s.update())
                        message.guild.config.DISABLED_CATEGORIES = []
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.SHOWLISTENINGCHANNEL[5])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    })
            } else if (args[0].toLowerCase() === 'list') {
                const embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(message.client.language.CATEGORY[14])
                    .setDescription(message.client.language.CATEGORY[15])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [embed] })
            } else {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.CATEGORY[9] + '`' + prefix + 'category' + '`')
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
