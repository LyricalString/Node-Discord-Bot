const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { soyultro } = require('soyultro')

const { sendError } = require('../../utils/utils.js')

module.exports = class Nope extends Command {
    constructor() {
        super({
            name: 'nope',
            description: ['Says no to the mentioned user.', 'Dice que no al usuario mencionado.'],
            alias: ['no'],
            usage: ['[@user]', '[@usuario]'],
            category: 'Interaccion'
        })
    }
    async run(message, args) {
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
                    let author = message.author.username
                    let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                        .setTitle(`${author} ${message.client.language.NOPE[4]}`)
                        .setColor(process.env.EMBED_COLOR)
                        .setImage(soyultro('nope'))
                    if (args.length > 1) {
                        args.shift()
                        const reason = args.join(' ')
                        embed.addFields({ name: '\u200b', value: reason })
                    }
                    return message.channel.send({ embeds: [embed] })
                }
            }
            if (!user) {
                let author = message.author.username
                let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                    .setTitle(`${author} ${message.client.language.NOPE[3]} ${args.join(' ')}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setImage(soyultro('nope'))
                return message.channel.send({ embeds: [embed] })
            }
            if (user.id == message.author.id) {
                let author = message.author.username
                let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                    .setTitle(`${author} ${message.client.language.NOPE[4]}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setImage(soyultro('nope'))
                if (args.length > 1) {
                    args.shift()
                    const reason = args.join(' ')
                    embed.addFields({ name: '\u200b', value: reason })
                }
                return message.channel.send({ embeds: [embed] })
            }

            let author = message.author.username
            let embed = new MessageEmbed() //Preferible mandarlo en un Embed ya que la respuesta es un link
                .setTitle(`${author} ${message.client.language.NOPE[3]} ${user.user.username}`)
                .setColor(process.env.EMBED_COLOR)
                .setImage(soyultro('nope'))

            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
