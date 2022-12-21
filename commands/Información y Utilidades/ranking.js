const { MessageEmbed } = require('discord.js')

const CommandsModel = require('../../models/command.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class VotesLeader extends Command {
    constructor() {
        super({
            name: 'ranking',
            description: ['Shows the top commands by uses of Node', 'Muestra los comandos destacados por usos de Node'],
            subcommands: ['commands', 'cmd'],
            usage: ['<commands/cmd>', '<commands/cmd>'],
            category: 'Info',
            alias: ['rk'],
            production: true
        })
    }
    async run(message, args, prefix, lang) {
        try {
            if (args[0].toLowerCase() == 'commands' || args[0].toLowerCase() == 'cmd') {
                CommandsModel.find()
                    .sort({ uses: -1 })
                    .limit(10)
                    .then(async (s, err) => {
                        let msg = await message.channel.send(
                            `${message.client.language.RANKING[1]} <a:pepeRiendose:835905480160444466>`
                        )
                        const embed = new MessageEmbed()
                            .setTitle(message.client.language.RANKING[2])
                            .setColor(process.env.EMBED_COLOR)
                        for (let index in s) {
                            embed.addField(
                                '\u200b',
                                `<:lightbluedot:864163603844956170> ${s[index].name} [${s[index].uses}]`
                            )
                        }
                        CommandsModel.aggregate([
                            {
                                $group: {
                                    _id: null,
                                    count: { $sum: '$uses' } // for no. of documents count
                                }
                            }
                        ]).then(async (s, err) => {
                            console.debug(s[0].count)
                            embed.setFooter({ text: 'Comandos ejecutados en total: ' + s[0].count })
                            msg.edit({ content: ' ', embeds: [embed] })
                        })
                    })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
