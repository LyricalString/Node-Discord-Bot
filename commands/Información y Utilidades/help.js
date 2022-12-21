const Command = require('../../structures/Commandos.js')
const { MessageEmbed } = require('discord.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Help extends Command {
    constructor() {
        super({
            name: 'help',
            botpermissions: ['ADD_REACTIONS'],
            description: ['Show you information about me.', 'Muestra información sobre mí.'],
            cooldown: 5,
            usage: ['<command>', '<comando>'],
            category: 'Info'
        })
    }
    async run(message, args, prefix) {
        try {
            if (!args[0]) {
                const embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setDescription(
                        `<a:828830816486293608:836296002893381682> ${message.client.language.HELP[5]} \`Node\`, ${message.client.language.HELP[6]}`
                    )
                    .addField(
                        message.client.language.HELP[7],
                        `${message.client.language.HELP[8]} \`${message.guild.prefix}commands\`.`
                    )
                    .addFields({ name: message.client.language.HELP[9], value: message.client.language.HELP[10] })
                    .addField(
                        message.client.language.HELP[11],
                        message.client.language.HELP[12] +
                            `<a:arrowright:835907836352397372> \`${prefix}vote\` <a:flechaizquierda:836295936673579048> ${message.client.language.HELP[14]}(https://vote.nodebot.xyz 'Estamos esperando tu voto :)')`
                    )
                    .setThumbnail(message.author.avatarURL({ dynamic: true }))
                    .setTitle('✨' + message.client.language.HELP[13])
                //let user = message.client.users.cache.get(message.author.id)

                //message.lineReply(message.client.language.HELP[4]);
                message.channel.send({
                    embeds: [embed]
                    //buttons: ButtonArray,
                })
            } else {
                const data = []
                const name = args[0].toLowerCase()
                const command =
                    message.client.commands.get(name) ||
                    message.client.commands.find((c) => c.aliases && c.aliases.includes(name))

                if (!command) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(name + message.client.language.HELP[25])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }

                data.push(`**${message.client.language.HELP[15]}:** ${command.name}`)

                if (command.aliases) data.push(`**${message.client.language.HELP[16]}:** ${command.aliases.join(', ')}`)
                if (command.description) data.push(`**${message.client.language.HELP[17]}:** ${command.description}`)
                if (command.usage)
                    data.push(`**${message.client.language.HELP[18]}:** .${command.name} ${command.usage}`)

                data.push(
                    `**${message.client.language.HELP[19]}:** ${command.cooldown || 3} ${
                        message.client.language.HELP[30]
                    }(s)`
                )
                let embed2 = new MessageEmbed()
                    .setTitle(message.client.language.HELP[20] + command.name + message.client.language.HELP[24])
                    .setColor(process.env.EMBED_COLOR)
                    .addFields(
                        {
                            name: `**${message.client.language.HELP[17]}**`,
                            value: command.description
                                ? command.description.toString()
                                : message.client.language.HELP[29],
                            inline: true
                        },
                        {
                            name: `**${message.client.language.HELP[18]}**`,
                            value: command.usage ? command.usage.toString() : message.client.language.HELP[29],
                            inline: true
                        },
                        {
                            name: `**${message.client.language.HELP[16]}**`,
                            value: command.aliases ? command.aliases.toString() : message.client.language.HELP[29],
                            inline: true
                        }
                    )
                    .setFooter(
                        `\n${message.client.language.HELP[26]} \`${prefix}help [${message.client.language.HELP[27]}]\` ${message.client.language.HELP[28]}`
                    )
                    .setTimestamp()

                message.channel.send({ embeds: [embed2] })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
