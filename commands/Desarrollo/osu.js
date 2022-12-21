const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const osu = require('node-osu')
const { sendError } = require('../../utils/utils.js')

module.exports = class Osu extends Command {
    constructor() {
        super({
            name: 'osu',
            description: [
                'Shows the people name who helped on the development of Node.',
                'Muestra el nombre de las personas que ayudaron en el desarrollo de Node.'
            ],
            production: true,
            category: 'Info',
            subcommands: ['user, beatmap'],
            args: true
        })
    }
    async run(message, args, prefix) {
        try {
            const osuApi = new osu.Api(process.env.OsuSecret, {
                notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
                completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
                parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
            })
            if (args[0].toLowerCase() == 'user') {
                osuApi
                    .apiCall('/get_user', {
                        u: args[1]
                    })
                    .then((user) => {
                        const usuario = user[0]
                        const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setTitle(usuario.username)
                        if (usuario.user_id != null)
                            embed.addFields({ name: 'ID del Usuario', value: usuario.user_id, inline: true })
                        if (usuario.join_date != null)
                            embed.addFields({ name: 'Fecha de unión', value: usuario.join_date, inline: true })
                        if (usuario.count300 != null)
                            embed.addFields({ name: 'Combos 300', value: usuario.count300, inline: true })
                        if (usuario.count100 != null)
                            embed.addFields({ name: 'Combos 100', value: usuario.count100, inline: true })
                        if (usuario.count50 != null)
                            embed.addFields({ name: 'Combos 50', value: usuario.count50, inline: true })
                        if (usuario.playcount != null)
                            embed.addFields({ name: 'Partidas', value: usuario.playcount, inline: true })
                        if (usuario.ranked_score != null)
                            embed.addFields({
                                name: 'Puntuación Competitivo',
                                value: usuario.ranked_score,
                                inline: true
                            })
                        if (usuario.total_score != null)
                            embed.addFields({ name: 'Puntuación Total', value: usuario.total_score, inline: true })
                        if (usuario.pp_rank != null)
                            embed.addFields({ name: 'Puntos Rendimiento', value: usuario.pp_rank, inline: true })
                        if (usuario.pp_country_rank != null)
                            embed.addFields({
                                name: 'Rankin Puntos Rendimiento por País',
                                value: usuario.pp_country_rank,
                                inline: true
                            })
                        if (usuario.accuracy != null)
                            embed.addFields({ name: 'Precisión', value: usuario.accuracy, inline: true })
                        if (usuario.level != null)
                            embed.addFields({ name: 'Nivel', value: '' + Math.round(usuario.level), inline: true })
                        if (usuario.country != null)
                            embed.addFields({ name: 'País', value: usuario.country, inline: true })
                        if (usuario.total_seconds_played != null)
                            embed.addFields({
                                name: 'Horas Jugadas',
                                value: '' + Math.round(parseInt(usuario.total_seconds_played) / 3600),
                                inline: true
                            })
                        message.channel.send({ embeds: [embed] })
                    })
                    .catch((e) => {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription('Ese usuario no está registrado en Osu!')
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [errorembed] })
                    })
            } else if (args[0].toLowerCase() == 'beatmap') {
                if (!args[1].startsWith('http') && !args[1].includes('/') && !isNaN(args[1])) {
                    osuApi
                        .getBeatmaps({ b: args[1] })
                        .then((beatmaps) => {
                            console.debug(beatmaps)
                        })
                        .catch((e) => {
                            console.error(e)
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(message.client.language.ERROREMBED)
                                .setDescription('Ese usuario no está registrado en Osu!')
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({
                                embeds: [errorembed]
                            })
                        })
                } else if (args[1].startsWith('http') || args[1].includes('/')) {
                    let argumentos = args[1].split('/')
                    osuApi
                        .getBeatmaps({ b: argumentos[5] })
                        .then((beatmaps) => {
                            console.debug(beatmaps)
                        })
                        .catch((e) => {
                            console.error(e)
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(message.client.language.ERROREMBED)
                                .setDescription('Ese usuario no está registrado en Osu!')
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({
                                embeds: [errorembed]
                            })
                        })
                } else {
                    message.channel.send('No has insertado un ID ni un URL.')
                }
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
