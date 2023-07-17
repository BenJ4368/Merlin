const Discord = require('discord.js');
const color = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('42survey')
		.setDescription("RESTRICTED - Wizards only."),

	async execute(interaction) {
		console.log(`${color.red}[admin]	${color.magenta}/42survey ${color.white}was fired by ${color.blue}${interaction.user.username}.${color.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)

			const embed = new Discord.EmbedBuilder()	// Creates a new embed
			.setTitle(`**Sondage Modpack :**`)
			.setDescription(`<@&1122612357722558617>
							On prépare la création d'un serveur Minecraft réservé au Studs.
							Voici donc un sondage qui détermineras **quel Modpack sera installé**.
							Vous pouvez voter pour plusieurs choix.`)
			.setColor(Discord.Colors.White)
			.addFields(
						{name: '\u200B', value: " "},
						{	
							name: `⬜  -  **Vanilla**  -  1.20`,
							value: `Minecraft pur, sans aucun Mod.`,},
						{name: '\u200B', value: " "},
						{
							name: `🟪  -  **SevTech: Ages**  -  1.12.2`,
							value: `Progression long terme, Exploration, Tech, Magie, Basé sur quêtes
									https://www.curseforge.com/minecraft/modpacks/sevtech-ages`},
						{name: '\u200B', value: " "},
						{
							name: `🟦  -  **RagnaMod VI**  -  1.16`,
							value: `Exploration, Tech, Magie, Basé sur quêtes
									https://www.curseforge.com/minecraft/modpacks/ragnamod-vi`},
						{name: '\u200B', value: " "},
						{
							name: `🟧  -  **All The Mods 9**  -  1.20`,
							value: `*(Très jeune, peut être instable)*
									Exploration, Tech, Magie
									https://www.curseforge.com/minecraft/modpacks/all-the-mods-9`},
						{name: '\u200B', value: " "},
						{
							name: `🟨  -  **All The Mods 8**  -  1.19.2`,
							value: `Exploration, Tech, Magie
									https://www.curseforge.com/minecraft/modpacks/all-the-mods-8`},
						{name: '\u200B', value: " "},
						{
							name: `🟥  -  **RLCraft** -  1.12.2`,
							value: `Hardcore, Exploration, Adventure/RPG
									https://www.curseforge.com/minecraft/modpacks/rlcraft`},
						{name: '\u200B', value: " "},
						{
							name: `🟫  -  **RA&D 2** -  1.16.5`,
							value: `Exploration, Adventure/RPG
									https://www.curseforge.com/minecraft/modpacks/roguelike-adventures-and-dungeons-2`},
						{name: '\u200B', value: " "},
						{
							name: `**Si vous souhaitez ajouter un choix**`,
							value: `contactez le <@&1117866235800064050> (Vendredi 21/07 max)`},
						{name: '\u200B', value: " "},
						{
							name: `**Fin du vote et résultats le Mercredi 26/07.**`,
							value: "Achat et setup du serveur sous peu ensuite."}
			)

			/*	Sends a new message, with the embed in it */
		// const message42Survey = await interaction.reply({	// Reply to the interaction with the embed
		// 	embeds: [embed],
		// 	fetchReply: true,	// Enables the message of the interacion to be stocked in a variable.
		// });

			/* Updates an existing message, with the embed*/
		const channel42Survey = await interaction.client.channels.fetch("1125529287483740260");	//Fetches the target message
		const message42Survey = await channel42Survey.messages.fetch("1130576414622613524");

		message42Survey.edit({ embeds: [embed] })  // Edits the embed
		interaction.reply({ content: "Done, you may dismiss this response.", ephemeral: true });	// Sends a ephemeral reply, to end the interaction (necessery)

			await message42Survey.react("⬜");	// React to the target message with an emoji
			await message42Survey.react("🟪");				// 'await' tells the code to wait until the reaction is done before doing another, so the order here matters.
			await message42Survey.react("🟦");			// without the awaits, the order of reactions on the message will be random.
			await message42Survey.react("🟧");
			await message42Survey.react("🟨");
			await message42Survey.react("🟥");
			await message42Survey.react("🟫");
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Only a Wizard can use this spell. You're full of shit, not Magic. Don't try again.", ephemeral: true });
			console.log(`${color.red}[admin]	${color.magenta}/42selectroles ${color.white}acces was denied to ${color.blue}${interaction.user.username}.${color.stop}`);
		}
	}
}
