const Event = require("../../structures/Event");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
require("dotenv").config();
const guildModel = require('../../models/guild.js')

module.exports = class VoiceStateUpdate extends Event {
	constructor(...args) {
		super(...args);
	}
	async run(oldVoice, newVoice) {
		try {
			const guild = this.client.guilds.cache.get(newVoice.guild.id)
			const everyoneRole = guild.roles.everyone;
			const userch = newVoice.guild.members.cache.get(newVoice.id)
			guildModel.findOne({ guildID: newVoice.guild.id }).then((s, err) => {
				if (err) return console.lpg(err)
				if (!s || !s.config.Pvc || !s.config.Pvc.Enabled) return
				if (oldVoice.channelId) {
					const channel2 = this.client.channels.cache.get(oldVoice.channelId)
					if (!channel2) return
					if ((channel2.parentId == s.config.Pvc.Category) && s.config.Pvc.TemporaryChannels && channel2.members.size == 0) {
						s.config.Pvc.TemporaryChannels.forEach(canal => {
							let canalID = canal.slice(0, 18)
							if (oldVoice.channelId == canalID) {
								s.config.Pvc.TemporaryChannels.splice(s.config.Pvc.TemporaryChannels.indexOf(channel2.id + newVoice.id), s.config.Pvc.TemporaryChannels.indexOf(channel2.id + newVoice.id) + 1)
								channel2.delete()
								s.save().catch(e => console.log(e))
							}
						})
					}
				}
				if (newVoice.channelId && newVoice.channelId == s.config.Pvc.StartingChannel) {
					guild.channels.create(userch.user.tag, {
						type: 'GUILD_VOICE',
						parent: s.config.Pvc.Category,
						permissionOverwrites: [
							{
								id: everyoneRole,
								deny: ['VIEW_CHANNEL'],
							},
							{
								id: userch,
								allow: ['VIEW_CHANNEL'],
							},
						],
					}).then((createdchannel) => {
						if (!s.config.Pvc.TemporaryChannels) {
							s.config.Pvc.TemporaryChannels = []
						}
						s.config.Pvc.TemporaryChannels.push(createdchannel.id + newVoice.id)
						userch.voice.setChannel(createdchannel)
						s.save().catch(e => console.log(e))
					})
				}
			})
			if (!oldVoice || !oldVoice.guild || !oldVoice.guild.id) return;
			const player = this.client.manager.players.get(oldVoice.guild.id);
			if (!player) return;
			if (!this.client || !this.client.user || !this.client.user.id) return
			if (player.twentyFourSeven) return;
			if (newVoice.guild && !newVoice.guild.members.cache.get(this.client.user.id).voice.channelId)
				player.destroy();
			if (oldVoice.id === this.client.user.id) return;
			if (!oldVoice.channelId) return
			if (oldVoice.guild && !oldVoice.guild.members.cache.get(this.client.user.id).voice.channelId) return;
			if (oldVoice.guild && oldVoice.guild.members.cache.get(this.client.user.id).voice.channel && oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id == oldVoice.channelId) {
				if (oldVoice.guild.me.voice.channel && oldVoice.guild.me.voice.channel.members && oldVoice.guild.me.voice.channel.members.size === 1) {
					const vcName = oldVoice.guild.me.voice.channel.name;
					const embed = new MessageEmbed()
						.setColor(process.env.EMBED_COLOR)
						.setDescription(
							`${this.client.language.VOICESTATEUPDATE[1]} **${vcName}** ${this.client.language.VOICESTATEUPDATE[2]
							} ${300000 / 1000} ${this.client.language.VOICESTATEUPDATE[3]}`
						);
					const channel2 = await this.client.channels.cache.get(player.textChannel)
					if (!channel2) return
					const msg = await channel2.send({ embeds: [embed] });
					const delay = (ms) => new Promise((res) => setTimeout(res, ms));
					await delay(300000);

					if (!oldVoice.guild.me.voice.channel) return
					const vcMembers = oldVoice.guild.me.voice.channel.members.size;
					if (!vcMembers || vcMembers === 1) {
						const newPlayer = this.client.manager.players.get(
							newVoice.guild.id
						);
						if (newPlayer) {
							player.destroy();
						} else {
							console.log(oldVoice.guild.me)
							oldVoice.guild.me.voice.channel.leave();
						}

						const embed2 = new MessageEmbed()
							.setColor(process.env.EMBED_COLOR)
							.setDescription(this.client.language.VOICESTATEUPDATE[4]);
						return msg?.edit({ content: " ", embeds: [embed2] });
					} else {
						return msg?.delete();
					}
				}
			}
		} catch (e) {
			console.log(e)
			let guildAddWebhookID = process.env.guildAddWebhookID
			let guildAddWebhookToken = process.env.guildAddWebhookToken
			const webhookClient = new Discord.WebhookClient({
				id: guildAddWebhookID,
				token: guildAddWebhookToken
			});
			webhookClient.send(
				`Ha habido un error en el evento voiceStateUpdate. Error: ${e}\n\n**------------------------------------**`
			);
		}
	}
};
