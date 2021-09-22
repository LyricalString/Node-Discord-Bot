const ConfigGuild = require("../models/guild.js");
module.exports = function Check_Admin(message, ID, client) {
  return ConfigGuild.findOne({ guildID: message.guild.id }).then((s) => {
    try {
      if (
        message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR') ||
        message.guild.ownerId === message.author.id
      ) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return;
      message.channel.send("No tienes permisos");
    }
  });
};
