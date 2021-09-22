module.exports = class Commando {
  constructor(client, opciones) {
    this.client = client;
    this.name = opciones.name;
    this.aliases = opciones.alias;
    this.description = opciones.description;
    this.args = opciones.args || false;
    this.inactive = opciones.inactive || false;
    this.exclusive = opciones.exclusive || false;
    this.usage = opciones.usage;
    this.type = opciones.type;
    this.options = opciones.options || false;
    this.role = opciones.role || false;
    this.subcommands = opciones.subcommands;
    this.cooldown = opciones.cooldown || false;
    this.permissions = opciones.permissions || false;
    this.nochannel = opciones.nochannel || false;
    this.category = opciones.category;
    this.production = opciones.production || false;
    this.botpermissions = opciones.botpermissions || false;
    this.tos = opciones.tos || false;
    this.spam = opciones.spam || false;
  }
};