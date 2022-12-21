const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class Invitations extends Command {
    constructor() {
        super({
            name: 'invitations',
            botpermissions: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
            description: [
                "Information about a user's invitations.",
                'Información sobre las invitaciones de un usuario.'
            ],
            usage: ['<invite link or code>', '<link invitación o código>'],
            category: 'Info',
            args: true,
            production: true
        })
    }
    async run(message, args, prefix, lang) {
        try {
            //Bueno..., quien sabe...
            if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
                message.reply({
                    content: `${message.client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``
                })
            } else {
                if (!message.deleted) message.delete().catch((e) => console.log(e))
            }
            try {
                //Recoger la información desde la API
                const invite = await message.guild.invites.fetch(args[0])
                console.debug(invite)
                //Los embeds son bonitos, vamos a usarlos
                const embed = new MessageEmbed()
                    .setTitle('Invite information')
                    //.setDescription("The API doesn't give me as much information about a Discord invite")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor('RANDOM')

                //Si en caso esto viene de un servidor...
                if (invite.guild) {
                    //Fijense que esos son los detalles que fetchInvite me dio.
                    embed
                        .setThumbnail(invite.guild.iconURL({ dynamic: true }))
                        .addField(
                            'Guild',
                            invite.guild.name + '\n`' + (invite.guild.id ? invite.guild.id.toString() : 'None') + '`',
                            true
                        )
                        .addField(
                            'Guild Verification',
                            invite.guild.verificationLevel ? invite.guild.verificationLevel.toString() : 'None',
                            true
                        )
                        .addField(
                            'Presence Count',
                            invite.presenceCount ? invite.presenceCount.toString() : 'None',
                            true
                        )
                } //Si proviene de un grupo MD
                else if (invite.channel.type === 'group') {
                    embed
                        .setThumbnail(invite.channel.iconURL({ dynamic: true }))
                        .addFields({ name: 'Type', value: 'Group DM invite', inline: true })
                        .addFields({
                            name: 'Group name',
                            value: invite.channel.name ? invite.channel.name.toString() : 'None',
                            inline: true
                        })
                }
                embed.addFields({
                    name: 'Member Count',
                    value: invite.uses ? invite.uses.toString() : '0',
                    inline: true
                })
                if (invite.createdTimestamp)
                    embed.addFields({
                        name: 'Created Timestamp',
                        value: `<t:${Math.trunc(invite.createdTimestamp / 1000)}>`,
                        inline: true
                    })

                //Hay que ser ordenado en los fields
                if (invite.guild) {
                    embed.addField(
                        'Redirects to',
                        invite.channel.name + '\n' + invite.channel ? invite.channel.toString() : 'None',
                        true
                    )
                }
                embed.addField(
                    'Inviter',
                    invite.inviter ? invite.inviter.tag.toString() + '\n' + invite.inviter.toString() : 'None',
                    true
                )

                //A enviarlo
                message.channel.send({ embeds: [embed] })
            } catch (err) {
                console.warn(err)
                //Si fuera porque pusimos algo que no es invitación
                if (err.message === 'Unknown Invite')
                    return message.channel.send('The API says that invitation is unknown.')
                else
                    return message.channel.send(
                        "Something happened when I was trying to collect the information. Here's a debug: " + err
                    )
            }
            // let user = message.mentions.users.first() || message.author; //Definimos user como una mención, y si no se menciona tomará al autor del mensaje

            // const invites = await message.guild.fetchInvites(); //Usamos fetchInvites para obtener las invitaciones del servidor

            // if (invites.size == 0) {
            //   //Si no hay invitaciones en el servidor retornará un mensaje
            //   const errorembed = new MessageEmbed()
            //     .setColor("RED")
            //     .setTitle(message.client.language.ERROREMBED)
            //     .setDescription(message.client.language.INVITATIONS[4])
            //     .setFooter({text: message.author.username, message.author.avatarURL()});
            //   return message.channel.send({embeds: [errorembed]});
            // }

            // const filtered = invites.filter(
            //   (inv) => inv.inviter && inv.inviter.id == user.id
            // ); //En esta linea filtramos para obtener solo las invitaciones del user
            // let uses = 0;
            // filtered.forEach((inv) => {
            //   //Usamos un ciclo de control para iterar las invitaciones (forEach)
            //   console.debug(inv.code);
            //   uses += inv.uses;
            // });

            // let previousButton = new MessageButton()
            //   .setStyle("red")
            //   .setLabel("Previous!")
            //   .setID("next");

            // let nextButton = new MessageButton()
            //   .setStyle("blurple")
            //   .setLabel("Next!")
            //   .setID("previous");

            // for (let index in filtered.size) {
            //   const invite = new MessageEmbed()
            //     .setAuthor(
            //       message.client.language.INVITATIONS[6] + `${user.tag}`,
            //       user.avatarURL()
            //     )
            //     .setColor(process.env.EMBED_COLOR)
            //     .addFields({name: message.client.language.INVITATIONS[7], filtered.size, value: true})
            //     .addFields({name: message.client.language.INVITATIONS[8], uses, value: true})
            //     .setTimestamp(" ");
            // }
            // const successEmbed = new MessageEmbed()
            //   .setAuthor(
            //     message.client.language.INVITATIONS[6] + `${user.tag}`,
            //     user.avatarURL()
            //   )
            //   .setColor(process.env.EMBED_COLOR)
            //   .addFields({name: message.client.language.INVITATIONS[7], filtered.size, value: true})
            //   .addFields({name: message.client.language.INVITATIONS[8], uses, value: true})
            //   .setTimestamp(" ");

            // let ButtonArray = [previousButton, nextButton];
            // return await message.channel.send({
            //   embed: successEmbed,
            //   buttons: ButtonArray,
            // }); //En esta linea envía el mensaje y si hay un error lo envía a la consola
        } catch (e) {
            sendError(e, message)
        }
    }
}
