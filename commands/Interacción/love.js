const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Love extends Command {
    constructor(client) {
        super(client, {
            name: 'love',
            description: ['Shows the love between you and a user.', 'Muestra el amor entre tú y un usuario.'],
            usage: ['<@user>', '<@usuario>'],
            category: 'Interaccion'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            let user
            if (args[0]) {
                user =
                    message.mentions.members.first() ||
                    (await message.guild.members.fetch(args[0]).catch((e) => {
                        return
                    }))
            } else {
                if (message.mentions.repliedUser) {
                    user = await message.guild.members.fetch(message.mentions.repliedUser.id).catch((e) => {
                        return
                    })
                } else {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.NOARGS)
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
            if (!user) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.LOVE[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (!user.user) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.LOVE[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (user.user.id == message.author.id) {
                let embed = new MessageEmbed()
                    .setTimestamp()
                    .setColor(process.env.EMBED_COLOR)
                    .setFooter({ text: client.language.LOVE[2], iconURL: message.author.displayAvatarURL() })
                return message.channel.send({ embeds: [embed] })
            }
            if (user.user.id == client.user.id) {
                let embed = new MessageEmbed()
                    .setTimestamp()
                    .setColor(process.env.EMBED_COLOR)
                    .setFooter({ text: client.language.LOVE[3], iconURL: message.author.displayAvatarURL() })
                return message.channel.send({ embeds: [embed] })
            }

            const random = Math.floor(Math.random() * 100)
            let emoji = ''
            if (random < 50) {
                emoji = '<a:331263527c8547b29dc5d4c1ccca311b:835912709605949541>'
            } else if (random < 80) {
                emoji = '<a:239cb599aefe44e38294b04b3d86aec5:835912603528069132> ' // Un pequeño Match.Floor para hacerlo random y no de el mismo resultado!
            } else if (random < 101) {
                emoji = '<a:pog:835912234201907220>'
            }
            const { soyultro } = require('soyultro')
            let resp = [
                client.language.LOVE[4] +
                    `${message.author.username} & ${user.user.username}` +
                    client.language.LOVE[5],
                client.language.LOVE[6] + `${message.author.username} & ${user.user.username}` + client.language.LOVE[7]
            ]
            let msg = resp[Math.floor(Math.random() * resp.length)]
            const embed = new MessageEmbed()
                .setAuthor(`${msg}`)
                .setDescription(`${emoji} ${random}% ${emoji}`) //Resultado aleatorio de lo anterior estructurado
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('love'))
            if (args.length > 1) {
                args.shift()
                const reason = args.join(' ')
                embed.addFields({ name: '\u200b', value: reason })
            }
            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
