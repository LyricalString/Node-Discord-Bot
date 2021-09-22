const fs = require("fs");
const eventFolders = fs.readdirSync("./events/");

module.exports = (client) => {
  eventFolders.forEach(async (eventFolder) => {
    const events = fs.readdirSync(`./events/${eventFolder}`);
    const jsevents = events.filter((c) => c.split(".").pop() === "js");
    for (let i = 0; i < jsevents.length; i++) {
      if (!jsevents.length)
        throw Error("No se encontraron archivos de javascript");
      const file = require(`../events/${eventFolder}/${jsevents[i]}`);
      const event = new file(client, file);
      if (typeof event.run !== "function")
        throw Error(`No se encontró la función ${jsevents[i]}`);
      const name = jsevents[i].split(".")[0];
      client.on(name, (...args) => event.run(...args));
    }
  });
};