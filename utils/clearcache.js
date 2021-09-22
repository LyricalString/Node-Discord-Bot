require("dotenv").config();
const fetch = require('node-fetch');
const Discord = require('discord.js')
const UserModel = require('../models/user.js')

module.exports = async function clearcache(client, ipc) {
	setInterval(async () => {
		client.users.cache.forEach((user) => {
			if (!user.timestamp) return client.users.cache.delete(user.id)
			if (2 * 60 * 1000 < Date.now() - user.timestamp) {
				return client.users.cache.delete(user.id)
			}
		});
	}, 60000);
}