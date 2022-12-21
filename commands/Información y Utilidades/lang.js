const { MessageEmbed } = require('discord.js')
const { SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const Command = require('../../structures/Commandos.js')
const userModel = require('../../models/user.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Lang extends Command {
    constructor() {
        super({
            name: 'lang',
            description: ['Select your language using this menu.', 'Seleccione su idioma usando este menú.'],
            alias: ['language', 'idioma', 'lenguaje'],
            cooldown: 5,
            category: 'info'
        })
    }
    /**
     *
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     * @param {string} prefix
     */
    async run(message, args) {
        try {
            const menu = new SelectMenuBuilder()
                .setCustomId('menu1')
                .setPlaceholder(message.client.language.LANGMENU[1])
                .setMaxValues(1)
                .setMinValues(1)
                .addOptions(
                    {
                        label: 'Español',
                        description: 'Selecciona el español como el idioma predefinido.',
                        value: 'es',
                        emoji: {
                            name: '🇪🇸'
                        }
                    },
                    {
                        label: 'English',
                        description: 'Selects english as the main language.',
                        value: 'en',
                        emoji: {
                            name: '🇺🇸'
                        }
                    }
                )
            const embed = new MessageEmbed()
                .setTitle('Selecciona un lenguaje de la lista.')
                .setColor(process.env.EMBED_COLOR)
            const m = await message.reply({
                embeds: [embed],
                components: [new ActionRowBuilder().setComponents(menu)]
            })
            m.createMessageComponentCollector({ filter: (i) => i.customId === 'menu1', max: 1 }).on(
                'collect',
                async (interaction) => {
                    try {
                        let user = message.member.user
                        if (interaction.member.id != message.author.id) {
                            const errorembed = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(message.client.language.ERROREMBED)
                                .setDescription(message.client.language.LANGMENU[3])
                                .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                            return message.channel.send({ embeds: [errorembed] })
                        }
                        const lang = interaction.values[0] === 'es' ? 'es_ES' : 'en_EN'
                        userModel.findOneAndUpdate(
                            {
                                USERID: user.id
                            },
                            {
                                USERID: user.id,
                                COMMANDS_EXECUTED: parseInt(user.COMMANDS_EXECUTED),
                                VOTED: user.VOTED,
                                BANNED: user.BANNED,
                                LANG: lang,
                                DEV: user.DEV,
                                PREMIUM_COMMANDS: user.PREMIUM_COMMANDS,
                                isINDB: user.isINDB,
                                Roles: user.ROLES,
                                OLDMODE: user.OLDMODE
                            },
                            { upsert: true }
                        )
                        user.LANG = lang
                        const embed = new MessageEmbed()
                            .setColor(process.env.EMBED_COLOR)
                            .setTitle(message.client.language.SUCCESSEMBED)
                            .setDescription(
                                lang === 'es_ES'
                                    ? 'Has seleccionado español como tu nuevo idioma.'
                                    : "You've selected English as your new language"
                            )
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        return interaction.update({ embeds: [embed], components: [] })
                    } catch (error) {
                        console.error(error)
                    }
                }
            )
        } catch (e) {
            sendError(e, message)
        }
    }
}
