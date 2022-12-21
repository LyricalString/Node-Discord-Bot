const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const isUrl = require('../../utils/isUrl.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class Radio extends Command {
    constructor() {
        super({
            name: 'radio',
            description: [
                'Listen to any radio station in the world.',
                'Escucha cualquier estacion de radio del mundo.'
            ],
            category: 'musica',
            botpermissions: ['CONNECT', 'SPEAK'],
            usage: ['<station>', '<estacion>'],
            args: true
        })
    }
    async run(message, args) {
        try {
            // const errorembed = new MessageEmbed()
            //     .setColor("RED")
            //     .setTitle(message.client.language.ERROREMBED)
            //     .setDescription('La API se encuentra en mantenimiento. Volverán cuando vuelva la API.')
            //     .setFooter({text: message.author.username, message.author.avatarURL()});
            //   return message.channel.send({ embeds: [errorembed] });
            const { channel } = message.member.voice
            if (!channel) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.RADIO[1])
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
                let member = await message.guild.members.fetch(message.client.user.id).catch((e) => {
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
            const query = args.join(' ')
            if (!args[0]) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.RADIO[3])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
            let volume = 100

            // let filter = {
            //     limit: 1,
            //     by: 'name',
            //     searchterm: query
            // }
            let str = ''
            let name = ''
            let favicon = ''
            let homepage = ''
            let codec = ''
            let bitrate = ''

            const { RadioBrowserApi, StationSearchType } = require('radio-browser-api')
            const api = new RadioBrowserApi('NodeBot')

            // let argumentos = []
            await api
                .getStationsBy(StationSearchType.byName, args.join(' '), 1)
                .then((radio) => {
                    if (!radio[0]) return
                    str = radio[0].urlResolved
                    name = radio[0].name
                    favicon = radio[0].favicon
                    homepage = radio[0].homepage
                    codec = radio[0].codec
                    bitrate = radio[0].bitrate
                })
                .catch((e) => {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.RADIO[11])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                })
            await message.client.manager.search(str, message.author).then(async (res) => {
                switch (res.loadType) {
                    case 'TRACK_LOADED':
                        player.queue.add(res.tracks[0])
                        const embed = new MessageEmbed()
                            .setTitle(message.client.language.RADIO[12])
                            .setColor(process.env.EMBED_COLOR)
                            .addFields({ name: message.client.language.RADIO[6], value: `${name}` })
                            .addFields({ name: message.client.language.RADIO[9], value: `${codec}`, inline: true })
                            .addFields({ name: message.client.language.RADIO[10], value: `${bitrate}`, inline: true })
                        if (favicon && isUrl(favicon)) embed.setThumbnail(favicon)
                        message.channel.send({ embeds: [embed] })
                        if (homepage)
                            embed.addFields({
                                name: message.client.language.RADIO[7],
                                value: `${message.client.language.RADIO[8]}(${homepage})`,
                                inline: true
                            })
                        if (!player.playing) {
                            player.play()
                            player.setVolume(volume || 50)
                            player.setTrackRepeat(false)
                            player.setQueueRepeat(false)
                        }
                        break

                    case 'LOAD_FAILED':
                        message.channel.send(message.client.language.RADIO[11])
                        break
                }
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
