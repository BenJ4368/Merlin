const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const lgowClasses = require("../resources/lgow/lgowClasses")

async function archerFunction(player, role, gameInstance) {
	// Sending the role embed and image
	await player.send({
		embeds: [role.getEmbed()],
		files: [{
			attachment: await role.getImage()
		}],
	});
	// Create buttons for each other Player
	const targetList = gameInstance.players.filter(p => p !== player);
	const actionRow = new Discord.ActionRowBuilder();
	for (let i = 0; i < targetList.length; i++) {
		const button = new Discord.ButtonBuilder()
			.setCustomId(i.toString())
			.setLabel(targetList[i].displayName)
			.setStyle(Discord.ButtonStyle.Secondary);
		actionRow.addComponents(button);
	}
	// Add buttons to message
	const buttonMessage = await player.send({
		content: "_ _",
		components: [actionRow]
	})
	// Collect answer
	const collector = buttonMessage.createMessageComponentCollector({
		componentType: Discord.ComponentType.Button,
		time: 30000 // 30s
	});
	let clicked = false;
	collector.on('collect', async buttonPressed => {
		clicked = true;
		role.setTarget(
			targetList[buttonPressed.customId],
			gameInstance.getPlayerRoles(targetList[buttonPressed.customId])[0]
		);
		const embed = new Discord.EmbedBuilder()
			.setTitle(`Vous avez cibler ${role.getTarget().username}`)
			.setDescription(`Son role est:	${role.getTargetRole().getName()}`)
			.setColor(role.getTargetRole().getColor());
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

async function voleurFunction(player, role, gameInstance) {
	// Sending the role embed and image
	await player.send({
		embeds: [role.getEmbed()],
		files: [{
			attachment: await role.getImage()
		}],
	});
	// Create buttons for each other Player
	const targetList = gameInstance.players.filter(p => p !== player);
	const actionRow = new Discord.ActionRowBuilder();
	for (let i = 0; i < targetList.length; i++) {
		const button = new Discord.ButtonBuilder()
			.setCustomId(i.toString())
			.setLabel(targetList[i].displayName)
			.setStyle(Discord.ButtonStyle.Secondary);
		actionRow.addComponents(button);
	}
	// Add buttons to message
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
		role.setTarget(
			targetList[buttonPressed.customId],
			gameInstance.getPlayerRoles(targetList[buttonPressed.customId])[0]
		);
		let newRole = lgowClasses.stealRole(role.getTargetRole());
		const embed = new Discord.EmbedBuilder()
			.setTitle(`Vous avez cibler ${role.getTarget().username}`)
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
			archerFunction(player, newRole, gameInstance);
		if (newRole.getName() == "Erudit")
			await newRole.initEruditWords();
		if (newRole.getName() == 'Parieur')
			parieurFunction(player, newRole);
		else {
			if (newRole.getName() == 'Servante') {
				const masterList = gameInstance.players.filter(p => p !== player);
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

async function parieurFunction(player, role) {
	await player.send({
		embeds: [role.getEmbed()],
		files: [{
			attachment: await role.getImage()
		}],
	});
	// Create buttons for each bet option
	const betList = role.getBets();
	const actionRow = new Discord.ActionRowBuilder();
	for (let i = 0; i < betList.length; i++) {
		const button = new Discord.ButtonBuilder()
			.setCustomId(i.toString())
			.setLabel(betList[i])
			.setStyle(Discord.ButtonStyle.Secondary);
		actionRow.addComponents(button);
	}
	// Add buttons to message
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
		role.setBet(betList[buttonPressed.customId]);
		const embed = new Discord.EmbedBuilder()
			.setTitle(`Vous avez Parier: ${role.getBet()}`)
			.setDescription(`Tenez votre pari jusqu'a la fin de la partie pour gagner des points!`)
			.setColor(role.getColor());
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
				content: "\nVous n'avez pas parié à temps. La partie ne peux pas continuer.",
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
				.setDescription('Indiquez les joueurs, vous compris. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur2')
				.setDescription('Indiquez les joueurs, vous compris. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur3')
				.setDescription('Indiquez les joueurs, vous compris. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur4')
				.setDescription('Indiquez les joueurs, vous compris. Pas de doublons.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('joueur5')
				.setDescription('Indiquez les joueurs, vous compris. Pas de doublons.')
				.setRequired(true)),

	async execute(interaction) {
			console.log(`${clr.cya}[cmd]	${clr.blu}/lgow ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
			await interaction.reply({ content: 'Attribution des roles...' });

		try {
			// New gameInstance
			let gameInstance = new lgowClasses.GameInstance(
					   [interaction.options.getUser('joueur1'),
						interaction.options.getUser('joueur2'),
						interaction.options.getUser('joueur3'),
						interaction.options.getUser('joueur4'),
						interaction.options.getUser('joueur5')]);

			// Shuffle players, for randomness
			gameInstance.players = gameInstance.players.sort(() => Math.random() - 0.5);
			// Shuffle gameInstance.rolesPool, and select 4
			let chosenRoles = [];
			for (let i = 0; i < 4; i++) {
				const randomIndex = Math.floor(Math.random() * gameInstance.rolesPool.length);
				const randomRole = new gameInstance.rolesPool[randomIndex]();
				if (randomRole.getName() == "Erudit")
					await randomRole.initEruditWords();
				chosenRoles.push(randomRole);
				gameInstance.rolesPool.splice(randomIndex, 1);
			}
			// add the Imposteur role at a random index.
			let randomIndex = Math.floor(Math.random() * chosenRoles.length);
			chosenRoles.splice(randomIndex, 0, new lgowClasses.Imposteur())

			// Assign roles to players, init player points
			for (let i = 0; i < gameInstance.players.length; i++) {
				gameInstance.setPlayerRole(gameInstance.players[i], chosenRoles[i]);
				gameInstance.initPlayerPoints(gameInstance.players[i]);
			}

			// Iterate over every player
			for (const [player, role] of gameInstance.roles.entries()) {
				if (role.getName() == 'Archer')
					archerFunction(player, role, gameInstance);
				else if (role.getName() == 'Voleur')
					voleurFunction(player, role, gameInstance);
				else if (role.getName() == 'Parieur')
					parieurFunction(player, role);
				else { // other roles that does not need interaction
					// Assign a random master to the Servante (Excluding the Servante herslef)
					if (role.getName() == 'Servante') {
						const masterList = gameInstance.players.filter(p => p !== gameInstance.player);
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
			await interaction.editReply({ content: `Erreur: ${error}` });
		}

	}
}