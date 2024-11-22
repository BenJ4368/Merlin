const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.MessageReactionAdd,	// Triggers when any reaction is added
	async execute(reaction, user) {

		if (user.id === reaction.message.client.user.id)	// Checks if the reaction was added by the bot, if so, do nothing and return.
			return ;

		if (reaction.message.id === "1286674813724921969") {	// Checks if the reaction was added to the target's message reactions (cinemRoleMessage)

			const guild = reaction.message.guild;	// Store the discord server where the triggering happend (guild)
			const reactUser = guild.members.cache.get(user.id);	// Store the user who removed a reaction

			if (reaction.emoji.name === "popcorn") {	// Checks the reaction name
				const spectatorRoleId = "1286660985863536730"	// Id of the corresponding role
				const spectatorRole = guild.roles.cache.get(spectatorRoleId);	// Gets and stores the role
				if (reactUser && spectatorRole) {
					reactUser.roles.add(spectatorRole)	// Give the user the corresponding role. Console.log it, and log any errors. (User already possessing the role doesn't do anything)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username}${clr.whi} selected the rôle "Spectateur"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Spectateur* t'as été donné.");
				}
			}

			/* Same code for each reaction emoji and its corresponding role */
			if (reaction.emoji.name === "gaming") {
				const gamingRoleId = "1286662201838407700"
				const gamingRole = guild.roles.cache.get(gamingRoleId);
				if (reactUser && gamingRole) {
					reactUser.roles.add(gamingRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username}${clr.whi} selected the rôle "Gamer"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Gamer* t'as été donné.");
				}
			}

		}
	},
};