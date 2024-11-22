const Discord = require('discord.js');
const fs = require('fs');
const config = require("../config");
const clr = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('reload')
		.setDescription('ACCES RESTREINT - Sorcier uniquement'),

	async execute(interaction)
	{
		console.log(`${clr.red}[Admin]	/reload ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)
			console.log(`${clr.red}[Admin]	Reloading commands...${clr.stop}`);

			try {
				const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					delete require.cache[require.resolve(`./${file}`)];
					const newCommand = require(`./${file}`);
					interaction.client.commands.set(newCommand.data.name, newCommand);
				}
				await interaction.reply({ content: "Rechargement des commandes." });
			}
			catch (error) {
				console.error(`${clr.red}[Admin] Error during command reload: ${clr.mag}/reload${clr.stop} \n${error}`);
				await interaction.reply({ content: "Erreur lors du rechargement des commandes." });
			}
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort." });
			console.log(`${clr.red}[Admin]	${clr.mag}/reload acces was denied to ${interaction.user.username}${clr.stop}`);
		}
	}
}