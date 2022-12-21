const axios = require('axios')

const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class McServer extends Command {
    constructor() {
        super({
            name: 'mcserver',
            description: [
                'Gets information about a Minecraft Server!',
                '¡Obtiene información sobre un servidor de Minecraft!'
            ],
            alias: ['minecraftserver', 'ms', 'mcstatus', 'mcserverstatus', 'mstatus', 'mcservers'],
            usage: ['<server ip>', '<ip del servidor>'],
            spam: true,
            cooldown: 5,
            args: true,
            category: 'Info'
        })
    }
    async run(message, args, prefix, lang) {
        try {
            let url
            if (args[1]) {
                url = `http://status.mclive.eu/${args[0]}/${args[0]}/${args[1]}/banner.png`
            } else {
                url = `http://status.mclive.eu/${args[0]}/${args[0]}/25565/banner.png`
            }
            axios
                .get(url, {
                    responseType: 'arraybuffer'
                })
                .then((image) => {
                    let returnedB64 = Buffer.from(image.data).toString('base64')
                    const sfattach = new Discord.MessageAttachment(image.data, 'output.png')
                    message.channel.send({ files: [sfattach] })
                })
                .catch(() => {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(message.client.language.ERROREMBED)
                        .setDescription(message.client.language.MCSERVER[12])
                        .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                    return message.channel.send({ embeds: [errorembed] })
                })
        } catch (e) {
            sendError(e, message)
        }
    }
}
