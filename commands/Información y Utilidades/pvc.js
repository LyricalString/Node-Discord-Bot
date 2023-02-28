const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const guildModel = require('../../models/guild.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class PVC extends Command {
    constructor() {
        super({
            name: 'pvc',
            description: ['Opens/Closes your Private Channel.', 'Abre/cierra su canal privado.'],
            args: true,
            cooldown: 3,
            usage: ['<open/close/ban/unban>', '<open/close/ban/unban>'],
            category: 'Info'
        })
    }
    async run(message, args) {
        try {
            guildModel.findOne({ guildID: message.guild.id.toString() }).then(async (s, err) => {
                if (err) return
                if (!s) return
                let channel = message.guild.channels.cache.get(message.member.voice.channelId)
                if (!s.config.Pvc) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(
                            'Debes de configurar previamente el módulo de Private Voice Channels desde /config pvc'
                        )
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                if (
                    !channel ||
                    channel.parentId != s.config.Pvc.Category ||
                    s.config.Pvc.TemporaryChannels.indexOf(channel.id + message.author.id) == -1
                ) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.PVC[1] + '<#' + s.config.Pvc.StartingChannel + '>')
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                if (args[0].toLowerCase() == 'open') {
                    channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                        VIEW_CHANNEL: true
                    })
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(
                            `<@${message.author.id}> ${message.client.language.PVC[2]}`,
                            message.author.displayAvatarURL()
                        )
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })
                } else if (args[0].toLowerCase() == 'close') {
                    channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                        VIEW_CHANNEL: false
                    })
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(
                            `<@${message.author.id}> ${message.client.language.PVC[3]}`,
                            message.author.displayAvatarURL()
                        )
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })
                } else if (args[0].toLowerCase() == 'ban') {
                    if (!args[1]) {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(
                                `${message.client.language.PVC[4]} \`.pvc ban ${message.client.language.PVC[5]}\``
                            )
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({
                            embeds: [errorembed]
                        })
                    }
                    let miembro =
                        (await message.guild.members.fetch(args[1]).catch((e) => {
                            return
                        })) || message.mentions.members.first()
                    if (!miembro) {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(message.client.language.PVC[12])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({
                            embeds: [errorembed]
                        })
                    }
                    miembro.voice.disconnect()
                    channel.permissionOverwrites.edit(miembro, {
                        VIEW_CHANNEL: false
                    })
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(
                            `${message.client.language.PVC[6]} <@${miembro.id}> ${message.client.language.PVC[7]}`,
                            message.author.displayAvatarURL()
                        )
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })
                } else if (args[0].toLowerCase() == 'unban') {
                    if (!args[1]) {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(
                                `${message.client.language.PVC[8]} \`.pvc unban ${message.client.language.PVC[9]}\``
                            )
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({
                            embeds: [errorembed]
                        })
                    }
                    let miembro =
                        (await message.guild.members.fetch(args[1]).catch((e) => {
                            return
                        })) || message.mentions.members.first()
                    if (!miembro) {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(message.client.language.PVC[12])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({
                            embeds: [errorembed]
                        })
                    }
                    channel.permissionOverwrites.edit(miembro, {
                        VIEW_CHANNEL: true
                    })
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setDescription(
                            `${message.client.language.PVC[10]} <@${miembro.id}> ${message.client.language.PVC[11]}`,
                            message.author.displayAvatarURL()
                        )
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })
                }
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
