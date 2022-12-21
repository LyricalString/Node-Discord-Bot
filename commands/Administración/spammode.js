const { MessageEmbed } = require('discord.js')
const guildSchema = require('../../models/guild.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Spam extends Command {
    constructor(client) {
        super(client, {
            name: 'spammode',
            description: ['Enables or disables the spam commands.', 'Habilita o deshabilita los comandos de spam.'],
            permissions: ['ADMINISTRATOR'],
            subcommands: ['enable', 'disable'],
            cooldown: 1,
            nochannel: true,
            usage: ['<enable/disable>', '<enable/disable>'],
            category: 'administracion',
            args: true
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            if (args[0]) {
                if (args[0].toLowerCase() == 'enable') {
                    guildSchema
                        .findOne({
                            guildID: message.guild.id
                        })
                        .then((data) => {
                            data.config.spam = true
                            data.save().catch((err) => console.error(err))
                        })
                    message.guild.config.spam = true
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setTitle(client.language.SUCCESSEMBED)
                        .setDescription(client.language.SPAMMODE[1])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [embed] })
                } else if (args[0].toLowerCase() == 'disable') {
                    guildSchema
                        .findOne({
                            guildID: message.guild.id
                        })
                        .then((data) => {
                            data.config.spam = false
                            data.save().catch((err) => console.error(err))
                        })
                    message.guild.config.spam = false
                    const embed = new MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setTitle(client.language.SUCCESSEMBED)
                        .setDescription(client.language.SPAMMODE[2])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [embed] })
                }
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
