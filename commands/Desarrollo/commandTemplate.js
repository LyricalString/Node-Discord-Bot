const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class a extends Command {
    constructor() {
        super({
            name: 'a',
            description: ['Stops and deletes the current song.', 'Detiene y elimina la cola de reproducción.'],
            usage: [],
            category: 'music',
            args: true,
            production: true
        })
    }
    async run(message, args, prefix) {
        try {
        } catch (e) {
            sendError(e, message)
        }
    }
}
