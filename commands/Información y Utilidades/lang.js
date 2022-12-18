const { MessageEmbed } = require('discord.js')
const { SelectMenuBuilder, ActionRowBuilder } = require('@discordjs/builders')
const Command = require('../../structures/Commandos.js')
const userModel = require('../../models/user.js')

module.exports = class Lang extends Command {
    constructor(client) {
        super(client, {
            name: 'lang',
            description: ['Select your language using this menu.', 'Seleccione su idioma usando este menú.'],
            alias: ['language', 'idioma', 'lenguaje'],
            cooldown: 5,
            category: 'info'
        })
    }
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     * @param {string} prefix
     * @param {string} lang
     * @param {*} webhookClient
     * @param {*} ipc
     */
    async run(client, message, args, prefix, lang, webhookClient, ipc) {
        try {
            const menu = new SelectMenuBuilder()
                .setCustomId('menu1')
                .setPlaceholder(client.language.LANGMENU[1])
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
                .setFooter('Selecciona un lenguaje de la lista.', message.author.displayAvatarURL())
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
                                .setTitle(client.language.ERROREMBED)
                                .setDescription(client.language.LANGMENU[3])
                                .setFooter(message.author.username, message.author.avatarURL())
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
                            .setTitle(client.language.SUCCESSEMBED)
                            .setDescription(
                                lang === 'es_ES'
                                    ? 'Has seleccionado español como tu nuevo idioma.'
                                    : "You've selected English as your new language"
                            )
                            .setFooter(message.author.username, message.author.avatarURL())
                        return interaction.update({ embeds: [embed], components: [] })
                    } catch (error) {
                        console.error(error)
                    }
                }
            )
        } catch (e) {
            console.error(e)
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.fatal_error)
                        .setFooter(message.author.username, message.author.avatarURL())
                ]
            })
            webhookClient.send(
                `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
            )
            message.author
                .send(
                    'Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>'
                )
                .catch((e) => null)
        }
    }
}
