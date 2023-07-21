const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('42selectroles')
		.setDescription("RESTRICTED - Wizards only."),

	async execute(interaction)
	{
		console.log(`${clr.cya}[Admin]	${clr.red}/42selectroles ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)
	
				/* uncomment if the command should create a new embed message.
					if this block is uncommented, the next block has to be commented */

				// const embed = new Discord.EmbedBuilder()	// Creates a new embed message
				// 	.setTitle("Selections des rôles :")
				// 	.setDescription(`Sélectionne les jeux auxquels tu joues parmis les réactions de ce message.\n\
				// 					Les rôles correspondants te seront attribués.\n\n\
				// 					Si ce n'est pas le cas, signale-le moi:  <@${config.adminIds[0])}>`)
				// 	.setColor(Discord.Colors.White)
				
				// const message = await interaction.reply({	// Reply to the interaction with the embed
				// 	embeds: [embed],
				// 	fetchReply: true,	// Enables the message of the interacion to be stocked in a variable.
				// });

				/* uncomment and set the message id to a specific message to add reactions.
					you will also need to add the reaction's monitoring in events/42RolesReactAdd.js and events/42RolesReactRemove.js
					if this block is uncommented the previous block has to be commented. */
				
				const message = await interaction.channel.messages.fetch("1122621252151033890");	// Fetches the target message with its Id (42RoleMessage)
				interaction.reply({ content: "Done, you may dismiss this response.", ephemeral: true });	// Sends a ephemeral reply, to end the interaction (necessery)
				await message.react("<:overwatch:1122112022386053231>");	// React to the target message with an emoji
				await message.react("<:vrising:1122111992048656416>");				// 'await' tells the code to wait until the reaction is done before doing another, so the order here matters.
				await message.react("<:minecraft:1122112010302279811>");			// without the awaits, the order of reactions on the message will be random.
				await message.react("<:rocketleague:1122168421115764736>");
				await message.react("<:leagueoflegends:1123729807725821983>");
				await message.react("<:valorant:1123731014557118537>");
				await message.react("<:browsergames:1123995499423350814>");
				await message.react("<:riskofrain:1125527195364900892>");
				await message.react("<:civilisationvi:1126217059613806613>");
				await message.react("<:terraria:1126212041204572242>");
				await message.react("<:speedrunners:1128768967004131399>");
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Only a Wizard can use this spell. You're full of shit, not Magic. Don't try again.", ephemeral: true });
			console.log(`${clr.cya}[Admin]	${clr.mag}/42selectroles ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}