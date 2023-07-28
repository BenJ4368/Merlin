const Discord = require('discord.js');
const clr = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('restart')	
		.setDescription('ACCES RESTREINT - Sorcier uniquement'),

	async execute(interaction)
	{
		console.log(`${clr.cya}[Admin]	${clr.mag}/restart ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)
			console.log(`${clr.cya}[Admin]	${clr.red}Restart procedure...`);
			interaction.reply({ content: "Procédure de redémarrage...", ephemeral: true });
			interaction.client.destroy();
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort. Tu sens la merde, pas la magie. Ne réessaie pas.", ephemeral: true });
			console.log(`${clr.cya}[Admin]	${clr.mag}/restart ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}