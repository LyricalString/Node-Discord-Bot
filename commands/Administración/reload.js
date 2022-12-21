const Command = require('../../structures/Commandos.js')
const { readdirSync, readdir } = require('fs')
const { MessageEmbed } = require('discord.js')
const { sendError } = require('../../utils/utils.js')
const categories = readdirSync('./commands')

module.exports = class Reload extends Command {
    constructor() {
        super({
            name: 'reload',
            description: ['Reload all commands.', 'Vuelve a cargar todos los comandos.'],
            alias: ['rl', 'rld'],
            permissions: ['ADMINISTRATOR'],
            role: 'dev',
            category: 'administracion'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            categories.forEach(async (category) => {
                readdir(`./commands/${category}`, (err) => {
                    if (err) return console.error(err)
                    const iniciar = async () => {
                        const commands = readdirSync(`./commands/${category}`).filter((archivo) =>
                            archivo.endsWith('.js')
                        )
                        for (const archivo of commands) {
                            const a = require(`../../commands/${category}/${archivo}`)
                            delete require.cache[require.resolve(`../../commands/${category}/${archivo}`)]
                            const command = new a(message.client)
                            message.client.commands.set(command.name.toLowerCase(), command)
                            if (command.aliases && Array.isArray(command.aliases)) {
                                for (let i = 0; i < command.aliases.length; i++) {
                                    message.client.aliases.set(command.aliases[i], command)
                                }
                            }
                        }
                    }
                    iniciar()
                })
            })
            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(message.client.language.SUCCESSEMBED)
                .setDescription('Todo ha sido recargado correctamente')
                .setFooter({text: message.author.username, message.author.avatarURL()})
            return message.channel.send({ embeds: [embed] })
        } catch (e) {
            sendError(e, message)
        }
    }
}
