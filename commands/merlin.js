const Discord = require('discord.js');
const color = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('merlin')	
		.setDescription('I am Merlin.'),

	async execute(interaction)	// Simply sends back a message
	{
		console.log(`${color.cyan}[command]	${color.magenta}/merlin ${color.white}was fired by ${color.blue}${interaction.user.username}.${color.stop}`);

		interaction.reply('I am Merlin.\nDevelopped by ./BenJ, and still in testing phase.\nYes, this command is useless.');
	}
}