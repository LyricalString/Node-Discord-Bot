const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const { sendError } = require('../../utils/utils.js')

module.exports = class VoiceMove extends Command {
    constructor() {
        super({
            name: 'voicemove',
            description: ['Moves a user to another voice channel.', 'Mueve a un usuario a otro canal de voz.'],
            usage: ['<@user> <#channel>', '<@usuario> <#canal>'],
            alias: ['vcmove'],
            permissions: ['MOVE_MEMBERS'],
            botpermissions: ['MOVE_MEMBERS'],
            args: true,
            moderation: true,
            category: 'Moderacion',
            nochannel: true
        })
    }
    async run(message, args, prefix) {
        try {
            if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
                message.reply({
                    content: `${message.client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``
                })
            } else {
                if (!message.deleted) message.delete().catch((e) => console.log(e))
            }
            let member = message.mentions.members.first() || (await message.guild.members.cache.get(args[0]))

            if (!member) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.VOICEMOVE[1])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            let guild = message.guild
            let channel = message.mentions.channels.first() || guild.channels.cache.get(args[1]) // || guild.channels.cache.find(c => c.name.toLowerCase() == args[1].toLowerCase() && c.type == "voice");
            if (!channel) {
                channel = guild.channels.cache.get(message.member.voice.channelId)
                if (!channel) return
            } else if (channel.type != 'GUILD_VOICE') {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(message.client.language.VOICEMOVE[2])
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }

            try {
                if (!member.voice || !member.voice.channelId) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription('El usuario no está conectado en ningún canal de voz.')
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                if (member.voice.channelId == channel.id) {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.VOICEMOVE[3])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
                member.voice.setChannel(channel)
                let embed = new MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTimestamp()
                    .setDescription(message.client.language.VOICEMOVE[4])
                message.channel.send({ embeds: [embed] })
            } catch (error) {
                console.error(error)
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
