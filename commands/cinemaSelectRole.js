const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('cinemarole')
		.setDescription("ACCES RESTREINT - Sorcier uniquement"),

	async execute(interaction)
	{
		console.log(`${clr.red}[Admin]	${clr.red}/42selectroles ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)

				/* uncomment if the command should create a new embed message.
					if this block is uncommented, the next block has to be commented */

				// const embed = new Discord.EmbedBuilder()	// Creates a new embed message
				// 	.setTitle("Selections des rôles :")
				// 	.setDescription(`Réagit à ce message pour obtenir les rôles correspondants.\n\
				// 					Un problème? Signale-le moi:  <@${config.adminIds[0]}>`)
				// 	.setColor(Discord.Colors.White)

				// const message = await interaction.reply({	// Reply to the interaction with the embed
				// 	embeds: [embed],
				// 	fetchReply: true,	// Enables the message of the interacion to be stocked in a variable.
				// });

				/* uncomment and set the message id to a specific message to add reactions.
					you will also need to add the reaction's monitoring in events/42RolesReactAdd.js and events/42RolesReactRemove.js
					if this block is uncommented the previous block has to be commented. */

				const message = await interaction.channel.messages.fetch("1286674813724921969");	// Fetches the target message with its Id (42RoleMessage)
				interaction.reply({ content: "Fait, vous pouvez disposer de ce message.", ephemeral: true });	// Sends a ephemeral reply, to end the interaction (necessary)
				await message.react("<:popcorn:1286670593831469076>");	// React to the target message with an emoji
				await message.react("<:gaming:1286672509525299262>");			// 'await' tells the code to wait until the reaction is done before doing another, so the order here matters.
																				// without the awaits, the order of reactions on the message will be random.

		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort.", ephemeral: true });
			console.log(`${clr.red}[Admin]	${clr.mag}/cinemaSelectRole ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}