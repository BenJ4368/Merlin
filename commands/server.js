const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('server')	
		.setDescription('Rejoingez le Serveur Minecraft'),

	async execute(interaction)	// Simply sends back a message
	{
		console.log(`${clr.cya}[comd]	${clr.mag}/server ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		interaction.reply({ content: `Voici l'IP du serveur:	42mulhouse.uhcserv.eu`, ephemeral: true });
	}
}
