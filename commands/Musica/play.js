const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const util = require('../../utils/utils')
const { getPreview } = require('spotify-url-info')(fetch)

const { sendError } = require('../../utils/utils.js')

module.exports = class Play extends Command {
    constructor() {
        super({
            name: 'play',
            description: ['Play any song on your voice channel.', 'Reproduce cualquier canción en tu canal de voz.'],
            usage: ['<song>', '<canción>'],
            botpermissions: ['CONNECT', 'SPEAK'],
            alias: ['pl', 'p'],
            args: true,
            category: 'musica'
        })
    }
    async run(message, args) {
        try {
            let sc
            if (message.attachments.size == 0) {
                sc = args.join(' ')
            } else {
                return Array.from(message.attachments, ([key, value]) => {
                    sc = value.proxyURL
                })
            }
            const { channel } = message.member.voice
            if (!channel) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.PLAY[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
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
            if (!playerCanal) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.PLAY[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (playerCanal.id != channel.id && playerCanal.members.size == 1) {
                let member = await message.guild.members.fetch(process.env.botID).catch((e) => {
                    return
                })
                member.voice.setChannel(channel.id)
            } else if (playerCanal.id != channel.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.PLAY[2])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            if (sc.startsWith('https://open.spotify.com/')) {
                let res
                try {
                    res = await message.client.manager.search(sc || sc.url, message.author)
                    switch (res.loadType) {
                        case 'TRACK_LOADED':
                            {
                                player.queue.add(res.tracks[0])
                                const embed = await new MessageEmbed()
                                    .setColor(process.env.EMBED_COLOR)
                                    .setDescription(
                                        `**${message.client.language.PLAY[3]}\n[${res.tracks[0].title}](${res.tracks[0].uri})**`
                                    )
                                    .setThumbnail(
                                        `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`
                                    )
                                    .addFields({
                                        name: message.client.language.PLAY[4],
                                        value: res.tracks[0].author,
                                        inline: true
                                    })
                                    .addFields({
                                        name: message.client.language.PLAY[5],
                                        value: res.tracks[0].requester.tag,
                                        inline: true
                                    })
                                    .addFields({
                                        name: message.client.language.PLAY[6],
                                        value: util.formatTime(res.tracks[0].duration),
                                        inline: true
                                    })
                                message.channel.send({ embeds: [embed] })
                                if (!player.playing && !player.paused && !player.queue.size) player.play()
                            }
                            break
                        case 'PLAYLIST_LOADED': {
                            const playlistInfo = await getPreview(sc)
                            const duration = util.formatTime(
                                res.tracks.reduce((acc, cur) => ({
                                    duration: acc.duration + cur.duration
                                })).duration
                            )
                            const embed = new MessageEmbed()
                                .setAuthor(message.author.username, message.author.avatarURL())
                                .setColor(process.env.EMBED_COLOR)
                                .addFields({
                                    name: message.client.language.PLAY[7],
                                    value: `${res.playlist.name}`,
                                    inline: true
                                })
                                .addFields({
                                    name: message.client.language.PLAY[8],
                                    value: `\`${res.tracks.length}\``,
                                    inline: true
                                })
                                .addFields({
                                    name: message.client.language.PLAY[5],
                                    value: `${res.tracks[0].requester}`,
                                    inline: true
                                })
                                .addFields({
                                    name: message.client.language.PLAY[6],
                                    value: `${duration}`,
                                    inline: true
                                })
                                .setThumbnail(`${playlistInfo.image}`)
                            message.channel.send({ embeds: [embed] })
                            player.queue.add(res.tracks)
                            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)
                                player.play()
                        }
                    }
                } catch (e) {
                    return webhookmessage.client.send(
                        `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\n\nError: ${e}\n\n**------------------------------------**`
                    )
                }
            } else {
                let res
                try {
                    res = await message.client.manager.search(sc, message.author)
                    if (res.loadType === 'LOAD_FAILED') {
                        if (!player.queue.current) player.destroy()
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(message.client.language.PLAY[9])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [errorembed] })
                    }
                } catch (e) {
                    return webhookmessage.client.send(
                        `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\n\nError: ${e}\n\n**------------------------------------**`
                    )
                }
                switch (res.loadType) {
                    case 'NO_MATCHES':
                        if (!player.queue.current) player.destroy()
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription(message.client.language.PLAY[10])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [errorembed] })
                    case 'SEARCH_RESULT': {
                        const embed = await new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setDescription(
                                `**${message.client.language.PLAY[3]}\n[${res.tracks[0].title}](${res.tracks[0].uri})**`
                            )

                            .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`)
                            .addFields({
                                name: message.client.language.PLAY[4],
                                value: res.tracks[0].author,
                                inline: true
                            })
                            .addFields({
                                name: message.client.language.PLAY[5],
                                value: res.tracks[0].requester.tag,
                                inline: true
                            })
                            .addFields({
                                name: message.client.language.PLAY[6],
                                value: util.formatTime(res.tracks[0].duration),
                                inline: true
                            })
                        message.channel.send({ embeds: [embed] })
                        player.queue.add(res.tracks[0])
                        if (!player.playing && !player.queue.size && !player.paused) player.play()
                        break
                    }
                    case 'PLAYLIST_LOADED': {
                        player.queue.add(res.tracks)
                        const duration = util.formatTime(
                            res.tracks.reduce((acc, cur) => ({
                                duration: acc.duration + cur.duration
                            })).duration
                        )
                        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length)
                            player.play()
                        const e = new MessageEmbed()
                            .setTitle(message.client.language.PLAY[11])
                            .setColor(process.env.EMBED_COLOR)
                            .addFields({
                                name: message.client.language.PLAY[12],
                                value: `${res.playlist.name}`,
                                inline: true
                            })
                            .addFields({
                                name: message.client.language.PLAY[13],
                                value: `\`${res.tracks.length}\``,
                                inline: true
                            })
                            .addFields({
                                name: message.client.language.PLAY[5],
                                value: `${res.tracks[0].requester}`,
                                inline: true
                            })
                            .addFields({ name: message.client.language.PLAY[6], value: `${duration}`, inline: true })
                            .setImage(`https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`)
                        return message.channel.send({ embeds: [e] })
                    }
                    case 'TRACK_LOADED': {
                        player.queue.add(res.tracks[0])
                        const embed = await new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setDescription(
                                `**${message.client.language.PLAY[3]}\n[${res.tracks[0].title}](${res.tracks[0].uri})**`
                            )
                            .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`)
                            .addFields({
                                name: message.client.language.PLAY[4],
                                value: res.tracks[0].author,
                                inline: true
                            })
                            .addFields({
                                name: message.client.language.PLAY[5],
                                value: res.tracks[0].requester.tag,
                                inline: true
                            })
                            .addFields({
                                name: message.client.language.PLAY[6],
                                value: util.formatTime(res.tracks[0].duration),
                                inline: true
                            })
                        message.channel.send({ embeds: [embed] })
                        if (!player.playing && !player.paused && !player.queue.size) player.play()
                    }
                }
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
