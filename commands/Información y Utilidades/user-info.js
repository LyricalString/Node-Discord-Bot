const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const moment = require('moment')
let CodeModel = require('../../models/code.js')
const { sendError } = require('../../utils/utils.js')

const flags = {
    DISCORD_EMPLOYEE: 'Discord Employee',
    PARTNERED_SERVER_OWNER: 'Discord Partner',
    BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
    BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
    HYPESQUAD_EVENTS: 'HypeSquad Events',
    HOUSE_BRAVERY: 'House of Bravery',
    HOUSE_BRILLIANCE: 'House of Brilliance',
    HOUSE_BALANCE: 'House of Balance',
    EARLY_SUPPORTER: 'Early Supporter',
    TEAM_USER: 'Team User',
    SYSTEM: 'System',
    VERIFIED_BOT: 'Verified Bot',
    EARLY_VERIFIED_BOT_DEVELOPER: 'Verified Bot Developer',
    DISCORD_CERTIFIED_MODERATOR: 'Discord Certified Moderator'
}

module.exports = class UserInfo extends Command {
    constructor() {
        super({
            name: 'user-info',
            description: ['Display info about a user.', 'Muestra información sobre un usuario.'],
            alias: ['whois', 'userinfo', 'profile'],
            usage: ['<@user/id>', '<@usuario/id>'],
            category: 'Info'
        })
    }
    async run(message, args) {
        try {
            let embed2 = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setDescription('Obteniendo el perfil...')
                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
            const sentMessage = await message.channel.send({
                content: ' ',
                embeds: [embed2]
            })
            let member
            if (args[0]) {
                member =
                    message.mentions.members.last() ||
                    (await message.guild.members.fetch(args[0]).catch((e) => {
                        return
                    }))
            } else {
                member = message.member
            }
            if (!member || !member.user) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.USERINFO[17])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return sentMessage.edit({ embeds: [errorembed] })
            }
            let emblemas = member.user.ROLES
            let badges = []
            const roles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map((role) => role.toString())
                .slice(0, -1)
            const userFlags = member.user.flags ? member.user.flags.toArray() : ' '
            const guild = message.guild
            const embed = new MessageEmbed().setTimestamp()
            if (member.user.displayAvatarURL())
                embed.setThumbnail(
                    member.user.displayAvatarURL({
                        dynamic: true
                    })
                )
            if (guild.name)
                embed.setAuthor(
                    guild.name,
                    guild.iconURL({
                        dynamic: true
                    })
                )
            if (guild.bannerURL())
                embed.setImage(
                    guild.bannerURL({
                        dynamic: true
                    })
                )
            if (member.displayHexColor && member.displayHexColor != '#000000') {
                embed.setColor(member.displayHexColor)
            } else {
                embed.setColor(process.env.EMBED_COLOR)
            }
            if (member.user && member.user.username)
                embed.addField(
                    `<:serverowner:863983092930183169> ${message.client.language.USERINFO[1]}`,
                    '```' + `${member.user.username}` + '```'
                )
            if (member.user && member.user.discriminator)
                embed.addField(
                    '<:textchannelblurple:863983092893220885> ' + message.client.language.USERINFO[2],
                    '```' + `${member.user.discriminator}` + '```',
                    true
                )
            if (member.id)
                embed.addField(
                    `<:settings:864103218828017694> ${message.client.language.USERINFO[3]}`,
                    '```' + `${member.id}` + '```',
                    true
                )
            if (userFlags)
                embed.addField(
                    `<:ticketblurple:863983092783382548> ${message.client.language.USERINFO[11]}`,
                    '```' +
                        `${
                            userFlags.length
                                ? userFlags.map((flag) => flags[flag]).join(', ')
                                : message.client.language.USERINFO[8]
                        }` +
                        '```',
                    true
                )
            if (member.user && member.user.createdTimestamp)
                embed.addField(
                    `📆 ${message.client.language.USERINFO[5]}`,
                    '```' +
                        `${moment(member.user.createdTimestamp).format('LT')}\n${moment(
                            member.user.createdTimestamp
                        ).format('LL')}\n${moment(member.user.createdTimestamp).fromNow()}` +
                        '```',
                    true
                )
            if (member.user && member.user.presence && member.user.presence.game)
                embed.addField(
                    `<:screenshare:864126217941942353> ${message.client.language.USERINFO[12]}`,
                    '```' + `${member.user.presence.game || message.client.language.USERINFO[16]}` + '```',
                    true
                )
            if (member.roles && member.roles.highest.id && member.roles.highest.name)
                embed.addField(
                    `<:upvote:864107632411541514> ${message.client.language.USERINFO[13]}`,
                    '```' +
                        `${
                            member.roles.highest.id === message.guild.id
                                ? message.client.language.USERINFO[8]
                                : member.roles.highest.name
                        }` +
                        '```',
                    true
                )
            if (member.joinedAt)
                embed.addField(
                    '<:join:864104115076595762>' + message.client.language.USERINFO[4],
                    '```' + `${moment(member.joinedAt).format('LL LTS')}` + '```',
                    true
                )
            if (member.roles)
                embed.addField(
                    `<:lupablurple:863983093030060062>${message.client.language.USERINFO[14]}`,
                    `${member.roles.hoist ? member.roles.hoist : message.client.language.USERINFO[8]}`,
                    true
                )
            if (member.user.displayAvatarURL())
                embed.addField(
                    '<:linkblurple:863983092711817247> Avatar',
                    `[${message.client.language.USERINFO[15]}](${member.user.displayAvatarURL({
                        dynamic: true
                    })})`,
                    true
                )
            if (emblemas && emblemas.Premium.Enabled) badges.push('<a:premium:866135287258939393>')
            if (emblemas && emblemas.EarlyPremium.Enabled) badges.push('<a:earlypremium:866135322886012978>')
            if (emblemas && emblemas.Tester.Enabled) badges.push('<:tester:871395085017813002>')
            if (emblemas && emblemas.Notifications.Enabled) badges.push('<:notifications:864103839266897951>')
            if (emblemas && emblemas.Developer.Enabled) badges.push('<:developer:866134938185367552>')
            if (emblemas && emblemas.Booster.Enabled) badges.push('<:serverbooster:864102069728313354>')
            if (emblemas && emblemas.Support.Enabled) badges.push('<:support:863983092702904350>')
            CodeModel.findOne({ USERID: message.author.id.toString() }).then((s, err) => {
                if (err) {
                    embed.addField(
                        message.client.language.USERINFO[18],
                        `${badges.length > 0 ? badges.join(' ') : message.client.language.USERINFO[8]}`,
                        true
                    )
                    if (roles[0])
                        embed.addField(
                            `<:star:864103299900243970> Roles [${roles.length}]`,
                            `${
                                roles.length < 10
                                    ? roles.join(' ')
                                    : roles.length > 10
                                    ? trimArray(roles)
                                    : message.client.language.USERINFO[8]
                            }`
                        )
                    return sentMessage.edit({ embeds: [embed] })
                }
                if (s) {
                    if (s.SERVERS >= 1) {
                        badges.push('<:25kEvent:877189363157585990>')
                    }
                    embed.addField(
                        message.client.language.USERINFO[18],
                        `${badges.length > 0 ? badges.join(' ') : message.client.language.USERINFO[8]}`,
                        true
                    )
                    if (roles[0])
                        embed.addField(
                            `<:star:864103299900243970> Roles [${roles.length}]`,
                            `${
                                roles.length < 10
                                    ? roles.join(' ')
                                    : roles.length >= 10
                                    ? trimArray(roles)
                                    : message.client.language.USERINFO[8]
                            }`
                        )
                    return sentMessage.edit({ embeds: [embed] })
                } else {
                    embed.addField(
                        message.client.language.USERINFO[18],
                        `${badges.length > 0 ? badges.join(' ') : message.client.language.USERINFO[8]}`,
                        true
                    )
                    if (roles[0])
                        embed.addField(
                            `<:star:864103299900243970> Roles [${roles.length}]`,
                            `${
                                roles.length < 10
                                    ? roles.join(' ')
                                    : roles.length > 10
                                    ? trimArray(roles)
                                    : message.client.language.USERINFO[8]
                            }`
                        )
                    return sentMessage.edit({ embeds: [embed] })
                }
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}

function trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen
        arr = arr.slice(0, maxLen)
        arr.push(`${len} more...`)
    }
    return arr
}
