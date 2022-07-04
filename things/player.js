const { Manager } = require('erela.js')
const { MessageEmbed } = require('discord.js')

module.exports = async client => {
    try {
        function formatDuration(duration) {
            if (isNaN(duration) || typeof duration === 'undefined')
                return '00:00'
            if (duration > 3_600_000_000) return 'En Directo'
            return `<t:${Math.round(duration / 1_000) + 21_600}:T>`
        }

        client.manager = new Manager({
            nodes: [
                {
                    host: 'localhost',
                    port: 2333,
                    password: 'youshallnotpass'
                }
            ],
            autoPlay: true,
            plugins: [],
            send(id, payload) {
                const guild = client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            }
        })
            .on('nodeConnect', node => {
                console.log(`Node ${node.options.identifier} connected`)
            })
            // .on("nodeError", (node, error) =>
            //     console.log(
            //         `Node ${node.options.identifier} had an error: ${error.message}`
            //     )
            // )
            .on('trackStart', (player, track) => {
                if (!track) return
                const embed = new MessageEmbed()
                    .setDescription(
                        `Reproduciendo **[${track.title}](${
                            track.uri
                        })** [${formatDuration(track.duration)}] • <@${
                            track.requester.id
                        }>`
                    )
                    .setColor(process.env.EMBED_COLOR)
                    .setThumbnail(track.thumbnail)
                client.channels.cache
                    .get(player.textChannel)
                    .send({ embeds: [embed] })
            })
            .on('queueEnd', player => {
                const errorembed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setDescription(client.language.NOQUEUE)
                if (client.channels.cache.get(player.textChannel))
                    client.channels.cache
                        .get(player.textChannel)
                        .send({ embeds: [errorembed] })

                player.destroy()
            })
            .on('playerMove', (player, currentChannel, newChannel) => {
                player.voiceChannel = client.channels.cache.get(newChannel)
            })
    } catch (e) {
        console.error(e)
    }
}
