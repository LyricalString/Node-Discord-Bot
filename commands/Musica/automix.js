const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class AutoMix extends Command {
    constructor() {
        super({
            name: 'automix',
            description: [
                'Plays 25 songs related to the song you add.',
                'Reproduce 25 canciones relacionadas con la cancion seleccionada.'
            ],
            usage: ['<song>', '<canción>'],
            alias: ['automix', 'amix', 'am'],
            botpermissions: ['CONNECT', 'SPEAK'],
            args: true,
            category: 'musica'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            const sc = message.attachments.first() || args.join(' ')
            if (!message.member) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.AUTOMIX[8])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            const { channel } = message.member.voice
            if (!channel) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.AUTOMIX[1])
                // let emblemas = message.member.user.ROLES
                // let badges = []
                // if (emblemas && emblemas.Premium.Enabled) badges.push('💎')
                // if (emblemas && emblemas.EarlyPremium.Enabled) badges.push('🌟')
                // if (emblemas && emblemas.Tester.Enabled) badges.push('🧪')
                // if (emblemas && emblemas.Notifications.Enabled) badges.push('🔔')
                // if (emblemas && emblemas.Developer.Enabled) badges.push('💻')
                // if (emblemas && emblemas.Booster.Enabled) badges.push('⛑')
                // errorembed.setFooter({text: message.author.username + ' ' + badges.join(''), message.author.avatarURL()});
                return message.channel.send({ embeds: [errorembed] })
            }

            if (message.guild.config.MUSIC_CHANNELS[0] && !message.guild.config.MUSIC_CHANNELS.includes(channel.id)) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.RADIO[13])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            const player = message.client.manager.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
                selfDeafen: true
            })
            if (player.state !== 'CONNECTED') {
                player.connect()
                player.setVolume(35)
            }

            const playerCanal = message.client.channels.cache.get(player.voiceChannel)
            if (!playerCanal) return
            if (
                playerCanal &&
                playerCanal.id &&
                channel.id &&
                playerCanal.id != channel.id &&
                playerCanal.members.size == 1
            ) {
                let member = await message.guild.members.fetch(process.env.botID).catch((e) => {
                    return
                })
                member.voice.setChannel(channel.id)
            } else if (playerCanal && playerCanal.id && channel.id && playerCanal.id != channel.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.PLAY[2])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            let msg = await message.channel.send(message.client.language.AUTOMIX[2])
            let res
            try {
                res = await message.client.manager.search(sc, message.author)
                if (res.loadType === 'LOAD_FAILED') {
                    if (!player.queue.current) player.destroy()
                }
            } catch (e) {
                message.author
                    .send(
                        'Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>'
                    )
                    .catch(e)
                return webhookmessage.client.send(
                    `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
                )
            }
            let result = await message.client.manager.search(
                `https://www.youtube.com/watch?v=${res.tracks[0].identifier}&list=RD${res.tracks[0].identifier}&start_radio=1`,
                message.author
            )
            switch (result.loadType) {
                case 'NO_MATCHES':
                    if (!player.queue.current) player.destroy()
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.AUTOMIX[3])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                case 'PLAYLIST_LOADED': {
                    player.queue.add(result.tracks)
                    if (!player.playing && !player.paused && player.queue.totalSize === result.tracks.length)
                        player.play()
                    const e = new MessageEmbed()
                        .setTitle(message.client.language.AUTOMIX[4])
                        .setColor(process.env.EMBED_COLOR)
                        .addFields({
                            name: message.client.language.AUTOMIX[5],
                            value: `${result.playlist.name}`,
                            inline: true
                        })
                        .addFields({
                            name: message.client.language.AUTOMIX[6],
                            value: `\`${result.tracks.length}\``,
                            inline: true
                        })
                        .addFields({
                            name: message.client.language.AUTOMIX[7],
                            value: `${result.tracks[0].requester}`,
                            inline: true
                        })
                        .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`)
                    return msg.edit({ content: ' ', embeds: [e] })
                }
                case 'LOAD_FAILED':
                    const errorembed2 = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.AUTOMIX[3])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return msg.edit({ content: ' ', embeds: [errorembed2] })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
