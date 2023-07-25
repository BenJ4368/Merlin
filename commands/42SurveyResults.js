const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('42surveyresults')
		.setDescription("RESTRICTED - Wizards only."),

	async execute(interaction) {
		console.log(`${clr.cya}[Admin]	${clr.mag}/42surveyresults ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)

			const embed = new Discord.EmbedBuilder()	// Creates a new embed
			.setTitle(`**Fin du sondage:**`)
			.setDescription(`<@&1122612357722558617>
							Voici le modpack séléctionné :`)
			.setColor(Discord.Colors.White)
			.addFields(
						{name: '\u200B', value: " "},
						{
							name: `🟦  -  **RagnaMod VI**  -  1.16`,
							value: `Exploration, Tech, Magie, Basé sur quêtes
									https://www.curseforge.com/minecraft/modpacks/ragnamod-vi`},
						{name: '\u200B', value: " "},
						{
							name: `**Pour jouer sur le serveur :**`,
							value: `Entrez la commande /server (de <@${config.clientId}>), en lui donnant votre 42login.
									lancez ensuite Ragnamod VI, et rejoignez.`},
			)

			const message42Survey = await interaction.reply({	// Reply to the interaction with the embed
				embeds: [embed],
				fetchReply: true,	// Enables the message of the interacion to be stocked in a variable.
			});

		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Seul un Sorcier peut lancer ce sort. Tu sens la merde, pas la magie. Ne réessaie pas.", ephemeral: true });
			console.log(`${clr.cya}[Admin]	${clr.mag}/42survey ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
}
