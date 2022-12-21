const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const moment = require('moment')
const { sendError } = require('../../utils/utils.js')
require('moment-duration-format')

module.exports = class Shards extends Command {
    constructor() {
        super({
            name: 'shards',
            description: ['Displays the current shard info.', 'Muestra información de las shards.'],
            category: 'Administracion',
            alias: ['shard'],
            inactive: true
        })
    }
    async run(message, args, prefix) {
        try {
            delete require.cache[require.resolve(`../../estadisticas.json`)]
            let data = require('../../estadisticas.json')
            const embed = new MessageEmbed().setColor('GREEN').setAuthor('Información de Node')

            for (let index2 in data.clusters) {
                let cluster = data.clusters[index2]
                let shards = cluster.shards
                let guilds = cluster.guilds
                let ram = cluster.ram
                let exclusiveGuilds = cluster.exclusiveGuilds
                let ping = 0
                let index = 0
                for (index in cluster.shardsStats) {
                    ping += parseInt(cluster.shardsStats[index].ping)
                }
                let averagePing = Math.trunc(ping / cluster.shardsStats.length)
                embed.addField(
                    `${message.client.language.SHARDS[1]} ${index}`,
                    `\`\`\`js\n${message.client.language.SHARDS[2]}: ${shards}\n${
                        message.client.language.SHARDS[3]
                    }: ${guilds}\n${message.client.language.SHARDS[4]}: ${Math.trunc(parseInt(ram))} MB\n${
                        message.client.language.SHARDS[5]
                    }: ${moment.duration(message.client.uptime).format(`DD:HH:mm:ss`)}\n${
                        message.client.language.SHARDS[6]
                    }: ${exclusiveGuilds}\n${message.client.language.SHARDS[7]}: ${averagePing} ms\`\`\``,
                    true
                )
            }
            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
