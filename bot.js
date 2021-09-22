//------------------------------------------
//         CONSTANTES Y VARIABLES
//------------------------------------------
require("dotenv").config();
const Discord = require("discord.js");
const Bot = require("./structures/Client.js");
const client = new Bot();
client.login();

require("./handlers/events.js")(client);
require("./handlers/commands.js")(client);
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();