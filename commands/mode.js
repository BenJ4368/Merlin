const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const varModes = require('../varModes.js'); // Assuming varModes.js is in the same directory

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('mode')
		.setDescription('Party ou Fest?')
		.addStringOption(option =>
			option.setName('choix')
				.setDescription('Choisissez le mode')
				.setRequired(true)
				.addChoices(
					{ name: 'Party', value: 'party' },
					{ name: 'Fest', value: 'fest' },
					{ name: 'Normal', value: 'normal' }
				)),

	async execute(interaction)	// Simply sends back a message
	{
		console.log(`${clr.cya}[comd]	${clr.blu}/mode ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		const choix = interaction.options.getString('choix');

		if (choix === 'party') {
			varModes.setPartyMode(true);
			varModes.setFestMode(false);
			interaction.reply({ content: 'Mode **Party** activé!', ephemeral: true });
		}
		else if (choix === 'fest') {
			varModes.setPartyMode(false);
			varModes.setFestMode(true);
			interaction.reply({ content: 'Mode **Fest** activé!', ephemeral: true });
		}
		else if (choix === 'normal') {
			varModes.setPartyMode(false);
			varModes.setFestMode(false);
			interaction.reply({ content: 'Mode **Normal** activé!', ephemeral: true });
		}
		else {
			return interaction.reply({ content: 'Choix invalide. Veuillez choisir entre Party, Fest ou Normal.', ephemeral: true });
		}
	}
}