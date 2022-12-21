const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Say extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            description: ['Says the message you type!', '¡Dice el mensaje que escribiste!'],
            cooldown: 5,
            usage: ['<message>', '<mensaje>'],
            args: true,
            botpermissions: ['MANAGE_MESSAGES'],
            permissions: ['ADMINISTRATOR'],
            category: 'Info',
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
            if (args[0].toLowerCase() === 'colors') {
                const embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .setImage('https://i.postimg.cc/gj8NSLsy/embed-colors.png')
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [embed] })
            }
            let color = process.env.EMBED_COLOR
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
                if (color != process.env.EMBED_COLOR) break
                if (args[0].toUpperCase() == colors[index]) {
                    color = colors[index]
                }
            }
            if (color != process.env.EMBED_COLOR) {
                args.shift()
                return message.channel.send({
                    embeds: [new MessageEmbed().setColor(color).setDescription(args.join(' ')).setTimestamp()]
                })
            } else {
                return message.channel.send({
                    embeds: [new MessageEmbed().setColor(color).setDescription(args.join(' ')).setTimestamp()]
                })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
