const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Snipe extends Command {
    constructor(client) {
        super(client, {
            name: 'snipe',
            description: ['Gets the latest message deleted!', '¡Obtiene el último mensaje eliminado!'],
            cooldown: 5,
            usage: ['<#channel>', '<#canal>'],
            permissions: ['MANAGE_MESSAGES'],
            nochannel: true,
            category: 'Moderacion',
            moderation: true
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
            const channel =
                message.mentions.channels.first() ||
                message.channel ||
                message.guild.channels.cache.find((channel) => channel.id === args[0])
            const msg = client.snipes.get(channel.id)
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setTitle(client.language.ERROREMBED)
                .setDescription(client.language.SNIPE[1])
                .setFooter({text: message.author.username, message.author.avatarURL()})
            if (!msg || !msg.delete) {
                message.channel.send({ embeds: [errorembed] }).then((m) => {
                    try {
                        setTimeout(() => m.delete(), 5000)
                    } catch (e) {}
                })
            } else {
                const main = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setAuthor(`${client.language.SNIPE[2]} ${msg.delete.tag}`, msg.delete.displayAvatarURL())
                    .addFields({name: client.language.SNIPE[3], value: `<#${msg.canal.id}>`})
                    .setTimestamp()
                if (msg.content) main.setDescription(msg.content)
                if (msg.embed) {
                    const embed = new MessageEmbed()
                    embed.setAuthor(`${client.language.SNIPE[2]} ${msg.delete.tag}`, msg.delete.displayAvatarURL())
                    if (msg.title) embed.setTitle(msg.title)
                    if (msg.description) embed.setDescription(msg.description)
                    if (msg.url) embed.setURL(msg.url)
                    if (msg.color) embed.setColor(msg.color)
                    if (msg.timestamp) embed.setTimestamp(msg.timestamp)
                    for (let field in msg.fields) {
                        embed.addFields({name: msg.fields[field].name, msg.fields[field].value, value: msg.fields[field].inline})
                    }
                    //if (msg.fields[0]) embed.addField(msg.fields)
                    if (msg.thumbnail) embed.setThumbnail(msg.thumbnail.url)
                    if (msg.image) embed.setImage(msg.image)
                    if (msg.footer) embed.setFooter({text: msg.footer.text})
                    return message.author.send({ embeds: [embed] }).then(() => {
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(client.language.SUCCESSEMBED)
                            .setDescription(`¡Te he enviado una copia del mensaje por privado!`)
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        message.channel.send({ embeds: [embed] })
                    })
                }
                message.channel.send({ embeds: [main] })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
