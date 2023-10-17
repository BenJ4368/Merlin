const Discord = require('discord.js');
const config = require("../config");
const clr = require("../resources/color_codes");
const fs = require('fs');

function sleep(seconds) {
	return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('hrbguide')	
		.setDescription('ACCES RESTREINT - Sorcier uniquement'),

	async execute(interaction)
	{
		console.log(`${clr.cya}[cmd]	${clr.mag}/hrbguide ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)

		const dir = './hrbguide';

		if (fs.existsSync(dir)) {
			const files = fs.readdirSync(dir);
			const imageFiles = files.filter(file => file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg"));
			await Promise.all(imageFiles.map(async (file) => {
				await sleep(2);
				interaction.channel.send({ files: [`${dir}/${file}`] });
			}));
			await interaction.reply({ content: "Done", ephemeral: true });
		} else {
			await interaction.reply("Le dossier spécifié n'existe pas.");
		}

			
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort.", ephemeral: true });
			console.log(`${clr.cya}[Admin]	${clr.mag}/restart ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}