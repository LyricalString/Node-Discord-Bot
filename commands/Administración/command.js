const { MessageEmbed } = require('discord.js')
const guildSchema = require('../../models/guild.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Command2 extends Command {
    constructor() {
        super({
            name: 'command',
            description: ['Allows o denies the usage of commands.', 'Habilita o deshabilita el uso de comandos.'],
            permissions: ['ADMINISTRATOR'],
            subcommands: ['enable', 'disable', 'show', 'reset'],
            cooldown: 1,
            nochannel: true,
            alias: ['cmd', 'comand'],
            usage: [
                '<enable/disable> (command name) or comand <show>',
                '<enable/disable> (nombre del comando) o command <show>'
            ],
            //role: "dev", //dev, tester, premium, voter
            category: 'administracion',
            args: true
        })
    }
    async run(message, args, prefix, lang) {
        try {
            if (args[0].toLowerCase() === 'disable' && args[1]) {
                if (!message.client.commands.get(args[1])) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(`**${args[1]}** ${message.client.language.COMMAND[1]}`)
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                let command = args[1].toLowerCase()
                if (args[1].toLowerCase() == 'command') return
                guildSchema
                    .findOne({
                        guildID: message.guild.id
                    })
                    .then((s, err) => {
                        if (s) {
                            if (!s.config.DISABLED_COMMANDS.includes(command)) {
                                s.config.DISABLED_COMMANDS.push(command)
                                message.guild.config.DISABLED_COMMANDS.push(command)
                                s.save().catch((err) => s.update())
                                const embed = new MessageEmbed()
                                    .setColor(process.env.EMBED_COLOR)
                                    .setTitle(message.client.language.SUCCESSEMBED)
                                    .setDescription(message.client.language.COMMAND[2] + command)
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({ embeds: [embed] })
                            } else {
                                const errorembed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTitle(message.client.language.ERROREMBED)
                                    .setDescription(message.client.language.COMMAND[3])
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({
                                    embeds: [errorembed]
                                })
                            }
                        }
                    })
            } else if (args[0].toLowerCase() === 'enable' && args[1]) {
                if (!message.client.commands.get(args[1])) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.COMMAND[4])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                let command = args[1]
                guildSchema
                    .findOne({
                        guildID: message.guild.id
                    })
                    .then((s, err) => {
                        if (s) {
                            if (s.config.DISABLED_COMMANDS.includes(command)) {
                                s.config.DISABLED_COMMANDS.splice(
                                    s.config.DISABLED_COMMANDS.indexOf(command),
                                    s.config.DISABLED_COMMANDS.indexOf(command) + 1
                                )
                                message.guild.config.DISABLED_COMMANDS.splice(
                                    message.guild.config.DISABLED_COMMANDS.indexOf(command),
                                    message.guild.config.DISABLED_COMMANDS.indexOf(command) + 1
                                )
                                s.save().catch((err) => s.update())
                                const embed = new MessageEmbed()
                                    .setColor(process.env.EMBED_COLOR)
                                    .setTitle(message.client.language.SUCCESSEMBED)
                                    .setDescription(message.client.language.COMMAND[5] + command)
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({ embeds: [embed] })
                            } else {
                                const errorembed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTitle(message.client.language.ERROREMBED)
                                    .setDescription(message.client.language.COMMAND[6])
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
                            if (!s.config.DISABLED_COMMANDS[0]) {
                                const errorembed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTitle(message.client.language.ERROREMBED)
                                    .setDescription(message.client.language.COMMAND[7])
                                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                                return message.channel.send({
                                    embeds: [errorembed]
                                })
                            } else {
                                const embedadmins = new MessageEmbed()
                                    .setTitle(
                                        '<:IconPrivateThreadIcon:859608405497217044>' +
                                            message.client.language.COMMAND[8]
                                    )
                                    .setColor(process.env.EMBED_COLOR)
                                    .setTimestamp()
                                for (var index = 0; index < s.config.DISABLED_COMMANDS.length; index++) {
                                    let ListAdmin = s.config.DISABLED_COMMANDS[index]
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
                            for (let index in s.CHANNELID) {
                                s.config.DISABLED_COMMANDS.splice(index)
                            }
                        }
                        s.save().catch((err) => s.update())
                        message.guild.config.DISABLED_COMMANDS = []
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.SHOWLISTENINGCHANNEL[5])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    })
            } else {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.COMMAND[9] + '`' + prefix + 'command' + '`')
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
