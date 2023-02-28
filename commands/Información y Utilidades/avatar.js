const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Avatar extends Command {
    constructor() {
        super({
            name: 'avatar',
            description: ['Send your avatar!', '¡Envía tu avatar!'],
            aliases: ['icon', 'pfp', 'av', 'image'],
            cooldown: 5,
            category: 'Info'
        })
    }
    async run(message, args) {
        let embed = new MessageEmbed()
        let member
        if (args[0]) {
            member =
                message.mentions.members.first() ||
                (await message.guild.members.fetch(args[0].replace('<@', '').replace('>', '')).catch((e) => {
                    return
                }))
        }
        if (args[0] && !member) {
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setTitle(message.client.language.ERROREMBED)
                .setDescription(message.client.language.AVATAR[1])
                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
            return message.channel.send({ embeds: [errorembed] })
        }
        if (!member) {
            embed.setColor('00ff00')
            embed.setImage(
                message.author.displayAvatarURL({
                    dynamic: true,
                    size: 4096
                })
            )
            message.channel.send({ embeds: [embed] })
        } else {
            let user =
                message.mentions.users.first() ||
                (await message.guild.members.fetch(args[0].replace('<@', '').replace('>', '')).catch((e) => {
                    return
                }))
            if (lang == 'es_ES') {
                embed.setFooter({ text: `${message.client.language.AVATAR[2]} ${member.user.tag}!` })
                embed.setImage(
                    member.user.displayAvatarURL({
                        dynamic: true,
                        size: 4096
                    })
                )
                embed.setColor('#00ff00')
                message.channel.send({ embeds: [embed] })
            } else {
                embed.setFooter({ text: `${member.user.tag}${message.client.language.AVATAR[3]}` })
                embed.setImage(
                    member.user.displayAvatarURL({
                        dynamic: true,
                        size: 4096
                    })
                )
                embed.setColor('#00ff00')
                message.channel.send({ embeds: [embed] })
            }
        }
        try {
        } catch (e) {
            sendError(e, message)
        }
    }
}
