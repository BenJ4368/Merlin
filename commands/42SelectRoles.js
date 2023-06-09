const Discord = require('discord.js');
const color = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('42selectroles')
		.setDescription("RESTRICTED - Usable by Merlin's admins only."),

	async execute(interaction)
	{
		console.log(`${color.red}[admin]	${color.magenta}/42selectroles ${color.white}was fired by ${color.blue}${interaction.user.username}.${color.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {
			try {
				
				/* uncomment if the command should create a new embed message.
					if this block is uncommented, the next block has to be commented */

				// const embed = new Discord.EmbedBuilder()
				// 	.setTitle("Selections des rôles :")
				// 	.setDescription(`Sélectionne les jeux auxquels tu joues parmis les réactions de ce message.\n\
				// 					Les rôles correspondants te seront attribués.\n\n\
				// 					Si ce n'est pas le cas, signale-le moi:  <@${config.adminId}>`)
				// 	.setColor(Discord.Colors.White)
				
				// const message = await interaction.reply({
				// 	embeds: [embed],
				// 	fetchReply: true,
				// });

				/* uncomment and set the message id to a specific message to add reactions.
					you will also need to add the reaction's monitoring in events/42RolesReactAdd.js and events/42RolesReactRemove.js
					if this block is uncommented the previous block has to be commented. */
				
				const message = await interaction.channel.messages.fetch("1122621252151033890");
				await message.react("<:overwatch:1122112022386053231>");
				await message.react("<:vrising:1122111992048656416>");
				await message.react("<:minecraft:1122112010302279811>");
				await message.react("<:rocketleague:1122168421115764736>");
				await message.react("<:leagueoflegends:1123729807725821983>");
				await message.react("<:valorant:1123731014557118537>");
				await message.react("<:browsergames:1123995499423350814>");
				await message.react("<:riskofrain:1125527195364900892>");
				await message.react("<:civilisationvi:1126217059613806613>");
				await message.react("<:terraria:1126212041204572242>");
				await message.react("<:speedrunners:1128768967004131399>");
				interaction.reply({ content: "Done, you may dismiss this response.", ephemeral: true });


			} catch (error) {
				console.log(error);
				interaction.reply('An Error as occured. Try again later, or contact ./BenJ.');
			}
		}
		else
		{
			interaction.reply({ content: "Only Merlin's admins can use this command.", ephemeral: true });
			console.log(`${color.red}[admin]	${color.magenta}/42selectroles ${color.white}acces was denied to ${color.blue}${interaction.user.username}.${color.stop}`);
		}
	}
}
