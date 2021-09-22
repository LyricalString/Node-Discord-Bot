require("dotenv").config();

const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

module.exports = class ServerInfo extends Command {
  constructor(client) {
    super(client, {
      name: "server-info",
      botpermissions: ["ATTACH_FILES"],
      description: [
        "Display info about this server.",
        "Muestra información sobre este servidor.",
      ],
      alias: ["serverinfo", "serverinf", "si"],
      cooldown: 5,
      category: "Info",
    });
  }
  async run(client, message, args, prefix, lang, webhookClient, ipc) {
    try {
      let region = {
        europe: "Europa",
        brazil: "Brasil",
        hongkong: "Hong Kong",
        japan: "Japón",
        russia: "Rusia",
        singapore: "Singapur",
        southafrica: "Sudáfrica",
        sydney: "Sydney",
        "us-central": "Central US",
        "us-east": "Este US",
        "us-south": "Sur US",
        "us-west": "Oeste US",
        "vip-us-east": "VIP US Este",
        "eu-central": "Europa Central",
        "eu-west": "Europa Oeste",
        london: "London",
        amsterdam: "Amsterdam",
        india: "India",
      };

      let verification = {
        NONE: client.language.SERVERINFO[1],
        LOW: client.language.SERVERINFO[2],
        MEDIUM: client.language.SERVERINFO[3],
        HIGH: client.language.SERVERINFO[4],
        VERY_HIGH: client.language.SERVERINFO[5],
      };

      let explicitContent = {
        DISABLED: client.language.SERVERINFO[6],
        MEMBERS_WITHOUT_ROLES: client.language.SERVERINFO[7],
        ALL_MEMBERS: client.language.SERVERINFO[8],
      };
      const guild = message.guild;
      const channel = guild.channels.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.toString())
        .slice(0, -1);
      const members = guild.members.cache;
      const role = guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.toString())
        .slice(0, -1);
      const boost = guild.premiumTier;
      const emojis = message.guild.emojis.cache;
      const boostcount = guild.premiumSubscriptionCount;
      const bots = members.filter((member) => member.user.bot).size;
      const humans = members.filter((member) => !member.user.bot).size;
      const create = moment(message.guild.createdTimestamp).format(
        "DD-MM-YYYY"
      );
      const banner = guild.banner;

      message.channel.send({ embeds: [
        new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setTimestamp()
          .setFooter(guild.name, guild.iconURL({ dynamic: true }))
          .setTitle(guild.name)
          .addField(
            `<:serverowner:863983092930183169> ${client.language.SERVERINFO[9]}`,
            `<@${guild.ownerId}>`
          )
          .addField(
            client.language.SERVERINFO[10],
            "```" + `${guild.id}` + "```",
            true
          )
          .addField( `<:members:864107765050638367> ${client.language.SERVERINFO[11]}`, "```" + `${guild.memberCount}` + "```", true )
          .addField( `😀 ${client.language.SERVERINFO[12]} [${emojis.size}]`, `<:join:864104115076595762> ${client.language.SERVERINFO[13]}: ${emojis.filter((emoji) => !emoji.animated).size }\n<a:flecha2:836295945423552522> ${client.language.SERVERINFO[14] }: ${emojis.filter((emoji) => emoji.animated).size}`, true )
          .addField( `<:ticketblurple:863983092783382548> ${client.language.SERVERINFO[15]}`, "```" + `${role.length}` + "```", true )
          .addField( `<:plus:864103028867727420> ${client.language.SERVERINFO[16]} [${guild.channels.cache.size}]`, `<:category:864116468291338290> ${client.language.SERVERINFO[17] }: ${guild.channels.cache.filter((x) => x.type === "GUILD_CATEGORY").size}\n<:textchannelblurple:863983092893220885> ${client.language.SERVERINFO[18] }: ${guild.channels.cache.filter((x) => x.type === "GUILD_TEXT").size }\n<:voicechannelblurple:864103406309867531> ${client.language.SERVERINFO[19] }: ${guild.channels.cache.filter((x) => x.type === "GUILD_VOICE").size}`, true )
          .addField( `📆 ${client.language.SERVERINFO[20]}`, "```" + `${create}` + "```", true )
          .addField( `<:serverbooster:864102069728313354> ${client.language.SERVERINFO[21]}`, "```" + `${boostcount}` + "```", true )
          .addField( `<:money:864102174908612619> ${client.language.SERVERINFO[22]}`, `${boost ? "```" + `${client.language.SERVERINFO[23]} ${boost}` + "```" : "```" + `No` + "```" }`, true, true )
          //.addField(`<:roles:864116470648930304> Roles [${role.length}]`, role.length < 10 ? role.join(', ') : role.length > 10 ? trimArray(role) : 'None')
          .addField( `**${client.language.SERVERINFO[25]}**`, `${verification[guild.verificationLevel]}` )
          .addField( `**${client.language.SERVERINFO[26]}**`, "```" + `${explicitContent[guild.explicitContentFilter]}` + "```" )
          .setImage(guild.bannerURL({ dynamic: true }))
      ]});
    } catch (e) {
      console.error(e);
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle(client.language.ERROREMBED)
          .setDescription(client.language.fatal_error)
          .setFooter(message.author.username, message.author.avatarURL())
        ]
      });
      webhookClient.send(
        `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
      );
      try {
        message.author
          .send(
            "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
          )
          .catch(e);
      } catch (e) { }
    }
  }
};

function trimArray(arr, maxLen = 10) {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen;
    arr = arr.slice(0, maxLen);
    arr.push(`${len} more...`);
  }
  return arr;
}
