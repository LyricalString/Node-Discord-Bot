const Event = require('../../structures/Event.js')
const { WebhookClient } = require('discord.js')
const webhookClient = new WebhookClient({
    url: process.env.guildAddWebhookURL
})

module.exports = class guildCreate extends Event {
    constructor(...args) {
        super(...args)
    }
    async run(guild) {
        if (guild.memberCount > 10000) {
            webhookClient.send(
                `Se ha añadido una nueva Guild: **${guild.name}**. Numero de usuarios: **${guild.memberCount}**`
            )
        } else if (guild.memberCount > 500) {
            webhookClient.send(
                `Se ha añadido una nueva Guild: **${guild.name}**. Numero de usuarios: **${guild.memberCount}**`
            )
        }
    }
}
