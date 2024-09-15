const Discord = require('discord.js');
const fs = require('fs');
const config = require("../config");
const clr = require("../resources/color_codes");
const r = require("../resources/lgow/lgowData")

module.exports = {

	data: new Discord.SlashCommandBuilder()
		.setName('lgow')
		.setDescription('Lance une partie de Loup-Garouverwatch. 5 Joueurs requis.')
		.addUserOption(option =>
			option.setName('joueur1')
				.setDescription('Indiquez les joueurs, vous comrpis. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur2')
				.setDescription('Indiquez les joueurs, vous comrpis. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur3')
				.setDescription('Indiquez les joueurs, vous comrpis. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur4')
				.setDescription('Indiquez les joueurs, vous comrpis. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur5')
				.setDescription('Indiquez les joueurs, vous comrpis. Pas de doublons.')
				.setRequired(true)),

	async execute(interaction) {
		console.log(`${clr.cya}[cmd]	${clr.mag}/lgow ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);

		const p1 = interaction.options.getUser('joueur1');
		const p2 = interaction.options.getUser('joueur2');
		const p3 = interaction.options.getUser('joueur3');
		const p4 = interaction.options.getUser('joueur4');
		const p5 = interaction.options.getUser('joueur5');

		let players = [p1, p2, p3, p4, p5];
		let roles = [r.Prouveur, r.Aveugle, r.Servante, r.Voleur, r.Bouffon,
						r.Erudit, r.Peureux, r.Agent, r.Star, r.Sniper, r.Archer];

		players = players.sort(() => Math.random() - 0.5); // Shuffle players

		const imposteurIndex = Math.floor(Math.random() * players.length);
		const imposteur = players[imposteurIndex]; // Random player gets the Imposteur role.

		try {
			const imposteurRole = new r.Imposteur();
			await imposteur.send({ embeds: [imposteurRole.getEmbed()] });
			players.splice(imposteurIndex, 1); // Cut out the player that got the role.

			roles = roles.sort(() => Math.random() - 0.5).slice(0, players.length); // Shuffle roles and pick only 4.

			for (let i = 0; i < players.length; i++) {
				const player = players[i];
				const RoleClass = roles[i];  // Sélectionne un rôle du tableau aléatoire
				const role = new RoleClass(); // Crée une instance du rôle
				await player.send({ embeds: [role.getEmbed()] });
			}

			console.log(`${clr.mag}Tous les rôles ont été attribués aux joueurs.${clr.stop}`);
			interaction.reply({ content: 'Tous les rôles ont été attribués avec succès.' });
		} catch (error) {
			console.error(`${clr.red}Erreur lors de l'envoi des rôles aux joueurs.${clr.stop}`);
			interaction.reply({ content: `Erreur: tous les rôles n'ont pas pu être envoyés. ${error}` });
		}

	}
}