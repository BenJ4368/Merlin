const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.ClientReady,	// Triggers when the bot is connected
	once: true,	// Triggers only once.
	async execute(bot) {

		bot.user.setPresence({	// Sets status to 'online' (could be 'afk' or 'dnd')
			status: 'online',
		})
		bot.user.setActivity({	// Sets the activity
			name: "Coding lessons",	// Name of the game/stream/music etc
			type: Discord.ActivityType.Streaming,	// Type of activity (streaming, playing, listening to, competing etc)
			url: "https://url-x.it/yS277Vt"	// 'url' property only works with streaming type
		})

		const guildsNbr = bot.guilds.cache.size;  // Stores the numbers of server the bot is in
		console.log(`${color.cyan}[Ready]		${color.blue}${bot.user.username} ${color.stop}is present in ${color.green}${guildsNbr} servers${color.stop}.`);
	
		console.log(`${color.cyan}[Ready]		${color.blue}${bot.user.username} ${color.green}online${color.stop}.`);

		/* fetching the 42Role message's cache for the listeners (42RolesReactAdd and 42RolesReactRemove) */
		const channel42Role = await bot.channels.fetch("1121929529003364452");
		const message42Role = await channel42Role.messages.fetch("1122621252151033890");
	},
};