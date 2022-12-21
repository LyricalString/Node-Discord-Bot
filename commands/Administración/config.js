const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

const guildSchema = require('../../models/guild.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Config extends Command {
    constructor() {
        super({
            name: 'config',
            description: [
                "Main command for changing server's configuration.",
                'Comando principal para cambiar la configuración del servidor.'
            ],
            role: 'dev',
            permissions: ['ADMINISTRATOR'],
            usage: ['<spammode/tosmode> <enable/disable>'],
            args: true,
            production: true,
            category: 'administracion'
        })
    }
    async run(message, args, prefix) {
        try {
            if (args[0].toLowerCase() == 'tosmode') {
                if (args[1]) {
                    if (args[1].toLowerCase() == 'enable') {
                        guildSchema
                            .findOne({
                                guildID: message.guild.id
                            })
                            .then((data) => {
                                data.config.tos = true
                                data.save().catch((err) => console.error(err))
                            })
                        message.guild.config.tos = true
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.TOSMODE[1])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else if (args[1].toLowerCase() == 'disable') {
                        guildSchema
                            .findOne({
                                guildID: message.guild.id
                            })
                            .then((data) => {
                                data.config.tos = false
                                data.save().catch((err) => console.error(err))
                            })
                        message.guild.config.tos = false
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.TOSMODE[2])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription('Las únicas opciones disponibles son enable/disable.')
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [errorembed] })
                    }
                } else {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(
                            `Debes de añadir una de las siguientes opciones al comando: \`enable/disable\`.`
                        )
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
            } else if (args[0].toLowerCase() == 'spammode') {
                if (args[1]) {
                    if (args[1].toLowerCase() == 'enable') {
                        guildSchema
                            .findOne({
                                guildID: message.guild.id
                            })
                            .then((data) => {
                                data.config.spam = true
                                data.save().catch((err) => console.error(err))
                            })
                        message.guild.config.spam = true
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.SPAMMODE[1])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else if (args[1].toLowerCase() == 'disable') {
                        guildSchema
                            .findOne({
                                guildID: message.guild.id
                            })
                            .then((data) => {
                                data.config.spam = false
                                data.save().catch((err) => console.error(err))
                            })
                        message.guild.config.spam = false
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(message.client.language.SPAMMODE[2])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription('Las únicas opciones disponibles son enable/disable.')
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [errorembed] })
                    }
                } else {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(
                            `Debes de añadir una de las siguientes opciones al comando: \`enable/disable\`.`
                        )
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
            } else if (args[0].toLowerCase() == 'mutedrole') {
                if (args[1]) {
                    if (args[1].toLowerCase() == 'add') {
                        let role
                        if (args[2]) {
                            role = (await message.guild.roles.fetch(args[2])) || message.mentions.roles.first()
                        }
                        if (!role) {
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(message.client.language.ERROREMBED)
                                .setDescription('No he podido encontrar el rol.')
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({
                                embeds: [errorembed]
                            })
                        }
                        guildSchema
                            .findOne({
                                guildID: message.guild.id
                            })
                            .then((data) => {
                                data.config.MutedRole = role.id
                                data.save().catch((err) => console.error(err))
                            })
                        message.guild.config.MutedRole = role.id
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(`Has seleccionado <@&${role.id}> como el nuevo rol para los muteos.`)
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else if (args[1].toLowerCase() == 'reset') {
                        guildSchema
                            .findOne({
                                guildID: message.guild.id
                            })
                            .then((data) => {
                                data.config.MutedRole = ''
                                data.save().catch((err) => console.error(err))
                            })
                        message.guild.config.MutedRole = ''
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(`Has reseteado el rol para los muteos. Ahora no se asignará ningun rol.`)
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [embed] })
                    } else {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(message.client.language.ERROREMBED)
                            .setDescription('Las únicas opciones disponibles son add <rol> o reset.')
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return message.channel.send({ embeds: [errorembed] })
                    }
                } else {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(
                            `Debes de seguir el siguiente esquema de comando: \`${prefix}config mutedrole <id/mención del rol>\`.`
                        )
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                }
            } else {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(message.client.language.ERROREMBED)
                    .setDescription(
                        `Esa configuración no existe. Revisa el comando escribiendo \`${prefix}help config\``
                    )
                    .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                return message.channel.send({ embeds: [errorembed] })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
