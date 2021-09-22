require("dotenv").config();
const Discord = require("discord.js");
const Command = require("../../structures/Commandos.js");

// const {
// 	MessageButton,
// 	MessageActionRow
// } = require("discord-buttons");

const fs = require("fs");
require("discord-reply");
let descripcion, usage;
let encendido = false;
module.exports = class queue extends Command {
	constructor(client) {
		super(client, {
			name: "queue",
			description: [
				"Displays the current queue.",
				"Muestra la cola de reproducción actual.",
			],
			category: "musica",
			botpermissions: ["ADD_REACTIONS"],
			alias: ["q", "cola"],
			args: false,
		});
	}
	async run(client, message, args, prefix, lang, webhookClient, ipc) {
		try {
			const player = client.manager.players.get(message.guild.id);
			if (!player) {
				const errorembed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle(client.language.ERROREMBED)
				.setDescription(
				  client.language.SKIP[1]
				)
				.setFooter(message.author.username, message.author.avatarURL());
			  return message.channel.send({ embeds: [errorembed] })
			}
			if (!player.queue.current) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						client.language.QUEUE[2]
					)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({embeds: [errorembed]})
			}

			const {
				title,
				requester,
				uri
			} = player.queue.current;

			const {
				queue
			} = player;


			if (!player.queue[1]) {
				return message.channel.send({
					embeds: [
						new Discord.MessageEmbed()
						.setTitle(client.language.QUEUE[9])
						.setDescription(`🎧 ${client.language.QUEUE[3]}\n[${title}](${uri}) [<@${requester.id}>]`)
						.setAuthor(`${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]}`, "https://i.imgur.com/CCqeomm.gif")
						.setColor(process.env.EMBED_COLOR)
					]
				});
			}

			let x;
			if (args > 1) {
				x = Math.floor(args) * 10 + 1;
			} else {
				x = Math.floor(11);
			}
			let i;
			if (args > 1) {
				i = x - 11;
			} else {
				i = 0;
			}
			let queuelist = player.queue
				.slice(x - 10, x)
				.map(
					() =>
					`**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
                    queue[i].requester.id
                  }>]`
				)
				.join("\n");
			if (!queuelist) {
				const errorembed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle(client.language.ERROREMBED)
					.setDescription(
						client.language.QUEUE[4]
					)
					.setFooter(message.author.username, message.author.avatarURL());
				return message.channel.send({embeds: [errorembed]})
			}
			const embed = new Discord.MessageEmbed();
			embed.setDescription(
				`🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
			);
			embed.setThumbnail(client.user.displayAvatarURL());
			embed.setAuthor(
				`${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${Math.floor(x / 10)} / ${Math.floor(
                (player.queue.slice(1).length + 10) / 10
              )})`,
				"https://i.imgur.com/CCqeomm.gif"
			);
			embed.setFooter(`${client.language.QUEUE[5]} ${player.queue.length}`);
			embed.setColor(process.env.EMBED_COLOR);
			message.channel.send({embeds: [embed]}).then(async (msg) => {
				if (Math.floor((player.queue.slice(1).length + 10) / 10) > 1) {
					await msg.react("⏪");
					await msg.react("◀");
					await msg.react("🟣");
					await msg.react("▶");
					await msg.react("⏩");
					const pages = Math.floor((player.queue.slice(1).length + 10) / 10);
					let page = Math.floor(x / 10);
					const back = msg.createReactionCollector(
						(reaction, user) =>
						reaction.emoji.name === "◀" && user.id === message.author.id, {
							time: 60000
						}
					);
					const doubleback = msg.createReactionCollector(
						(reaction, user) =>
						reaction.emoji.name === "⏪" && user.id === message.author.id, {
							time: 60000
						}
					);
					const doubleforwad = msg.createReactionCollector(
						(reaction, user) =>
						reaction.emoji.name === "⏩" && user.id === message.author.id, {
							time: 60000
						}
					);
					const forwad = msg.createReactionCollector(
						(reaction, user) =>
						reaction.emoji.name === "▶" && user.id === message.author.id, {
							time: 60000
						}
					);
					const middle = msg.createReactionCollector(
						(reaction, user) =>
						reaction.emoji.name === "🟣" && user.id === message.author.id, {
							time: 60000
						}
					);
					setTimeout(() => msg.delete(), 5000);
					back.on("collect", async (r) => {
						if (page === 1) return r.users.remove(message.author);
						await r.users.remove(message.author);
						await page--;
						x = Math.floor(page) * 10 + 1;
						i = x - 11;
						queuelist = player.queue
							.slice(x - 10, x)
							.map(
								() =>
								`**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
                          queue[i].requester.id
                        }>]`
							)
							.join("\n");
						embed.setColor(process.env.EMBED_COLOR);
						embed.setTitle(client.language.QUEUE[1]);
						embed.setDescription(
							`🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
						);
						embed.setAuthor(
							`${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
							"https://i.imgur.com/CCqeomm.gif"
						);
						msg.edit(embed);
					});
					forwad.on("collect", async (r) => {
						if (page === pages) return r.users.remove(message.author);
						await r.users.remove(message.author);
						await page++;
						x = Math.floor(page) * 10 + 1;
						i = x - 11;
						queuelist = player.queue
							.slice(x - 10, x)
							.map(
								() =>
								`**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
                          queue[i].requester.id
                        }>]`
							)
							.join("\n");
						embed.setColor(process.env.EMBED_COLOR);
						embed.setTitle(client.language.QUEUE[1]);
						embed.setDescription(
							`🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
						);
						embed.setAuthor(
							`${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
							"https://i.imgur.com/CCqeomm.gif"
						);
						msg.edit(embed);
					});
					doubleback.on("collect", async (r) => {
						if (page === 1) return r.users.remove(message.author);
						await r.users.remove(message.author);
						page = 1;
						x = Math.floor(page) * 10 + 1;
						i = x - 11;
						queuelist = player.queue
							.slice(x - 10, x)
							.map(
								() =>
								`**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
                          queue[i].requester.id
                        }>]`
							)
							.join("\n");
						embed.setColor(process.env.EMBED_COLOR);
						embed.setTitle(client.language.QUEUE[1]);
						embed.setDescription(
							`🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
						);
						embed.setAuthor(
							`${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
							"https://i.imgur.com/CCqeomm.gif"
						);
						msg.edit(embed);
					});
					doubleforwad.on("collect", async (r) => {
						if (page === pages) return r.users.remove(message.author);
						await r.users.remove(message.author);
						page = pages;
						x = Math.floor(page) * 10 + 1;
						i = x - 11;
						queuelist = player.queue
							.slice(x - 10, x)
							.map(
								() =>
								`**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
                          queue[i].requester.id
                        }>]`
							)
							.join("\n");
						embed.setColor(process.env.EMBED_COLOR);
						embed.setTitle(client.language.QUEUE[1]);
						embed.setDescription(
							`🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
						);
						embed.setAuthor(
							`${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
							"https://i.imgur.com/CCqeomm.gif"
						);
						msg.edit(embed);
					});
					middle.on("collect", async (r) => r.users.remove(message.author));
				}
			});
			/*
			let mod = new MessageButton()
			  .setStyle("blurple") //default: blurple
			  .setLabel(` ${client.language.COMMANDS[1]}`) //default: NO_LABEL_PROVIDED
			  .setEmoji("🔒")
			  .setID("b1");
			let games = new MessageButton()
			  .setStyle("blurple") //default: blurple
			  .setLabel(` ${client.language.COMMANDS[2]}`) //default: NO_LABEL_PROVIDED
			  .setEmoji("🎮")
			  .setID("b2");
			let music = new MessageButton()
			  .setStyle("blurple") //default: blurple
			  .setLabel(` ${client.language.COMMANDS[3]}`) //default: NO_LABEL_PROVIDED
			  .setEmoji("🎶")
			  .setID("b3");
			let utility = new MessageButton()
			  .setStyle("blurple") //default: blurple
			  .setLabel(` ${client.language.COMMANDS[4]}`) //default: NO_LABEL_PROVIDED
			  .setEmoji("🌐")
			  .setID("b4");
			let info = new MessageButton()
			  .setStyle("blurple") //default: blurple
			  .setLabel(` ${client.language.COMMANDS[5]}`) //default: NO_LABEL_PROVIDED
			  .setEmoji("🛠️")
			  .setID("b5");

			let ButtonArray2 = [mod, games, music, utility, info];

			const player = client.manager.players.get(message.guild.id);
			if (!player) {
			  return message.channel
			    .send({
			      embed: {
			        title: "Error",
			        description: client.language.QUEUE[1],
			      },
			      color: -23296,
			    })
			    .catch((err) => console.error(err.message));
			}
			if (!player.queue.current) {
			  const errorembed = new Discord.MessageEmbed()
			    .setColor("RED")
			    .setTitle(client.language.ERROREMBED)
			    .setDescription(client.language.QUEUE[2])
			    .setFooter(message.author.username, message.author.avatarURL());
			  return message.channel.send({embeds: [errorembed]});
			}

			const { title, requester, uri } = player.queue.current;

			const { queue } = player;

			if (!player.queue[1]) {
			  return message.channel.send("", {
			    embed: {
			      title: client.language.QUEUE[9],
			      description: `🎧 ${client.language.QUEUE[3]}\n[${title}](${uri}) [<@${requester.id}>]`,
			      author: {
			        name: `${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]}`,
			        icon_url: "https://i.imgur.com/CCqeomm.gif",
			      },
			      color: process.env.EMBED_COLOR,
			    },
			  });
			}

			let x;
			if (args > 1) {
			  x = Math.floor(args) * 10 + 1;
			} else {
			  x = Math.floor(11);
			}
			let i;
			if (args > 1) {
			  i = x - 11;
			} else {
			  i = 0;
			}
			let queuelist = player.queue
			  .slice(x - 10, x)
			  .map(
			    () =>
			      `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
			        queue[i].requester.id
			      }>]`
			  )
			  .join("\n");
			if (!queuelist) {
			  const errorembed = new Discord.MessageEmbed()
			    .setColor("RED")
			    .setTitle(client.language.ERROREMBED)
			    .setDescription(client.language.QUEUE[4])
			    .setFooter(message.author.username, message.author.avatarURL());
			  return message.channel.send({embeds: [errorembed]});
			}
			const embed = new MessageEmbed();
			embed.setDescription(
			  `🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
			);
			embed.setThumbnail(client.user.displayAvatarURL());
			embed.setAuthor(
			  `${client.language.QUEUE[6]} ${message.guild.name} ${
			    client.language.QUEUE[7]
			  } (${Math.floor(x / 10)} / ${Math.floor(
			    (player.queue.slice(1).length + 10) / 10
			  )})`,
			  "https://i.imgur.com/CCqeomm.gif"
			);
			embed.setFooter(`${client.language.QUEUE[5]} ${player.queue.length}`);
			embed.setColor(process.env.EMBED_COLOR);

			message.channel.send({
			  embed: embed,
			  buttons: ButtonArray2,
			});

			if (encendido == false) {
			  client.on("clickButton", async (button, err) => {
			    if (err) return;
			    try {
			      let lang = await client.users.cache.get(menu.member.id).LANG;
			      if (button.id === "b1") {
			        let test = "";
			        client.commands.forEach((cmd) => {
			          descripcion =
			            lang == "en_US" ? cmd.description[0] : cmd.description[1];
			          if (cmd.usage) {
			            usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			          } else {
			            usage = "";
			          }
			          if (cmd.category === "Moderacion") {
			            if (
			              usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role != "dev"
			            ) {
			              test += ` **${message.guild.prefix}${cmd.name} ** -${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			            } else if (
			              !usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role != "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			            }
			          }
			        });
			        const embed = new Discord.MessageEmbed().setDescription(test);
			        await button.reply.send({
			          embed: embed,
			          ephemeral: true,
			        });
			      } else if (button.id === "b2") {
			        let test = "";
			        client.commands.forEach((cmd) => {
			          if (cmd.usage) {
			            usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			          } else {
			            usage = "";
			          }
			          descripcion =
			            lang == "en_US" ? cmd.description[0] : cmd.description[1];
			          if (cmd.category === "Juego") {
			            if (
			              usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			            } else if (
			              !usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			            }
			          }
			        });
			        const embed = new Discord.MessageEmbed().setDescription(test);
			        await button.reply.send({
			          embed: embed,
			          ephemeral: true,
			        });
			      } else if (button.id === "b3") {
			        let test = "";

			        client.commands.forEach((cmd) => {
			          if (cmd.usage) {
			            usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			          } else {
			            usage = "";
			          }
			          descripcion =
			            lang == "en_US" ? cmd.description[0] : cmd.description[1];
			          if (cmd.category === "Musica") {
			            if (
			              usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			            } else if (
			              !usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			            }
			          }
			        });
			        const embed = new Discord.MessageEmbed().setDescription(test);
			        await button.reply.send("", {
			          embed: embed,
			          ephemeral: true,
			        });
			      } else if (button.id === "b4") {
			        let test = "";
			        client.commands.forEach((cmd) => {
			          if (cmd.usage) {
			            usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			          } else {
			            usage = "";
			          }
			          descripcion =
			            lang == "en_US" ? cmd.description[0] : cmd.description[1];
			          if (cmd.category === "Utils") {
			            if (
			              usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			            } else if (
			              !usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			            }
			          }
			        });
			        const embed = new Discord.MessageEmbed().setDescription(test);
			        await button.reply.send("", {
			          embed: embed,
			          ephemeral: true,
			        });
			      } else if (button.id === "b5") {
			        let test = "";
			        client.commands.forEach((cmd) => {
			          if (cmd.usage) {
			            if (cmd.usage) {
			              usage = lang == "en_US" ? cmd.usage[0] : cmd.usage[1];
			            }
			          } else {
			            usage = "";
			          }
			          descripcion =
			            lang == "en_US" ? cmd.description[0] : cmd.description[1];
			          if (cmd.category === "Info") {
			            if (
			              usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name} ${usage}\` \n `;
			            } else if (
			              !usage &&
			              !cmd.inactive &&
			              !cmd.production &&
			              cmd.role !== "dev"
			            ) {
			              test += `**${message.guild.prefix}${cmd.name}** - ${descripcion} | \`${message.guild.prefix}${cmd.name}\` \n `;
			            }
			          }
			        });
			        const embed = new Discord.MessageEmbed().setDescription(test);
			        await button.reply.send("", {
			          embed: embed,
			          ephemeral: true,
			        });
			      }
			    } catch (e) {
			      console.error(e);
			    }
			  });
			  encendido = true;
			} else return;

			/*
			      message.channel.send({embeds: [embed]}).then(async(msg) => {
			      if (Math.floor((player.queue.slice(1).length + 10) / 10) > 1) {
			          await msg.react("⏪");
			          await msg.react("◀");
			          await msg.react("🟣");
			          await msg.react("▶");
			          await msg.react("⏩");
			          const pages = Math.floor((player.queue.slice(1).length + 10) / 10);
			          let page = Math.floor(x / 10);
			          const back = msg.createReactionCollector(
			              (reaction, user) =>
			              reaction.emoji.name === "◀" && user.id === message.author.id, { time: 60000 }
			          );
			          const doubleback = msg.createReactionCollector(
			              (reaction, user) =>
			              reaction.emoji.name === "⏪" && user.id === message.author.id, { time: 60000 }
			          );
			          const doubleforwad = msg.createReactionCollector(
			              (reaction, user) =>
			              reaction.emoji.name === "⏩" && user.id === message.author.id, { time: 60000 }
			          );
			          const forwad = msg.createReactionCollector(
			              (reaction, user) =>
			              reaction.emoji.name === "▶" && user.id === message.author.id, { time: 60000 }
			          );
			          const middle = msg.createReactionCollector(
			              (reaction, user) =>
			              reaction.emoji.name === "🟣" && user.id === message.author.id, { time: 60000 }
			          );
			          msg.delete({ timeout: 60000 });
			          back.on("collect", async(r) => {
			              if (page === 1) return r.users.remove(message.author);
			              await r.users.remove(message.author);
			              await page--;
			              x = Math.floor(page) * 10 + 1;
			              i = x - 11;
			              queuelist = player.queue
			                  .slice(x - 10, x)
			                  .map(
			                      () =>
			                      `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
			                  queue[i].requester.id
			              }>]`
			                  )
			                  .join("\n");
			              embed.setColor(process.env.EMBED_COLOR);
			              embed.setTitle(client.language.QUEUE[1]);
			              embed.setDescription(
			                  `🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
			              );
			              embed.setAuthor(
			                  `${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
			                  "https://i.imgur.com/CCqeomm.gif"
			              );
			              msg.edit(embed);
			          });
			          forwad.on("collect", async(r) => {
			              if (page === pages) return r.users.remove(message.author);
			              await r.users.remove(message.author);
			              await page++;
			              x = Math.floor(page) * 10 + 1;
			              i = x - 11;
			              queuelist = player.queue
			                  .slice(x - 10, x)
			                  .map(
			                      () =>
			                      `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
			                  queue[i].requester.id
			              }>]`
			                  )
			                  .join("\n");
			              embed.setColor(process.env.EMBED_COLOR);
			              embed.setTitle(client.language.QUEUE[1]);
			              embed.setDescription(
			                  `🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
			              );
			              embed.setAuthor(
			                  `${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
			                  "https://i.imgur.com/CCqeomm.gif"
			              );
			              msg.edit(embed);
			          });
			          doubleback.on("collect", async(r) => {
			              if (page === 1) return r.users.remove(message.author);
			              await r.users.remove(message.author);
			              page = 1;
			              x = Math.floor(page) * 10 + 1;
			              i = x - 11;
			              queuelist = player.queue
			                  .slice(x - 10, x)
			                  .map(
			                      () =>
			                      `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
			                  queue[i].requester.id
			              }>]`
			                  )
			                  .join("\n");
			              embed.setColor(process.env.EMBED_COLOR);
			              embed.setTitle(client.language.QUEUE[1]);
			              embed.setDescription(
			                  `🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
			              );
			              embed.setAuthor(
			                  `${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
			                  "https://i.imgur.com/CCqeomm.gif"
			              );
			              msg.edit(embed);
			          });
			          doubleforwad.on("collect", async(r) => {
			              if (page === pages) return r.users.remove(message.author);
			              await r.users.remove(message.author);
			              page = pages;
			              x = Math.floor(page) * 10 + 1;
			              i = x - 11;
			              queuelist = player.queue
			                  .slice(x - 10, x)
			                  .map(
			                      () =>
			                      `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${
			                  queue[i].requester.id
			              }>]`
			                  )
			                  .join("\n");
			              embed.setColor(process.env.EMBED_COLOR);
			              embed.setTitle(client.language.QUEUE[1]);
			              embed.setDescription(
			                  `🎧 ${client.language.QUEUE[3]}\n [${title}](${uri}) [<@${requester.id}>]\n__${client.language.QUEUE[8]}__:\n${queuelist}`
			              );
			              embed.setAuthor(
			                  `${client.language.QUEUE[6]} ${message.guild.name} ${client.language.QUEUE[7]} (${page} / ${pages})`,
			                  "https://i.imgur.com/CCqeomm.gif"
			              );
			              msg.edit(embed);
			          });
			          middle.on("collect", async(r) => r.users.remove(message.author));
			      }
			  });
			  */
		} catch (e) {
			console.error(e);
			message.channel.send({ embeds: [
				new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle(client.language.ERROREMBED)
				.setDescription(client.language.fatal_error)
				.setFooter(message.author.username, message.author.avatarURL())
			]});
			webhookClient.send(
				`Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
			);
			try {
				message.author
					.send(
						"Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
					)
					.catch(e);
			} catch (e) {}
		}
	}
};