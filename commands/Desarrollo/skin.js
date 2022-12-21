const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')
let encendido = false

module.exports = class Skin extends Command {
    constructor() {
        super({
            name: 'skin',
            description: ['Shows a menu with the skins.', 'Muestra un menú con las skins.'],
            usage: ['<@user>', '<@usuario>'],
            args: true,
            category: 'Utils',
            inactive: true
        })
    }
    async run(message, args, prefix) {
        try {
            let cabeza = new MessageButton()
                .setStyle('blurple') //default: blurple
                .setLabel(' Cabeza') //default: NO_LABEL_PROVIDED
                .setEmoji('🟥')
                .setID('bu1')
            let cuerpo = new MessageButton()
                .setStyle('blurple') //default: blurple
                .setLabel(' Cuerpo') //default: NO_LABEL_PROVIDED
                .setEmoji('🟧')
                .setID('bu2')
            let avatar = new MessageButton()
                .setStyle('blurple') //default: blurple
                .setLabel(' Avatar') //default: NO_LABEL_PROVIDED
                .setEmoji('🟩')
                .setID('bu3')
            let jugador = new MessageButton()
                .setStyle('blurple') //default: blurple
                .setLabel(' Jugador') //default: NO_LABEL_PROVIDED
                .setEmoji('🟦')
                .setID('bu4')
            console.log('2')
            let ButtonArray = [cabeza, cuerpo, avatar, jugador]

            const embed = new MessageEmbed()
                .setColor(process.env.EMBED_COLOR)
                .setTitle(`${args[0]}`)
                .setDescription(
                    `<a:828830816486293608:836296002893381682> Aquí encontraras las distintas opciones que puedes elegir sobre la skin del jugador que has seleccionado.`
                )
                .addField(
                    'Categorias',
                    'Las distintas opciones a elegir están divididas en categorías. Solo pulsa una y te mostrará lo relacionado de dicha categoría.'
                )
                .setThumbnail(
                    message.author.avatarURL({
                        dynamic: true
                    })
                )
            console.log('3')

            //message.lineReply('¡Te he enviado un mensaje privado con mis comandos!')
            message.channel.send({
                embed: embed,
                buttons: ButtonArray
            })
            console.log('4')
            if (encendido == false) {
                message.client.on('clickButton', async (button, err) => {
                    if (err) return
                    console.log('5')
                    if (button.id === 'bu1') {
                        const embed = new MessageEmbed()
                            .setColor('#DD8811')
                            .setImage(`https://mc-heads.net/head/${args[0]}`)
                        await button.reply.send('', {
                            embed: embed,
                            ephemeral: true
                        })
                        console.log('6')
                        return
                    } else if (button.id === 'bu2') {
                        const embed = new MessageEmbed()
                            .setColor('#DD8811')
                            .setImage(`https://mc-heads.net/body/${args[0]}`)
                        await button.reply.send('', {
                            embed: embed,
                            ephemeral: true
                        })
                        console.log('7')
                        return
                    } else if (button.id === 'bu3') {
                        const embed = new MessageEmbed()
                            .setColor('#DD8811')
                            .setImage(`https://mc-heads.net/avatar/${args[0]}`)
                        await button.reply.send('', {
                            embed: embed,
                            ephemeral: true
                        })
                        console.log('8')
                        return
                    } else if (button.id === 'bu4') {
                        const embed = new MessageEmbed()
                            .setColor('#DD8811')
                            .setImage(`https://mc-heads.net/player/${args[0]}`)
                        await button.reply.send('', {
                            embed: embed,
                            ephemeral: true
                        })
                        console.log('9')
                        return
                    }
                    console.log('Saliendo')
                })
            } else return
        } catch (e) {
            sendError(e, message)
        }
    }
}
