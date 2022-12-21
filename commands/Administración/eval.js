const Command = require('../../structures/Commandos.js')
const { inspect } = require('util')
const { MessageEmbed } = require('discord.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Channel extends Command {
    constructor() {
        super({
            name: 'eval',
            description: ['Evaluates a code.', 'Evalua un codigo.'],
            usage: ['<code>', '<codigo>'],
            permissions: ['ADMINISTRATOR'],
            category: 'Utils',
            cooldown: 1,
            nochannel: true,
            role: 'dev', //dev, tester, premium, voter
            args: true
        })
    }
    async run(message, args) {
        try {
            let evaled
            try {
                evaled = await eval(args.join(' '))
                const embed = new MessageEmbed()
                    .setAuthor('Eval | Node')
                    .setColor(process.env.EMBED_COLOR)
                    .addFields({ name: ':inbox_tray: Entrada', value: `\`\`\`js\n${args.join(' ')}\`\`\`` })
                    .addFields({ name: ':outbox_tray: Salida', value: `\`\`\`js\n${inspect(evaled)}\n\`\`\`` })
                    .setTimestamp()

                message.channel.send({ embeds: [embed] }).catch((e) => {
                    console.log(evaled)
                })
            } catch (error) {
                console.error(error)
                message.reply({
                    content: `there was an error during evaluation. ${error.toString()}`
                })
            }
        } catch (e) {
            sendError(e, message)
        }
    }
}
