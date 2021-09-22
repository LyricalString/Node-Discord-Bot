require("dotenv").config();
const Event = require("../../structures/Event.js");

module.exports = class messageDelete extends Event {
  constructor(...args) {
    super(...args);
  }
  async run(message) {
    if (!message.embeds[0]) {
      this.client.snipes.set(message.channel.id, {
        embed: false,
        content: message.content,
        delete: message.author,
        canal: message.channel,
      });
    } else {
      this.client.snipes.set(message.channel.id, {
        embed: true,
        title: message.embeds[0].title,
        description: message.embeds[0].description,
        url: message.embeds[0].url,
        color: message.embeds[0].color,
        timestamp: message.embeds[0].timestamp,
        fields: message.embeds[0].fields,
        thumbnail: message.embeds[0].thumbnail,
        image: message.embeds[0].image,
        video: message.embeds[0].video,
        footer: message.embeds[0].footer,
        delete: message.author,
        canal: message.channel,
      });
    }
  }
};
