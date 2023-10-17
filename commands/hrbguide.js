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

			await interaction.channel.send({ files: [`./hrbguide/1`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/2`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/3`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/4`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/5`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/6`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/7`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/8`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/9`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/a`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/b`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/c`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/d`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/e`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/f`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/g`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/h`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/i`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/j`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/k`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/l`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/m`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/n`] });
			await sleep(1);
			interaction.channel.send({ files: [`./hrbguide/o`] });
			
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort.", ephemeral: true });
			console.log(`${clr.cya}[Admin]	${clr.mag}/restart ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}