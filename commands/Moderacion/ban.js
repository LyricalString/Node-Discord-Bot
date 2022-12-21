const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const GuildSchema = require('../../models/guild.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: ['Bans a user.', 'Prohíbe a un usuario.'],
            usage: ['<@user> <reason>', '<@usuario> <razón>'],
            permissions: ['BAN_MEMBERS'],
            botpermissions: ['BAN_MEMBERS'],
            args: true,
            category: 'Moderacion',
            moderation: true,
            nochannel: true
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
                message.reply({
                    content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``
                })
            } else {
                if (!message.deleted) message.delete().catch((e) => console.log(e))
            }
            const user =
                message.mentions.members.first() ||
                (await message.guild.members.fetch(args[0]).catch((e) => {
                    return
                }))

            if (!user)
                return GuildSchema.findOne(
                    {
                        guildID: message.guild.id
                    },
                    async (s, err) => {
                        if (s) {
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(client.language.ERROREMBED)
                                .setDescription(
                                    `${client.language.BAN[3]} **\`${s.PREFIX}${client.language.BAN[4]}\`**`
                                )
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({
                                embeds: [errorembed]
                            })
                        } else if (!s) {
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(client.language.ERROREMBED)
                                .setDescription(
                                    `${client.language.BAN[3]} **\`${process.env.prefix}${client.language.BAN[4]}\`**`
                                )
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({
                                embeds: [errorembed]
                            })
                        }
                    }
                )
            if (user.id == message.author.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.BAN[5]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (user.id == client.user.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.BAN[6]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (user.roles.highest.position > message.member.roles.highest.position) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.BAN[7]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (!user.bannable) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.BAN[8]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            let reason = ''
            if (args.length > 1) {
                args.shift()
                reason = args.join(' ')
            }

            await user.ban({
                days: 1,
                reason: reason
            })

            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.BAN[9])
                .setDescription(
                    `<a:tick:836295873091862568> <@${user.id}> (**\`${user.user.tag}\`**) ${client.language.BAN[10]} **${message.guild.name}**`
                )
                .addFields({
                    name: client.language.BAN[11],
                    value: `**\`${reason != '' ? reason : '-'}\`**`,
                    inline: true
                })
                .addFields({
                    name: client.language.BAN[12],
                    value: `<@${message.member.id}> (**\`${message.member.user.tag}\`**)`,
                    inline: true
                })
                .setTimestamp()

            await message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
