const Discord = require("discord.js");
class Event {
  constructor(client, file, options = {}) {
    this.client = client;
    this.name = options.name || file.name;
    this.file = file;
  }

  async run(...args) {
    const channel = this.client.channels.cache.get(process.env.errorChannel);
    try {
      await this.run(...args);
    } catch (err) {
      channel.send("error" + err);
      console.error(err);
    }
  }
}
module.exports = Event;