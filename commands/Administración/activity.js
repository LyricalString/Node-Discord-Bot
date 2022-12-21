const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Activity extends Command {
    constructor(client) {
        super(client, {
            name: 'activity',
            description: ["Sets the bot's activity.", 'Establece la actividad del bot.'],
            subcommands: ['listening', 'watching', 'playing'],
            usage: ['<listening/watching/playing> <status>', '<listening/watching/playing> <estado>'],
            role: 'dev',
            args: true,
            category: 'administracion'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            client.user
                .setActivity(args.slice(1).join(' '), {
                    type: args[0].toUpperCase()
                })
                .then((data) => {
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setTitle(client.language.SUCCESSEMBED)
                        .setDescription(client.language.ACTIVITY[1])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [embed] })
                })
                .catch((err) => {
                    return console.error(err)
                })
        } catch (e) {
            sendError(e, message)
        }
    }
}
