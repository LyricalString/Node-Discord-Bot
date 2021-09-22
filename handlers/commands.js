const fs = require("fs");
const categories = fs.readdirSync("./commands");

module.exports = (client) => {
  categories.forEach(async (category) => {
    fs.readdir(`./commands/${category}`, (err) => {
      if (err) return console.error(err);
      const iniciar = async () => {
        const commands = fs
          .readdirSync(`./commands/${category}`)
          .filter((archivo) => archivo.endsWith(".js"));
        for (const archivo of commands) {
          const a = require(`../commands/${category}/${archivo}`);
          const command = new a(client);
          client.commands.set(command.name.toLowerCase(), command);
          if (command.aliases && Array.isArray(command.aliases)) {
            for (let i = 0; i < command.aliases.length; i++) {
              client.aliases.set(command.aliases[i], command);
            }
          }
        }
      };
      iniciar();
    });
  });
};