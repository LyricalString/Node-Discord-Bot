const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')

const { sendError } = require('../../utils/utils.js')

module.exports = class Search extends Command {
    constructor() {
        super({
            name: 'search',
            description: [
                'Searches on youtube for the top 5 results from your song.',
                'Busca en youtube los 5 resultados más destacados de tu canción.'
            ],
            usage: ["<song's name>", '<nombre de la canción>'],
            category: 'musica',
            botpermissions: ['CONNECT', 'SPEAK'],
            args: true,
            role: 'tester',
            production: true
        })
    }
    async run(message, args, prefix) {
        try {
            const sc = message.attachments.first() || args.join(' ')
            const { channel } = message.member.voice
            if (!channel) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription('Necesitas estar en un canal de voz para ejecutar este comando.')
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
            if (playerCanal.id != channel.id) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error!')
                    .setDescription('Necesitas estar en el mismo canal de voz que el bot para ejecutar este comando.')
                return message.channel.send({ embeds: [errorembed] })
            }
            const res = await message.client.manager.search(sc, message.author)
            let n = 0
            const tracks = res.tracks.slice(0, 5)
            const results = res.tracks
                .slice(0, 5)
                .map((result) => `**${++n} -** [${result.title}](${result.uri})`)
                .join('\n')
            const myCoolMenu = new SelectMenuBuilder()
                .setCustomId('cool-custom-id')
                .setPlaceholder('Select an option')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    { label: 'res1', description: 'Prueba', value: 'cancion-1' },
                    { label: 'res1', description: 'Prueba', value: 'cancion-2' },
                    { label: res.tracks[0].title, description: 'Prueba', value: 'cancion-3' }
                )
            message
                .reply({
                    embeds: [new MessageEmbed().setDescription('Hello world!')],
                    components: [new ActionRowBuilder().addComponents(myCoolMenu)]
                })
                .catch((err) => console.error(err))
        } catch (e) {
            console.error(e)
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.fatal_error)
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                ]
            })
            webhookmessage.client.send(
                `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
            )
            message.author
                .send(
                    'Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>'
                )
                .catch((e) => null)
        }
    }
}
