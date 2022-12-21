const Command = require('../../structures/Commandos.js')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const os = require('node:os')
const getCPUUsage = require('../../utils/cpuUsage.js')
const { sendError } = require('../../utils/utils.js')
require('moment-duration-format')

module.exports = class Status extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            description: [`Shows the actual status of Node.`, `Muestra las estadísticas en tiempo real de node.`],
            cooldown: 1,
            alias: ['stats'],
            category: 'Info'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            const guildNum = await client.shard.fetchClientValues('guilds.cache.size')
            const memberNum = await client.shard.broadcastEval((client) =>
                client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)
            )
            const totalMembers = memberNum.reduce((prev, memberCount) => prev + memberCount, 0)
            const totalGuilds = guildNum.reduce((total, shard) => total + shard, 0)
            const freeRAM = Number((os.freemem() / 1_048_576).toFixed(2))
            const totalRAM = Number((os.totalmem() / 1_048_576).toFixed(2))
            const usedRAM = totalRAM - freeRAM
            const full = '▰'
            const empty = '▱'
            const diagramMaker = (total, used, free) => {
                used = Math.round((used / total) * 10)
                free = Math.round((free / total) * 10)
                return full.repeat(used) + empty.repeat(free)
            }
            const cpuUsage = await getCPUUsage()

            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setAuthor(`${client.language.STATUS[1]} ${client.user.username}`)
                .setThumbnail(
                    client.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                        size: 4096
                    })
                )
                .addField(
                    '<:stats:863983092695302144> ' + client.language.STATUS[3],
                    '```' +
                        `RAM: ${diagramMaker(totalRAM, usedRAM, freeRAM)} [${Math.round(
                            (100 * usedRAM) / totalRAM
                        )}%]\nCPU: ${diagramMaker(cpuUsage, 100 - cpuUsage)} [${Math.round(cpuUsage)}%]` +
                        '```',
                    false
                )
                .addField(
                    '<:hdd:864126690342207499> ' + client.language.STATUS[4],
                    '```' +
                        `${client.language.STATUS[5]}\n${client.language.STATUS[6]} ${(
                            os.totalmem() /
                            1024 /
                            1024 /
                            1024
                        ).toFixed(2)} GB` +
                        '```',
                    false
                )
                .addField(
                    '<:cmd:864107735255220235> ' + client.language.STATUS[7],
                    '```' + `${os.type} ${os.release} ${os.arch}` + '```',
                    false
                )
                .addField(
                    '<:membersblurple:863983092658208790> ' + client.language.STATUS[8],
                    '```' + `${totalMembers}` + '```'
                )
                .addField(
                    '<:sticker:864103714971975691> ' + client.language.STATUS[9],
                    '```' + `${client.emojis.cache.size}` + '```',
                    true
                )
                .addField(
                    '<:members:864107765050638367> ' + client.language.STATUS[10],
                    '```' + `${totalGuilds}` + '```',
                    true
                )
                .addField(
                    '<:greendot:864163523331751956> ' + client.language.STATUS[11],
                    '```' +
                        `${moment
                            .duration(client.uptime)
                            .format(
                                `D [${client.language.STATUS[12]}], H [${client.language.STATUS[13]}], m [${client.language.STATUS[14]}], s [${client.language.STATUS[15]}]`
                            )}` +
                        '```',
                    true
                )
                .addField(
                    '<:greendot:864163523331751956> ' + client.language.STATUS[16],
                    '```' +
                        `${moment
                            .duration(os.uptime * 1000)
                            .format(
                                `D [${client.language.STATUS[12]}], H [${client.language.STATUS[13]}], m [${client.language.STATUS[14]}], s [${client.language.STATUS[15]}]`
                            )}` +
                        '```',
                    true
                )
                .addField(
                    '<a:engranajes:836295967569477682> ' + client.language.STATUS[17],
                    '```' + `${moment(client.readyAt).format('MMMM DD, YYYY HH:mm')}` + '```',
                    true
                )
                .setColor('#2f3136')

            message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
