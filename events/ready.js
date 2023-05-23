const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,
	execute(bot) {
		console.log(`${color.cyan}[Ready]		${color.blue}${bot.user.tag} ${color.green}online.${color.stop}`);

		bot.application.commands.set([]);
		bot.application.adminCommands.set([]);
		console.log(`${color.cyan}[Ready]		${color.red}Emptyed commands and adminCommands tables.${color.stop}`);
		bot.user.setPresence({
			status: 'online',
		})
	},
};