const Command = require('../../structures/Commandos.js')
const { MessageEmbed } = require('discord.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Embed extends Command {
    constructor() {
        super({
            name: 'embed',
            description: ['Sends an embed.', 'Envía un embed.'],
            usage: [
                '<Channel> + <Color> + <Title> + <Message>',
                '<Canal> + <Color> + <Título> + <Mensaje> (el símbolo de suma también)'
            ],
            permissions: ['ADMINISTRATOR'],
            cooldown: 1,
            category: 'Info',
            args: true
        })
    }
    async run(message, args) {
        try {
            args = args.join(' ').split(' + ')

            if (!args[0]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.CREATEEMBED[5])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (!args[1]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.CREATEEMBED[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (!args[2]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.CREATEEMBED[2])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (!args[3]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.CREATEEMBED[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            let canal, descripcion, color, titulo

            canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            descripcion = args[3]
            titulo = args[2]
            if (!canal) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.CREATEEMBED[4])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            let colors = [
                'DEFAULT',
                'AQUA',
                'DARK_AQUA',
                'GREEN',
                'DARK_GREEN',
                'BLUE',
                'DARK_BLUE',
                'PURPLE',
                'DARK_PURPLE',
                'LUMINOUS_VIVID_PINK',
                'DARK_VIVID_PINK',
                'GOLD',
                'DARK_GOLD',
                'ORANGE',
                'DARK_ORANGE',
                'RED',
                'DARK_RED',
                'GREY',
                'DARK_GREY',
                'DARKER_GREY',
                'LIGHT_GREY',
                'NAVY',
                'DARK_NAVY',
                'YELLOW'
            ]
            for (let index in colors) {
                if (args[1].toUpperCase() == colors[index]) {
                    color = colors[index]
                }
            }
            if (!color) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.CREATEEMBED[6])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    .setImage('https://i.postimg.cc/gj8NSLsy/embed-colors.png')
                return message.channel.send({ embeds: [errorembed] })
            }
            var embed = new MessageEmbed().setDescription(`${descripcion}`).setColor(`${color}`)

            if (
                (titulo || titulo !== 'null') &&
                titulo != 'none' &&
                titulo != 'ninguno' &&
                titulo != 'no' &&
                titulo != "''" &&
                titulo != '""'
            ) {
                embed.setTitle(titulo)
            }
            if (!canal.permissionsFor(message.client.user.id).has(['SEND_MESSAGES', 'EMBED_LINKS', 'VIEW_CHANNEL'])) {
                message.channel.send({
                    content:
                        'No tengo los permisos `SEND_MESSAGES`, `EMBED_LINKS` ni `VIEW_CHANNEL`, que son necesarios para enviar el embed.'
                })
                return
            }
            canal.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
