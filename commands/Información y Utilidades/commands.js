const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const GuildModel = require('../../models/guild.js')
const { SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { sendError } = require('../../utils/utils.js')
let descripcion, usage
let encendido = false

module.exports = class Commands extends Command {
    constructor() {
        super({
            name: 'commands',
            description: [
                'List all of my commands and its uses.',
                'Muestra todos mis comandos y la información de los mismos.'
            ],
            cooldown: 5,
            alias: ['comandos', 'commandos', 'comands'],
            usage: ['<command>', '<commando>'],
            botpermissions: ['ADD_REACTIONS'],
            category: 'Info'
        })
    }
    async run(message, args) {
        try {
            const myCoolMenu = new SelectMenuBuilder()
                .setOptions(
                    {
                        label: message.client.language.COMMANDS[18],
                        description: message.client.language.COMMANDS[20],
                        value: 'm6',
                        emoji: {
                            name: '🕵️‍♀️'
                        }
                    },
                    {
                        label: message.client.language.COMMANDS[1],
                        description: message.client.language.COMMANDS[13],
                        value: 'm1',
                        emoji: {
                            name: '🔒'
                        }
                    },
                    {
                        label: message.client.language.COMMANDS[2],
                        description: message.client.language.COMMANDS[14],
                        value: 'm2',
                        emoji: {
                            name: '🎮'
                        }
                    },
                    {
                        label: message.client.language.COMMANDS[19],
                        description: message.client.language.COMMANDS[21],
                        value: 'm7',
                        emoji: {
                            name: '🎭'
                        }
                    },
                    {
                        label: message.client.language.COMMANDS[3],
                        description: message.client.language.COMMANDS[15],
                        value: 'm3',
                        emoji: {
                            name: '🎶'
                        }
                    },
                    {
                        label: message.client.language.COMMANDS[4],
                        description: message.client.language.COMMANDS[16],
                        value: 'm4',
                        emoji: {
                            name: '🌐'
                        }
                    },
                    {
                        label: message.client.language.COMMANDS[5],
                        description: message.client.language.COMMANDS[17],
                        value: 'm5',
                        emoji: {
                            name: '🛠️'
                        }
                    }
                )
                .setMaxValues(1)
                .setMinValues(1)
                .setCustomID('menucommands')
                .setPlaceHolder(message.client.language.COMMANDS[12])
            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setDescription(
                    `<a:828830816486293608:836296002893381682> ${message.client.language.COMMANDS[6]} \`${message.guild.prefix}help <${message.client.language.COMMANDS[7]}>\` ${message.client.language.COMMANDS[8]}.`
                )
                .addFields({ name: message.client.language.COMMANDS[9], value: message.client.language.COMMANDS[10] })
                .setFooter(
                    message.client.language.oldDiscord,
                    message.author.avatarURL({
                        dynamic: true
                    })
                )
                .setThumbnail(
                    message.author.avatarURL({
                        dynamic: true
                    })
                )
                .setTitle(`✨ - ${message.client.language.COMMANDS[11]}`)
            const m = await message.reply({
                embeds: [embed],
                components: [new ActionRowBuilder().addComponents(myCoolMenu)]
            })

            if (!encendido)
                m.on('collect', async (interaction) =>
                    GuildModel.findOne({ guildID: interaction.guild.id }).then(async (guild, err) => {
                        if (err) return
                        if (!guild) return
                        const lang = interaction.member.user.LANG
                        const [optionSelected] = interaction.values
                        if (optionSelected == 'm1') {
                            try {
                                let test = ''
                                message.client.commands.forEach((cmd) => {
                                    descripcion = lang == 'en_US' ? cmd.description[0] : cmd.description[1]
                                    if (cmd.usage) {
                                        usage = lang == 'en_US' ? cmd.usage[0] : cmd.usage[1]
                                    } else {
                                        usage = ''
                                    }
                                    if (cmd.category.toLowerCase() == 'moderacion') {
                                        if (usage && !cmd.inactive && !cmd.production && cmd.role != 'dev') {
                                            test += ` **${guild.PREFIX}${cmd.name} ** -${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `
                                        } else if (!usage && !cmd.inactive && !cmd.production && cmd.role != 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `
                                        }
                                    }
                                })
                                const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test)
                                interaction.update({
                                    components: []
                                })
                                interaction.reply({ embeds: [embed] })
                            } catch (error) {
                                console.error(error)
                            }
                        } else if (optionSelected == 'm2') {
                            try {
                                let test = ''
                                message.client.commands.forEach((cmd) => {
                                    if (cmd.usage) {
                                        usage = lang == 'en_US' ? cmd.usage[0] : cmd.usage[1]
                                    } else {
                                        usage = ''
                                    }
                                    descripcion = lang == 'en_US' ? cmd.description[0] : cmd.description[1]
                                    if (cmd.category.toLowerCase() == 'sesiones') {
                                        if (usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `
                                        } else if (!usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `
                                        }
                                    }
                                })
                                const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test)
                                interaction.update({
                                    components: []
                                })
                                interaction.reply({ embeds: [embed] })
                            } catch (error) {
                                console.error(error)
                            }
                        } else if (optionSelected == 'm3') {
                            try {
                                let test = ''
                                message.client.commands.forEach((cmd) => {
                                    if (cmd.usage) {
                                        usage = lang == 'en_US' ? cmd.usage[0] : cmd.usage[1]
                                    } else {
                                        usage = ''
                                    }
                                    descripcion = lang == 'en_US' ? cmd.description[0] : cmd.description[1]
                                    if (cmd.category.toLowerCase() == 'musica') {
                                        if (usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `
                                        } else if (!usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `
                                        }
                                    }
                                })
                                const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test)
                                interaction.update({
                                    components: []
                                })
                                interaction.reply({ embeds: [embed] })
                            } catch (error) {
                                console.error(error)
                            }
                        } else if (optionSelected == 'm4') {
                            try {
                                let test = ''
                                message.client.commands.forEach((cmd) => {
                                    if (cmd.usage) {
                                        usage = lang == 'en_US' ? cmd.usage[0] : cmd.usage[1]
                                    } else {
                                        usage = ''
                                    }
                                    descripcion = lang == 'en_US' ? cmd.description[0] : cmd.description[1]
                                    if (cmd.category.toLowerCase() == 'diversion') {
                                        if (usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `
                                        } else if (!usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `
                                        }
                                    }
                                })
                                const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test)
                                interaction.update({
                                    components: []
                                })
                                interaction.reply({ embeds: [embed] })
                            } catch (error) {
                                console.error(error)
                            }
                        } else if (optionSelected == 'm5') {
                            try {
                                let test = ''
                                message.client.commands.forEach((cmd) => {
                                    if (cmd.usage) {
                                        if (cmd.usage) {
                                            usage = lang == 'en_US' ? cmd.usage[0] : cmd.usage[1]
                                        }
                                    } else {
                                        usage = ''
                                    }
                                    descripcion = lang == 'en_US' ? cmd.description[0] : cmd.description[1]
                                    if (cmd.category.toLowerCase() === 'info') {
                                        if (usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `
                                        } else if (!usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `
                                        }
                                    }
                                })
                                const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test)
                                interaction.update({
                                    components: []
                                })
                                interaction.reply({ embeds: [embed] })
                            } catch (error) {
                                console.error(error)
                            }
                        } else if (optionSelected == 'm6') {
                            try {
                                let test = ''
                                message.client.commands.forEach((cmd) => {
                                    if (cmd.usage) {
                                        usage = lang == 'en_US' ? cmd.usage[0] : cmd.usage[1]
                                    } else {
                                        usage = ''
                                    }
                                    descripcion = lang == 'en_US' ? cmd.description[0] : cmd.description[1]
                                    if (cmd.category.toLowerCase() == 'administracion') {
                                        if (usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `
                                        } else if (!usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `
                                        }
                                    }
                                })
                                const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test)
                                interaction.update({
                                    components: []
                                })
                                interaction.reply({ embeds: [embed] })
                            } catch (error) {
                                console.error(error)
                            }
                        } else if (optionSelected == 'm7') {
                            try {
                                let test = ''
                                message.client.commands.forEach((cmd) => {
                                    if (cmd.usage) {
                                        usage = lang == 'en_US' ? cmd.usage[0] : cmd.usage[1]
                                    } else {
                                        usage = ''
                                    }
                                    descripcion = lang == 'en_US' ? cmd.description[0] : cmd.description[1]
                                    if (cmd.category.toLowerCase() == 'interaccion') {
                                        if (usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name} ${usage}\` \n `
                                        } else if (!usage && !cmd.inactive && !cmd.production && cmd.role !== 'dev') {
                                            test += `**${guild.PREFIX}${cmd.name}** - ${descripcion} | \`${guild.PREFIX}${cmd.name}\` \n `
                                        }
                                    }
                                })
                                const embed = new MessageEmbed().setColor(process.env.EMBED_COLOR).setDescription(test)
                                interaction.update({
                                    components: []
                                })
                                interaction.reply({ embeds: [embed] })
                            } catch (error) {
                                console.error(error)
                            }
                        }
                        encendido = true
                    })
                )
        } catch (e) {
            sendError(e, message)
        }
    }
}
