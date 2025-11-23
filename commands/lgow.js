const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const lgowClasses = require("../resources/lgow/lgowClasses")

async function createButtonMenu(player, options, onSelect) {
	const actionRow = new Discord.ActionRowBuilder();
	options.forEach((option, i) => {
		actionRow.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId(i.toString())
				.setLabel(option.label)
				.setStyle(Discord.ButtonStyle.Secondary)
		);
	});
	const buttonMessage = await player.send({ content: "_ _", components: [actionRow] });
	const collector = buttonMessage.createMessageComponentCollector({
		componentType: Discord.ComponentType.Button,
		time: 120000  // 2 minutes
	});
	let clicked = false;
	collector.on('collect', async buttonPressed => {
		clicked = true;
		await onSelect(buttonPressed.customId, buttonMessage);
	});
	collector.on('end', async () => {
		if (!clicked) {
			await buttonMessage.edit({
				content: "\nVous n'avez pas sélectionné à temps. La partie ne peut pas continuer.",
				components: []
			});
		}
	});
	return buttonMessage;
}

async function archerFunction(player, archer, gameInstance) {
	// Sending the role embed
	await player.send({
		embeds: [archer.getEmbed()],
	});
	// Create buttons for each other Player
	const targetList = gameInstance.players.filter(p => p !== player);
	await createButtonMenu(
		player,
		targetList.map(p => ({ label: p.displayName })),
		async (customId, buttonMessage) => {
			archer.setTarget(targetList[customId], gameInstance.getPlayerRoles(targetList[customId])[0]);
			const embed = new Discord.EmbedBuilder()
				.setTitle(`Vous avez ciblé ${archer.getTarget().username}`)
				.setDescription(`Son rôle est: ${archer.getTargetRole().getName()}`)
				.setColor(archer.getTargetRole().getColor());
			if (!buttonMessage.deleted) {
				await buttonMessage.edit({ content: "_ _", embeds: [embed], components: [] });
			}
		}
	);
}

async function voleurFunction(player, voleur, gameInstance) {
	// Sending the role embed
	await player.send({
		embeds: [voleur.getEmbed()],
	});
	// Create buttons for each other Player
	const targetList = gameInstance.players.filter(p => p !== player);
	await createButtonMenu(
		player,
		targetList.map(p => ({ label: p.displayName })),
		async (customId, buttonMessage) => {
			voleur.setTarget(targetList[customId], gameInstance.getPlayerRoles(targetList[customId])[0]);
			const interactiveRolesMap = {
				'Archer': () => new lgowClasses.Archer(),
				'Servante': () => new lgowClasses.Servante(),
				'Erudit': () => new lgowClasses.Erudit(),
				'Parieur': () => new lgowClasses.Parieur(),
				'Mercenaire': () => new lgowClasses.Mercenaire(),
				'Cupidon': () => new lgowClasses.Cupidon(),
				'ChasseurDePrime': () => new lgowClasses.ChasseurDePrime(),
			};
			const newRole = interactiveRolesMap[voleur.getTargetRole().getName()]?.() ?? voleur.getTargetRole();
			const embed = new Discord.EmbedBuilder()
				.setTitle(`Vous avez ciblé ${voleur.getTarget().username}`)
				.setDescription(`Vous lui volez donc son rôle de: ${newRole.getName()}`)
				.setColor(Discord.Colors.White);
			if (!buttonMessage.deleted) {
				await buttonMessage.edit({ content: "_ _", embeds: [embed], components: [] });
			}
			if (newRole.getName() === 'Archer')
				await archerFunction(player, newRole, gameInstance);
			else if (newRole.getName() === 'Erudit')
				await newRole.initEruditWords();
			else if (newRole.getName() === 'Parieur')
				await parieurFunction(player, newRole);
			else if (newRole.getName() === 'Mercenaire')
				await mercenaireFunction(player, newRole);
			else if (newRole.getName() === 'Cupidon')
				await cupidonFunction(player, newRole, gameInstance);
			else {
				if (newRole.getName() === 'Servante') {
					const masterList = gameInstance.players.filter(p => p !== player);
					newRole.setMaster(masterList[Math.floor(Math.random() * masterList.length)]);
				}
				await player.send({
					embeds: [newRole.getEmbed()],
				});
			}
		}
	);

}

async function parieurFunction(player, parieur) {
	await player.send({
		embeds: [parieur.getEmbed()],
	});
	// Create buttons for each bet option
	const betList = parieur.getBets();
	await createButtonMenu(
		player,
		betList.map(bet => ({ label: bet })),
		async (customId, buttonMessage) => {
			parieur.setBet(betList[customId]);
			const embed = new Discord.EmbedBuilder()
				.setTitle(`Vous avez Parié: ${parieur.getBet()}`)
				.setDescription(`Tenez votre pari jusqu'à la fin de la partie pour gagner des points!`)
				.setColor(parieur.getColor());
			if (!buttonMessage.deleted) {
				await buttonMessage.edit({ content: "_ _", embeds: [embed], components: [] });
			}
		}
	);
}

async function mercenaireFunction(player, mercenaire) {
	await player.send({
		embeds: [mercenaire.getEmbed()],
	});
	// sending the "I completed my task" button
	createButtonMenu(
		player,
		[{ label: "Mission accomplie." }],
		async (customId, buttonMessage) => {
			mercenaire.setMissionAccomplished(true);
			const embed = new Discord.EmbedBuilder()
				.setTitle(`Vous avez confirmé l'accomplissement de votre mission.`)
				.setColor(mercenaire.getColor());
			// upon completing the mission, player is prompted to choose between Bot or Imposteur
			const roleOptions = [new lgowClasses.Bot(), new lgowClasses.Imposteur()];
			await createButtonMenu(
				player,
				roleOptions.map(role => ({ label: role.getName() })),
				async (customId, buttonMessage) => {
					const selectedRole = roleOptions[customId];
					mercenaire.setChosenRole(selectedRole);
					const embed = new Discord.EmbedBuilder()
						.setTitle(`Vous avez choisi de devenir ${selectedRole.getName()}.`)
						.setColor(selectedRole.getColor());
					if (!buttonMessage.deleted) {
						await buttonMessage.edit({ content: "_ _", embeds: [embed], components: [] });
					}
					
				}
			);
		}
	);
}

async function cupidonFunction(player, cupidon, gameInstance) {
	await player.send({
		embeds: [cupidon.getEmbed()],
	});
	// Create buttons for each lover option
	const loverList = gameInstance.players.filter(p => p !== player);
	await createButtonMenu(
		player,
		loverList.map(lover => ({ label: lover })),
		async (customId, buttonMessage) => {
			// player selects first lover
			cupidon.setLovers(loverList[customId]);
			// edit message to remove selected lover from options
			const remainingLovers = loverList.filter((_, index) => index.toString() !== customId);
			await createButtonMenu(
				player,
				remainingLovers.map(lover => ({ label: lover })),
				async (customId, buttonMessage) => {
					cupidon.setLovers(remainingLovers[customId]);
					// edit message to remove selected lover from options
					const finalLovers = remainingLovers.filter((_, index) => index.toString() !== customId);
					await buttonMessage.edit({ content: "_ _", embeds: [embed], components: [] });
					// confirm lovers selection
					const embed = new Discord.EmbedBuilder()
						.setTitle(`Vous avez choisi vos amoureux: ${cupidon.getLovers().join(' et ')}`)
						.setColor(cupidon.getColor());
					// send notice to lovers
					for (const lover of cupidon.getLovers()) {
						await lover.send({
								embeds: [new EmbedBuilder()
								.setTitle("💘 Cupidon vous touché ! 💘")
								.setDescription(`Ayez le meme nombre de morts que ${cupidon.getLovers().find(l => l !== lover).username}\n
									a la fin de la partie pour gagnez 🔹+5 points.\n_ _Si vous echouez, Cupidon gagne 5 fois la différence.`)
								.setColor(Discord.Colors.Pink)],
						});
					}
					if (!buttonMessage.deleted) {
						await buttonMessage.edit({ content: "_ _", embeds: [embed], components: [] });
					}
				}
			);
		}
	);
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
			// Select 4 roles randomly from the rolesPool
			let chosenRoles = [];
			for (let i = 0; i < 4; i++) {
				const randomRole = new (gameInstance.rolesPool
					.splice(
						Math.floor(Math.random() * gameInstance.rolesPool.length)
						, 1)[0])();
				if (randomRole.getName() == "Erudit")
					await randomRole.initEruditWords();
				chosenRoles.push(randomRole);

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
			for (const [player, roles] of gameInstance.roles.entries()) {
				for (const role of (Array.isArray(roles) ? roles : [roles])) {
					if (role.getName() === 'Archer')
						await archerFunction(player, role, gameInstance);
					else if (role.getName() === 'Voleur')
						await voleurFunction(player, role, gameInstance);
					else if (role.getName() === 'Parieur')
						await parieurFunction(player, role);
					else if (role.getName() === 'Mercenaire')
						await mercenaireFunction(player, role);
					else if (role.getName() === 'Cupidon')
						await cupidonFunction(player, role, gameInstance);
					else {
						if (role.getName() === 'Servante') {
							const masterList = gameInstance.players.filter(p => p !== player);
							const masterIndex = Math.floor(Math.random() * masterList.length);
							role.setMaster(masterList[masterIndex]);
						}
						await player.send({
							embeds: [role.getEmbed()],
						});
					}
				}
			}

			await interaction.editReply({ content: 'Tout les rôles ont été attribués.\nLa Partie peu commencer.' });
		} catch (error) {
			console.dir(error);
			await interaction.editReply({ content: `Erreur: ${error}` });
		}

	}
}