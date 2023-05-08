const Discord = require("discord.js");
const fs = require('fs');
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.GuildCreate,
	execute(guild) {
		fs.readdirSync("./commands").filter(files =>
			files.endsWith(".js")).forEach(file => {
				const command = require(`../commands/${file}`);
				try {
					guild.commands.create(command.data);
					console.log(`${color.cyan}[guildCreate]${color.stop}	${color.yellow}Command ${command.data.name} registered for guild ${guild.name}${color.stop}`);
				} catch (error) {
					console.error(`${color.red}[guildCreate] Failed to register command ${command.data.name} for guild ${guild.name}.${color.stop}`);
					console.error(error);
				}
			});

		console.log(`${color.cyan}[GuildCreate]		${color.blue}${guild.name} added TestBot.${color.stop}`);
	},
};