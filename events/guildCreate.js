const Discord = require("discord.js");
const fs = require('fs');
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.GuildCreate,
	execute(guild) {
		console.log(`${color.cyan}[GuildCreate]	${color.stop}${guild.name} ${color.blue}added ${guild.client.user.tag}.${color.stop}`);
	},
};