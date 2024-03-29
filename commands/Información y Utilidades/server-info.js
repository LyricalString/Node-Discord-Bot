const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const moment = require('moment')
const momentDurationFormatSetup = require('moment-duration-format')
const { sendError } = require('../../utils/utils.js')
momentDurationFormatSetup(moment)

module.exports = class ServerInfo extends Command {
    constructor() {
        super({
            name: 'server-info',
            botpermissions: ['ATTACH_FILES'],
            description: ['Display info about this server.', 'Muestra información sobre este servidor.'],
            alias: ['serverinfo', 'serverinf', 'si'],
            cooldown: 5,
            category: 'Info'
        })
    }
    async run(message, args) {
        try {
            let region = {
                europe: 'Europa',
                brazil: 'Brasil',
                hongkong: 'Hong Kong',
                japan: 'Japón',
                russia: 'Rusia',
                singapore: 'Singapur',
                southafrica: 'Sudáfrica',
                sydney: 'Sydney',
                'us-central': 'Central US',
                'us-east': 'Este US',
                'us-south': 'Sur US',
                'us-west': 'Oeste US',
                'vip-us-east': 'VIP US Este',
                'eu-central': 'Europa Central',
                'eu-west': 'Europa Oeste',
                london: 'London',
                amsterdam: 'Amsterdam',
                india: 'India'
            }

            let verification = {
                NONE: message.client.language.SERVERINFO[1],
                LOW: message.client.language.SERVERINFO[2],
                MEDIUM: message.client.language.SERVERINFO[3],
                HIGH: message.client.language.SERVERINFO[4],
                VERY_HIGH: message.client.language.SERVERINFO[5]
            }

            let explicitContent = {
                DISABLED: message.client.language.SERVERINFO[6],
                MEMBERS_WITHOUT_ROLES: message.client.language.SERVERINFO[7],
                ALL_MEMBERS: message.client.language.SERVERINFO[8]
            }
            const guild = message.guild
            const channel = guild.channels.cache
                .sort((a, b) => b.position - a.position)
                .map((role) => role.toString())
                .slice(0, -1)
            const members = guild.members.cache
            const role = guild.roles.cache
                .sort((a, b) => b.position - a.position)
                .map((role) => role.toString())
                .slice(0, -1)
            const boost = guild.premiumTier
            const emojis = message.guild.emojis.cache
            const boostcount = guild.premiumSubscriptionCount
            const bots = members.filter((member) => member.user.bot).size
            const humans = members.filter((member) => !member.user.bot).size
            const create = moment(message.guild.createdTimestamp).format('DD-MM-YYYY')
            const banner = guild.banner

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setTimestamp()
                        .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                        .setTitle(guild.name)
                        .addField(
                            `<:serverowner:863983092930183169> ${message.client.language.SERVERINFO[9]}`,
                            `<@${guild.ownerId}>`
                        )
                        .addFields(
                            {
                                name: message.client.language.SERVERINFO[10],
                                value: '```' + `${guild.id}` + '```',
                                inline: true
                            },
                            {
                                name: `<:members:864107765050638367> ${message.client.language.SERVERINFO[11]}`,
                                value: '```' + `${guild.memberCount}` + '```',
                                inline: true
                            },
                            {
                                name: `😀 ${message.client.language.SERVERINFO[12]} [${emojis.size}]`,
                                value: `<:join:864104115076595762> ${message.client.language.SERVERINFO[13]}: ${
                                    emojis.filter((emoji) => !emoji.animated).size
                                }\n<a:flecha2:836295945423552522> ${message.client.language.SERVERINFO[14]}: ${
                                    emojis.filter((emoji) => emoji.animated).size
                                }`,
                                inline: true
                            },
                            {
                                name: `<:ticketblurple:863983092783382548> ${message.client.language.SERVERINFO[15]}`,
                                value: '```' + `${role.length}` + '```',
                                inline: true
                            },
                            {
                                name: `<:plus:864103028867727420> ${message.client.language.SERVERINFO[16]} [${guild.channels.cache.size}]`,
                                value: `<:category:864116468291338290> ${message.client.language.SERVERINFO[17]}: ${
                                    guild.channels.cache.filter((x) => x.type === 'GUILD_CATEGORY').size
                                }\n<:textchannelblurple:863983092893220885> ${
                                    message.client.language.SERVERINFO[18]
                                }: ${
                                    guild.channels.cache.filter((x) => x.type === 'GUILD_TEXT').size
                                }\n<:voicechannelblurple:864103406309867531> ${
                                    message.client.language.SERVERINFO[19]
                                }: ${guild.channels.cache.filter((x) => x.type === 'GUILD_VOICE').size}`,
                                inline: true
                            },
                            {
                                name: `📆 ${message.client.language.SERVERINFO[20]}`,
                                value: '```' + `${create}` + '```',
                                inline: true
                            },
                            {
                                name: `<:serverbooster:864102069728313354> ${message.client.language.SERVERINFO[21]}`,
                                value: '```' + `${boostcount}` + '```',
                                inline: true
                            },
                            {
                                name: `<:money:864102174908612619> ${message.client.language.SERVERINFO[22]}`,
                                value: `${
                                    boost
                                        ? '```' + `${message.client.language.SERVERINFO[23]} ${boost}` + '```'
                                        : '```' + `No` + '```'
                                }`,
                                inline: true
                            }
                        )
                        .addFields({
                            name: `**${message.client.language.SERVERINFO[25]}**`,
                            value: `${verification[guild.verificationLevel]}`
                        })
                        .addFields({
                            name: `**${message.client.language.SERVERINFO[26]}**`,
                            value: '```' + `${explicitContent[guild.explicitContentFilter]}` + '```'
                        })
                        .setImage(guild.bannerURL({ dynamic: true }))
                ]
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
