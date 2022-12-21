const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const userModel = require('../../models/user.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class OldMode extends Command {
    constructor() {
        super({
            name: 'oldmode',
            description: [
                'Allows to enable and disable the old features if you are not able to view the new features.',
                'Permite habilitar y deshabilitar las funciones antiguas por si no eres capaz de ver las funciones nuevas.'
            ],
            usage: ['<enable/disable>', '<enable/disable>'],
            category: 'Info',
            subcommands: ['enable', 'disable'],
            alias: ['og'],
            cooldown: 1,
            args: true,
            production: true
        })
    }
    async run(message, args, prefix, lang) {
        try {
            userModel
                .findOne({
                    USERID: message.author.id.toString()
                })
                .then((s, err) => {
                    if (err) return
                    if (args[0].toLowerCase() == 'enable') {
                        message.member.user.OLDMODE = true
                        s.OLDMODE = true
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.OLDMODE[1])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else if (args[0].toLowerCase() == 'disable') {
                        message.member.user.OLDMODE = false
                        s.OLDMODE = false
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.OLDMODE[2])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    }
                    s.save().catch((e) => console.error(e))
                })
        } catch (e) {
            sendError(e, message)
        }
    }
}
