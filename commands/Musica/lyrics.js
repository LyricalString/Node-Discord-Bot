const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const axios = require('axios')

const { sendError } = require('../../utils/utils.js')

module.exports = class Lyrics extends Command {
    constructor() {
        super({
            name: 'lyrics',
            description: ['Sends the lyrics of the current song.', 'Envía la letra de la canción actual.'],
            alias: ['l', 'ly', 'letra'],
            category: 'musica',
            args: true
        })
    }
    async run(message, args, prefix, lang) {
        try {
            let titulo = args.join('%20')
            axios.get(`https://some-random-api.ml/lyrics?title=${titulo}`).then((res) => {
                const embed = new MessageEmbed()
                    .setTitle(res.data.title)
                    .setURL(res.data.links.genius)
                    .setColor(process.env.EMBED_COLOR)
                    .setDescription(res.data.lyrics)
                    .setFooter({ text: res.data.author })
                    .setThumbnail(res.data.thumbnail.genius)
                return message.channel.send({ embeds: [embed] })
            })
        } catch (e) {
            sendError(e, message)
        }
    }
}
