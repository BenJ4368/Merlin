const Discord = require('discord.js');
const config = require("../config");
const clr = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('restart')
		.setDescription('ACCES RESTREINT - Sorcier uniquement'),

	async execute(interaction)
	{
		console.log(`${clr.red}[Admin]	/restart ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)
			console.log(`${clr.red}[Admin]	Restart procedure...`);
			await interaction.reply({ content: "Procédure de redémarrage..." });
			interaction.client.destroy();
			process.exit(0);
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort." });
			console.log(`${clr.red}[Admin]	${clr.mag}/restart acces was denied to ${interaction.user.username}${clr.stop}`);
		}
	}
}