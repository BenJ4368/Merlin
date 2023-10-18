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

			await interaction.channel.send({ files: [`./hrbguide/1.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/2.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/3.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/4.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/5.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/6.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/7.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/8.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/9.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/a.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/b.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/c.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/d.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/e.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/f.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/g.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/h.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/i.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/j.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/k.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/l.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/m.png`] });
			await sleep(1);
			await interaction.channel.send({ files: [`./hrbguide/n.png`] });
			
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort.", ephemeral: true });
			console.log(`${clr.cya}[Admin]	${clr.mag}/restart ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}