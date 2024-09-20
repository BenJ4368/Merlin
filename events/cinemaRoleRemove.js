const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.MessageReactionRemove,	// Triggers when any reaction is removed
	async execute(reaction, user) {

		if (user.id === reaction.message.client.user.id) // Checks if the reaction was removed by the bot, if so, do nothing and return.
			return ;

		if (reaction.message.id === "1286674813724921969") {	// Checks if the reaction was removed from the target's message reactions (42RoleMessage)

			const guild = reaction.message.guild;	// Store the discord server where the triggering happend (guild)
			const reactUser = guild.members.cache.get(user.id);	// Store the user who removed a reaction

			if (reaction.emoji.name === "popcorn") {	// Checks the reaction name
				const spectatorRoleId = "1286660985863536730"	// Id of the corresponding role
				const spectatorRole = guild.roles.cache.get(spectatorRoleId);	// Gets and stores the role
				if (reactUser && spectatorRole) {
					if (reactUser.roles.cache.has(spectatorRoleId)) { // Id the user has the corresponding role, take it away. Console.log it, and log any errors.
						reactUser.roles.remove(spectatorRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"Spectateur"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *Spectateur* t'as été retiré.");
					}
				}
			}

			/* Same code for each reaction emoji and its corresponding role */
			if (reaction.emoji.name === "gaming") {
				const gamingRoleId = "1286662201838407700"
				const gamingRole = guild.roles.cache.get(gamingRoleId);
				if (reactUser && gamingRole) {
					if (reactUser.roles.cache.has(gamingRoleId)) {
						reactUser.roles.remove(gamingRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"Gamer"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *Gamer* t'as été retiré.");
					}
				}
			}
		}
	},
};