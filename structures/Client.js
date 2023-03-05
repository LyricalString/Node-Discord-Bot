const { Client, Collection } = require('discord.js')
const { readFileSync } = require('fs')
const archivo = require('.././lang/index.json')
const language = readFileSync('lang/' + archivo.find((language) => language.default).archivo).toString()

module.exports = class extends Client {
    constructor() {
        super({
            partials: ['MESSAGE', 'CHANNEL'],
            disableMentions: 'everyone',
            intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS'],
            messageCacheMaxSize: 50,
            messageCacheLifetime: 60,
            messageSweepInterval: 60,
            retryLimit: 2,
            restGlobalRateLimit: 50
        })

        this.commands = new Collection()
        this.messages = new Collection()
        this.snipes = new Collection()
        this.aliases = new Collection()
        this.language = JSON.parse(language)
        this.cooldowns = new Collection()
    }
    async login(token = this.token) {
        super.login(token)
    }
}
