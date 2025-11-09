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
	},
};