const Discord = require('discord.js');
const clr = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('merlin')
		.setDescription('Je suis Merlin.'),

	async execute(interaction)	// Simply sends back a message
	{
		console.log(`${clr.cya}[comd]	${clr.blu}/merlin ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);

		interaction.reply('Je suis Merlin.\nEn developpement par .BenJ\nOui, cette commande est absolument inutile.');
	}
}