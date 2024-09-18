const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const r = require("../resources/lgow/lgowData")

async function archerFunction(player, role, players, gameMap) {
	// Sending the role embed and image
	await player.send({
		embeds: [role.getEmbed()],
		files: [{
			attachment: await role.getImage()
		}],
	});
	// Create buttons for every otherPlayer
	const targetList = players.filter(p => p !== player);
	const actionRow = new Discord.ActionRowBuilder();
	for (let i = 0; i < targetList.length; i++) {
		const button = new Discord.ButtonBuilder()
			.setCustomId(i.toString())
			.setLabel(targetList[i].displayName)
			.setStyle(Discord.ButtonStyle.Secondary);
		actionRow.addComponents(button);
	}
	const buttonMessage = await player.send({
		content: "_ _",
		components: [actionRow]
	})
	// collect answer
	const collector = buttonMessage.createMessageComponentCollector({
		componentType: Discord.ComponentType.Button,
		time: 30000 // 30s
	});
	let clicked = false;
	collector.on('collect', async buttonPressed => {
		clicked = true;
		selectedRole = gameMap.get(targetList[buttonPressed.customId]);
		const embed = new Discord.EmbedBuilder()
			.setTitle(`Vous avez cibler ${targetList[buttonPressed.customId].username}`)
			.setDescription(`Son role est:		${selectedRole.getName()}`)
			.setColor(selectedRole.getColor());
		if (!buttonMessage.deleted) {
			await buttonMessage.edit({
				content: "_ _",
				embeds: [embed],
				components: [],
			});
		}
	});
	collector.on('end', async () => {
		if (clicked == false && !buttonMessage.deleted) {
			await buttonMessage.edit({
				content: "\nVous n'avez pas selectionnez de cible a temps. La partie ne peux pas continuer.",
				components: []
			});
		}
	});
}

async function voleurFunction(player, role, players, gameMap) {
	// Sending the role embed and image
	await player.send({
		embeds: [role.getEmbed()],
		files: [{
			attachment: await role.getImage()
		}],
	});
	// Create buttons for every otherPlayer
	const targetList = players.filter(p => p !== player);
	const actionRow = new Discord.ActionRowBuilder();
	for (let i = 0; i < targetList.length; i++) {
		const button = new Discord.ButtonBuilder()
			.setCustomId(i.toString())
			.setLabel(targetList[i].displayName)
			.setStyle(Discord.ButtonStyle.Secondary);
		actionRow.addComponents(button);
	}
	const buttonMessage = await player.send({
		content: "_ _",
		components: [actionRow]
	})
	// collect answer
	const collector = buttonMessage.createMessageComponentCollector({
		componentType: Discord.ComponentType.Button,
		time: 30000 // 30s
	});

	let clicked = false;
	collector.on('collect', async buttonPressed => {
		clicked = true;
		selectedRole = gameMap.get(targetList[buttonPressed.customId]);
		let newRole = r.stealRole(selectedRole);
		const embed = new Discord.EmbedBuilder()
			.setTitle(`Vous avez cibler ${targetList[buttonPressed.customId].username}`)
			.setDescription(`Vous lui volez donc son role de: ${newRole.getName()}`)
			.setColor(Discord.Colors.White);
		if (!buttonMessage.deleted) {
			await buttonMessage.edit({
				content: "_ _",
				embeds: [embed],
				components: [],
			});
		}
		if (newRole.getName() == 'Archer')
			archerFunction(player, newRole, players, gameMap);
		if (newRole.getName() == "Erudit")
			await newRole.setRandomWords();
		else {
			if (newRole.getName() == 'Servante dévouée') {
				const masterList = players.filter(p => p !== player);
				const masterIndex = Math.floor(Math.random() * masterList.length);
				newRole.setMaster(masterList[masterIndex]);
			}

			// Sending the role to the player
			await player.send({
				embeds: [newRole.getEmbed()],
				files: [{
					attachment: await newRole.getImage()
				}],
			});
		}
	});
	collector.on('end', async () => {
		if (clicked == false && !buttonMessage.deleted) {
			await buttonMessage.edit({
				content: "\nVous n'avez pas selectionnez de cible a temps. La partie ne peux pas continuer.",
				components: []
			});
		}
	});

}

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
			await interaction.reply({ content: 'Attribution des roles...' });

		try {
			let players = [ interaction.options.getUser('joueur1'),
							interaction.options.getUser('joueur2'),
							interaction.options.getUser('joueur3'),
							interaction.options.getUser('joueur4'),
							interaction.options.getUser('joueur5') ];


			let roles = [r.Prouveur, r.Aveugle, r.Servante, r.Voleur, r.Bouffon,
							r.Erudit, r.Peureux, r.Agent, r.Star, r.Sniper, r.Archer];

			// Shuffle players
			players = players.sort(() => Math.random() - 0.5);
			// Shuffle roles, and select 4
			let chosenRoles = [];
			for (let i = 0; i < 4; i++) {
				let randomIndex = Math.floor(Math.random() * roles.length);
				const randomRole = new roles[randomIndex]();
				if (randomRole.getName() == "Erudit")
					await randomRole.setRandomWords();
				chosenRoles.push(randomRole);
				roles.splice(randomIndex, 1);
			}
			// add the Imposteur role at a random index.
			let randomIndex = Math.floor(Math.random() * chosenRoles.length);
			chosenRoles.splice(randomIndex, 0, new r.Imposteur());


			// Map to assign chosenRole to Player
			const gameMap = new Map()
			for (let i = 0; i < players.length; i++)
				gameMap.set(players[i], chosenRoles[i]);

			// Iterate over every player
			for (const [player, role] of gameMap.entries()) {
				if (role.getName() == 'Archer')
					archerFunction(player, role, players, gameMap);
				else if (role.getName() == 'Voleur') {
					voleurFunction(player, role, players, gameMap);
				}
				else { // Roles that does not need interaction
					// Assign a random master to the Servante (Excluding the Servante herslef)
					if (role.getName() == 'Servante dévouée') {
						const masterList = players.filter(p => p !== player);
						const masterIndex = Math.floor(Math.random() * masterList.length);
						role.setMaster(masterList[masterIndex]);
					}

					// Sending the role to the player
					await player.send({
						embeds: [role.getEmbed()],
						files: [{
							attachment: await role.getImage()
						}],
					});
				}
			};

			await interaction.editReply({ content: 'Tout les rôles ont été attribués.\nLa Partie peu commencer.' });
		} catch (error) {
			console.dir(error);
			await interaction.editReply({ content: `Erreur: tous les rôles n'ont pas pu être attribués.\n${error}` });
		}

	}
}