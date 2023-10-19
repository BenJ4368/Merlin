const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('mcserv')
		.setDescription("ACCES RESTREINT - Sorcier uniquement"),

	async execute(interaction) {
		console.log(`${clr.cya}[Admin]	${clr.mag}/mcserv ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)

			const embed = new Discord.EmbedBuilder()	// Creates a new embed
			.setTitle(`**Oyé Oyé**`)
			.setDescription(`<@&1122612357722558617>\n
							On prépare la création d'un serveur 1.20.1 Vanilla.
							Pour l'occasion, on a développer un Datapack custom
							https://discord.com/channels/1117863871827431434/1163915014487425044/1164150713354567721`)
			.setColor(Discord.Colors.Green)
			.addFields(
				{name: '\u200B', value: " "},
				{name: 'Aucun téléchargement requis', value: "Pour vous c'est du full Vanilla."},
				{name: 'En fonction du nombre de joueurs', value: "On organiseras des evennements à prix."},
				{name: 'Lancement prévu courant de semaine prochaine', value: "Faites passez le mot?"},
			)

		 await interaction.reply({	// Reply to the interaction with the embed
		 	embeds: [embed],
		 });

		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort.", ephemeral: true });
			console.log(`${clr.cya}[Admin]	${clr.mag}/42survey ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}
