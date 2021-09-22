require("dotenv").config();
const { ShardingManager, DiscordAPIError } = require("discord.js");

//Hago esto para solo ejecutar una vez el código de TopGG
const fs = require('fs');
fs.readFile('start.txt', 'utf8', function(err, data) {
    if (data == "true") {
        fs.writeFile("start.txt", "false", (err) => {
            if (err) console.log(err);
        });
    }
})
const manager = new ShardingManager("./bot.js", {
    token: process.env.token,
    totalShards: "auto",
    shardList: "auto",
    mode: `process`,
    respawn: true,
    timeout: 87398,
});

process.on('unhandledRejection', (reason) => {
    if (reason instanceof DiscordAPIError) return;
    console.error(reason);
});

if (process.env.mode == 'production') {
    const { AutoPoster } = require('topgg-autoposter')
    const poster = AutoPoster(process.env.topggToken, manager)
    
    poster.on('posted', (stats) => {
      console.log(`Actualizando TopGG... | ${stats.serverCount} servidores.`)
    })
}

manager.on('shardCreate', shard => console.log(`Iniciando shard ${shard.id + 1}`));

manager.spawn().catch((err) => console.log(err));