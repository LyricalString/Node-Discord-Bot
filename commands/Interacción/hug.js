const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { soyultro } = require('soyultro')

const { sendError } = require('../../utils/utils.js')

module.exports = class Hug extends Command {
    constructor(client) {
        super(client, {
            name: 'hug',
            description: ['Hugs the mentioned user.', 'Abraza al usuario mencionado.'],
            usage: ['<@user>', '<@usuario>'],
            category: 'Interaccion'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            let user
            if (args[0]) {
                user = message.mentions.members.first() || (await message.guild.members.fetch(args[0]).catch((e) => {}))
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
                        .setFooter({text: message.author.username, message.author.avatarURL()})
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
            if (!user) {
                let author = message.author.username
                let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                    .setTitle(`${author} ${client.language.HUG[3]} ${args.join(' ')}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setImage(soyultro('hug'))
                return message.channel.send({ embeds: [embed] })
            }
            if (user.id == message.author.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.HUG[1])
                    .setFooter({text: message.author.username, message.author.avatarURL()})
                return message.channel.send({ embeds: [errorembed] })
            }

            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${client.language.HUG[3]} ${user.user.username}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('hug'))
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
