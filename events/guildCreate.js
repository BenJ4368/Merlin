const Discord = require("discord.js");
const fs = require('fs');
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.GuildCreate,	// Triggers when the bot is added to a discord server
	execute(guild) {

		console.log(`${color.cyan}[GuildCreate]	${color.stop}${guild.name} ${color.blue}added ${guild.client.user.username}.${color.stop}`);
	},
};