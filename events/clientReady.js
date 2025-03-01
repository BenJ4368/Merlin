const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.ClientReady,	// Triggers when the bot is connected
	once: true,	// Triggers only once.
	async execute(bot) {

		bot.user.setPresence({	// Sets status to 'online' (could be 'afk' or 'dnd')
			status: 'online',
		})
		bot.user.setActivity({	// Sets the activity
			name: "Wanna play?",	// Name of the game/stream/music etc
			type: Discord.ActivityType.Playing,	// Type of activity (streaming, playing, listening to, competing etc)
			//url: ""	// 'url' property only works with streaming type
		})

		const guildsNbr = bot.guilds.cache.size;  // Stores the numbers of server the bot is in
		console.log(`${clr.cya}[Ready]	${clr.red}${bot.user.username}${clr.grn} is ONLINE. Present in ${guildsNbr} servers${clr.stop}`);

		/* fetching the cinemaRole message's cache for the listeners (cinemaRoleAdd and cinemaRoleReactRemove) */
		const cinemaRoleChannel = await bot.channels.fetch("1286659163467944017");
		const cinemaRoleMessage = await cinemaRoleChannel.messages.fetch("1286674813724921969");

	},
};