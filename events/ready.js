const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,
	execute(bot) {
		console.log(`${color.cyan}[Ready]		${color.blue}${bot.user.tag} ${color.green}online.${color.stop}`);

		bot.user.setPresence({
			status: 'online',
		})

		const guildsNbr = bot.guilds.cache.size;
		console.log(`${color.cyan}[Ready]		${color.blue}${bot.user.tag} ${color.stop}is present in ${color.green}${guildsNbr}.${color.stop}`);
	},
};