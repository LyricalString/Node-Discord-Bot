const parserTimeStamp = require('../..//utils/parserTimeStamp.js')

const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')

module.exports = class McHistory extends Command {
    constructor(client) {
        super(client, {
            name: 'mchistory',
            description: [
                'Shows past names from Minecraft User.',
                'Muestra nombres pasados ​​de un usuario de Minecraft.'
            ],
            usage: ['<minecraft java username>', '<nombre minecraft java>'],
            args: true,
            cooldown: 3,
            category: 'Info'
        })
    }
    async run(client, message, args, prefix, lang, ipc) {
        try {
            let args2 = args.join('%20')
            let Fecha
            let NameMC
            if (!args2[1])
                return message.channel.send(
                    client.language.MCHISTORY[1] + process.env.prefix + client.language.MCHISTORY[2]
                )
            fetch(`https://mc-heads.net/minecraft/profile/${args2}`)
                .then((res) => {
                    if (res.status == 200) {
                        return res.json()
                    } else {
                        const errorembed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(client.language.ERROREMBED)
                            .setDescription(client.language.MCHISTORY[3])
                            .setFooter({ text: message.author.username, iconURL: message.author.avatarURL() })
                        message.channel.send({ embeds: [errorembed] })
                        return undefined
                    }
                })
                .then((History_Info) => {
                    if (!History_Info) return

                    const embedhistory = new MessageEmbed()
                        .setTitle(client.language.MCHISTORY[4])
                        .setColor(process.env.EMBED_COLOR)
                        .setTimestamp()

                    for (var index = 0; index < History_Info['name_history'].length; index++) {
                        Fecha = History_Info['name_history'][index]['changedToAt']
                        NameMC = History_Info['name_history'][index]['name']

                        if (!Fecha) {
                            embedhistory.addFields({ name: client.language.MCHISTORY[5], value: NameMC }) // LENGUAJEEEEEEEEEEEEEEE
                        } else {
                            embedhistory.addFields({ name: parserTimeStamp(Fecha), value: NameMC })
                        }
                    }
                    message.channel.send({
                        embeds: [embedhistory]
                    })
                })
        } catch (e) {
            sendError(e, message)
        }
    }
}
