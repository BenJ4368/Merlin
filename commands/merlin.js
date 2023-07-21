const Discord = require('discord.js');
const clr = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('merlin')	
		.setDescription('I am Merlin.'),

	async execute(interaction)	// Simply sends back a message
	{
		console.log(`${clr.cya}[comd]	${clr.mag}/merlin ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);

		interaction.reply('I am Merlin.\nDevelopped by ./BenJ, and still in testing phase.\nYes, this command is useless.');
	}
}