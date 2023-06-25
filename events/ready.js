const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,
	async execute(bot) {
		console.log(`${color.cyan}[Ready]		${color.blue}${bot.user.tag} ${color.green}online${color.stop}.`);

		bot.user.setPresence({
			status: 'online',
		})

		const guildsNbr = bot.guilds.cache.size;
		console.log(`${color.cyan}[Ready]		${color.blue}${bot.user.tag} ${color.stop}is present in ${color.green}${guildsNbr} servers${color.stop}.`);
	
		/* fetching the message's cache for the listeners (42RolesReactAdd and 42RolesReactRemove) */
		const channel42Role = await bot.channels.fetch("1121929529003364452");
		const message42Role = await channel42Role.messages.fetch("1122621252151033890");
	},
};