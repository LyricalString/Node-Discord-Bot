const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const isUrl = require('../../utils/isUrl.js')
const axios = require('axios')
let bannedWords = require('../../predefinedBannedWords.json')
const { sendError } = require('../../utils/utils.js')

module.exports = class BannedWordsRefresh extends Command {
    constructor(client) {
        super(client, {
            name: 'unshorten',
            description: ['Analyzes a shortened link.', 'Analiza un link acortado.'],
            category: 'Administracion',
            args: true
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
            if (!isUrl(args[0])) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription('El argumento del comando no es un enlace.')
                    .setFooter({text: message.author.username, message.author.avatarURL()})
                return message.channel.send({ embeds: [errorembed] })
            }
            unshorten(client, message, args, prefix, lang)
        } catch (e) {
            sendError(e, message)
        }
    }
}

async function unshorten(client, message, args, prefix, lang) {
    axios({
        method: 'get',
        url: args[0],
        timeout: 5000
    })
        .then((res) => {
            if (!res) return null
            if (res.status == 301) {
                return unshorten(response.redirect_destination)
            } else if (res.status == 200) {
                for (let index in bannedWords) {
                    if (res.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle('Aviso <:notcheck:864102874983825428>')
                            .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                            .addFields({ name: 'Resultado', value: `El link adjunto tiene un enlace malicioso.` })
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] }).then((msg) => {
                            setTimeout(function () {
                                msg.delete().catch((e) => {})
                            }, 5000)
                        })
                    }
                }
                const embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                    .addFields({ name: 'Resultado', value: `\`\`\`${res.request.res.responseUrl}\`\`\`` })
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [embed] }).then((msg) => {
                    setTimeout(function () {
                        msg.delete().catch((e) => {})
                    }, 5000)
                })
            } else if (res.status == 404) {
                console.warn('Error unshorten.')
            } else if (res.status == 499) {
                for (let index in bannedWords) {
                    if (res.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle('Aviso <:notcheck:864102874983825428>')
                            .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                            .addFields({ name: 'Resultado', value: `El link adjunto tiene un enlace malicioso.` })
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] }).then((msg) => {
                            setTimeout(function () {
                                msg.delete().catch((e) => {})
                            }, 5000)
                        })
                    }
                }
                const embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                    .addFields({ name: 'Resultado', value: `\`\`\`${res.request.res.responseUrl}\`\`\`` })
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [embed] }).then((msg) => {
                    setTimeout(function () {
                        msg.delete().catch((e) => {})
                    }, 5000)
                })
            } else {
                console.log(res.status)
                return
            }
        })
        .catch((e) => {
            console.log(e)
            if (e.request && e.request.res && e.request.res.responseUrl) {
                for (let index in bannedWords) {
                    if (e.request.res.responseUrl.indexOf(bannedWords[index]) !== -1) {
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle('Aviso <:notcheck:864102874983825428>')
                            .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                            .addFields({ name: 'Resultado', value: `El link adjunto tiene un enlace malicioso.` })
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] }).then((msg) => {
                            setTimeout(function () {
                                msg.delete().catch((e) => {})
                            }, 5000)
                        })
                    }
                }
                const embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                    .addFields({ name: 'Resultado', value: `\`\`\`${e.request.res.responseUrl}\`\`\`` })
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [embed] })
            } else if (e.request && e.request._options && e.request._options.href) {
                for (let index in bannedWords) {
                    if (e.request._options.href.indexOf(bannedWords[index]) !== -1) {
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle('Aviso <:notcheck:864102874983825428>')
                            .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                            .addFields({ name: 'Resultado', value: `El link adjunto tiene un enlace malicioso.` })
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] }).then((msg) => {
                            setTimeout(function () {
                                msg.delete().catch((e) => {})
                            }, 5000)
                        })
                    }
                }
                const embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(client.language.SUCCESSEMBED)
                    .addFields({ name: 'Link Adjuntado', value: `\`\`\`${args[0]}\`\`\`` })
                    .addFields({ name: 'Resultado', value: `\`\`\`${e.request._options.href}\`\`\`` })
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [embed] }).then((msg) => {
                    setTimeout(function () {
                        msg.delete().catch((e) => {})
                    }, 5000)
                })
            }
        })
}
