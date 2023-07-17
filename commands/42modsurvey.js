const Discord = require('discord.js');
const color = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('42modsurvey')
		.setDescription("RESTRICTED - Wizards only."),

	async execute(interaction) {
		console.log(`${color.red}[admin]	${color.magenta}/42survey ${color.white}was fired by ${color.blue}${interaction.user.username}.${color.stop}`);
		if (config.adminIds.includes(interaction.user.id)) {	// Checks if the user triggering the command is one of the admins (admin Ids are stored in the config.js file, in an array)

			const embed = new Discord.EmbedBuilder()	// Creates a new embed message
			.setTitle(`<@${1122612357722558617}> | Sondage Modpack :`)
			.setDescription(`La Com. Jeux-Vidéos prépare la création d'un serveur Minecraft réservé au Studs.\n
							Voici donc un sondage qui détermineras **quel Modpack sera installé**.\n
							Vous pouvez voter pour plusieurs choix.`)
			.setColor(Discord.Colors.White)
			.addFields({
							"name": `⬜  -  Vanilla  -  1.20`,
							"value": `     Minecraft pur, sans aucun Mod.`,
						},
						{
							"name": `🟪  -  SevTech: Ages  -  1.12.2`,
							"value": `     Progression long terme, Exploration, Tech, Magie, Basé sur quêtes\n     https://www.curseforge.com/minecraft/modpacks/sevtech-ages`
						},
						{
							"name": `🟦  -  RagnaMod VI  -  1.16`,
							"value": `     Exploration, Tech, Magie, Basé sur quêtes\n     https://www.curseforge.com/minecraft/modpacks/ragnamod-vi`
						},
						{
							"name": `🟧  -  All The Mods 9  -  1.20`,
							"value": `     (Très jeune, peut être instable)\n     Exploration, Tech, Magie\n     https://www.curseforge.com/minecraft/modpacks/all-the-mods-9`
						},
						{
							"name": `🟨  -  All The Mods 8  -  1.19.2`,
							"value": `     Exploration, Tech, Magie\n     https://www.curseforge.com/minecraft/modpacks/all-the-mods-8`
						},
						{
							"name": `🟥  -  RLCraft -  1.12.2`,
							"value": `     Hardcore, Exploration, Adventure/RPG\n     https://www.curseforge.com/minecraft/modpacks/rlcraft`
						})
			.setFooter({ "text": `\n\nSi vous souhaitez ajouter un choix, contactez le <@${1117866235800064050}> (Vendredi 21/07 max)\n
							Fin du vote et résultats le Mercredi 26/07.`
			})
		
		const message = await interaction.reply({	// Reply to the interaction with the embed
			embeds: [embed],
			fetchReply: true,	// Enables the message of the interacion to be stocked in a variable.
		});

			await message.react("⬜");	// React to the target message with an emoji
			await message.react("🟪");				// 'await' tells the code to wait until the reaction is done before doing another, so the order here matters.
			await message.react("🟦");			// without the awaits, the order of reactions on the message will be random.
			await message.react("🟧");
			await message.react("🟨");
			await message.react("🟥");
		}
		else	// If the user triggering the command is not an admin, sends an ephemeral message to explain it to him, and console log the denied acces.
		{
			interaction.reply({ content: "Only a Wizard can use this spell. You're full of shit, not Magic. Don't try again.", ephemeral: true });
			console.log(`${color.red}[admin]	${color.magenta}/42selectroles ${color.white}acces was denied to ${color.blue}${interaction.user.username}.${color.stop}`);
		}
	}
}
