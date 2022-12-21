const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            description: ['Kicks a user.', 'Expulsa a un usuario.'],
            usage: ['<@user> <reason>', '<@usuario> <razón>'],
            permissions: ['KICK_MEMBERS'],
            botpermissions: ['KICK_MEMBERS'],
            args: true,
            moderation: true,
            category: 'Moderacion',
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

            if (!user) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(
                        `${client.language.KICK[3]} **\`${process.env.prefix}${client.language.KICK[4]}\`**`
                    )
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (user === client.user.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.KICK[5]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (user.id === message.author.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.KICK[6]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (user.roles.highest.position > message.member.roles.highest.position) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.KICK[7]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            if (!user.bannable) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(`${client.language.KICK[8]}`)
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            let reason = ''
            if (args.length > 1) {
                args.shift()
                reason = args.join(' ')
            }
            await user.kick({
                reason: reason
            })

            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(client.language.KICK[9])
                .setDescription(
                    `<a:tick:836295873091862568> <@${user.id}> (**\`${user.user.tag}\`**) ${client.language.KICK[10]} **${message.guild.name}**`
                )
                .addFields({
                    name: client.language.KICK[11],
                    value: `**\`${reason != '' ? reason : '-'}\`**`,
                    inline: true
                })
                .addField(
                    client.language.KICK[12],
                    `<@${message.member.id}> (**\`${message.member.user.tag}\`**)`,
                    true
                )
                .setTimestamp()
            await message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
