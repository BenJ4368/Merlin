const Discord = require('discord.js');
const color = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('merlin')
		.setDescription('I am Merlin.'),

	async execute(interaction)
	{
		console.log(`${color.cyan}[command]	${color.magenta}/merlin ${color.white}was fired by ${color.blue}${interaction.user.tag}.${color.stop}`);
		try {
			interaction.reply('I am Merlin.\nDevelopped by ./BenJ, and still in testing phase.\nYes, this command is useless.');
		} catch (error) {
			console.log(error);
			interaction.reply('An Error as occured. Try again later, or contact ./BenJ.');
		}
	}
}