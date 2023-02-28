const { MessageEmbed, WebhookClient } = require('discord.js')

let webhookClient
try {
    webhookClient = new WebhookClient({
        url: process.env.errorWebhookURL
    })
} catch {}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

function formatTime(ms) {
    const time = {
        d: 0,
        h: 0,
        m: 0,
        s: 0
    }
    time.s = Math.floor(ms / 1000)
    time.m = Math.floor(time.s / 60)
    time.s %= 60
    time.h = Math.floor(time.m / 60)
    time.m %= 60
    time.d = Math.floor(time.h / 24)
    time.h %= 24

    const res = []
    for (const [k, v] of Object.entries(time)) {
        let first = false
        if (v < 1 && !first) continue

        res.push(v < 10 ? `0${v}` : `${v}`)
        first = true
    }
    return res.join(':')
}

/**
 * Report error
 * @param {any} error
 * @param {import('discord.js').Message} [message]
 */
function sendError(error, message) {
    try {
        console.error(error)
        message?.channel
            .send?.({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.fatal_error)
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                ]
            })
            .catch(() =>
                message?.author.send?.(
                    'Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>'
                )
            )
        webhookClient?.send(
            `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
        )
    } catch (e) {}
}
module.exports = {
    formatBytes,
    formatTime,
    sendError
}
