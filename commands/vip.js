const Discord = require('discord.js');
const config = require("../config");
const clr = require("../resources/color_codes");
const schedule = require('node-schedule');
const dbClient = require('../database')

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('vip')
		.setDescription('Gestion des VIP')
		.addUserOption(option =>
			option.setName('utilisateur')
				.setDescription('Cible de la commande')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('action')
				.setDescription('Action à effectuer')
				.setRequired(true)
				.addChoices(
					{ name: 'add', value: 'add' },
					{ name: 'remove', value: 'remove' },
					{ name: 'check', value: 'check' },
					{ name: 'list', value: 'list' }
				)
		)
		.addIntegerOption(option =>
			option.setName('duree')
				.setDescription('Durée en jours, pour add/remove')
				.setRequired(false)
		),

	async execute(interaction) {
		const user = interaction.options.getUser('utilisateur');
		const action = interaction.options.getString('action');
		const duration = interaction.options.getInteger('duree');
		const member = interaction.guild.members.cache.get(user.id);
		const role = interaction.guild.roles.cache.find(role => role.name === 'VIP');
		const currentTime = Date.now();

		if (!role) return interaction.reply({ content: "Une erreur s'est produite: Le rôle VIP n'existe pas.", ephemeral: true });

		if (!duration && (action == 'add' || action == 'remove')) { // if duration is not specified for add/remove
			return interaction.reply({ content: "Veuillez spécifier une durée en jours pour les actions add/remove.", ephemeral: true });
		}
		if ((action === 'add' || action === 'remove') && !config.adminIds.includes(interaction.user.id)) { // if user is not an admin and is trying to add/remove VIP status
			return interaction.reply({ content: "Vous n'avez pas la permission d'ajouter ou de retirer le statut VIP.", ephemeral: true });
		}


		// Get expiration time of user in the vip_users TABLE, or currentTime if user is not in the table
		let expirationTime;
		try {
			await dbClient.query(`SELECT * FROM vip_users WHERE user_id = $1`, [user.id])
				.then(res => {
					if (res.rows[0]) {
						expirationTime = res.rows[0].expiration_time;
					}
					else {
						expirationTime = currentTime;
					}
				});
		} catch (err) {
			console.log(`${clr.red}[VIP]	Error while fetching VIP data from the database:${clr.stop} ${err}`);
			return interaction.reply({ content: "Une erreur s'est produite lors de la récupération des données VIP.", ephemeral: true });
		}


		if (action === 'add') {
			expirationTime += duration * 60 * 1000; // days -> milliseconds

			// Add the user to the vip_users TABLE
			try {
				await dbClient.query(
					`INSERT INTO vip_users (user_id, expiration_time) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET expiration_time = $2`,
					[user.id, expirationTime]
				);
				if (!member.roles.cache.has(role.id)) {
					await user.send(`Vous êtes désormais VIP pour une durée de ${duration} jours.`);
					await member.roles.add(role);
				}
				else {
					await user.send(`Votre statut VIP a été prolongé de ${duration} jours.`);
				}
			} catch (err) {
				console.log(`${clr.red}[VIP]	Error while adding VIP data to the database:${clr.stop} ${err}`);
				return interaction.reply({ content: "Une erreur s'est produite lors de l'ajout des données VIP.", ephemeral: true });
			}

			// schedule a job to remove the role and delete from db when the expiration time is reached
			schedule.scheduleJob(new Date(expirationTime), async () => {
				await dbClient.query(`DELETE FROM vip_users WHERE user_id = $1`, [user.id]);
				if (member.roles.cache.has(role.id)) {
					await member.roles.remove(role);
					await user.send(`Votre statut VIP a expirer.`);
					console.log(`${clr.red}[VIP]	${clr.red}${user.username} ${clr.whi}a perdu son statut VIP.`);
				}
			});

			// schedule a job to notify the user 3 days before expiration
			const notifyTime = expirationTime - 3 * 60 * 1000; // 5 days before expiration
			schedule.scheduleJob(new Date(notifyTime), async () => {
				if (vipUsers[user.id]) {
					await user.send(`Votre statut VIP va expirer dans 5 jours.`);
					console.log(`${clr.red}[VIP]	${clr.red}${user.username} ${clr.whi}a été notifié de l'expiration de son statut VIP dans 5 jours.`);
				}
			});

			interaction.reply({ content: `L'utilisateur ${user.username} a été ajouté à la liste des VIP pour une durée de ${duration} jours.`, ephemeral: true });
		}
		else if (action === 'remove') {
			if (expirationTime - currentTime <= duration * 60 * 1000) {
				// if time left is less than the duration, remove the role and delete from db
				await dbClient.query(`DELETE FROM vip_users WHERE user_id = $1`, [user.id]);
				if (member.roles.cache.has(role.id)) {
					await member.roles.remove(role);
				}
				await user.send(`Votre statut VIP vous a été retiré par un administrateur.`);
				interaction.reply({ content: `L'utilisateur ${user.username} a été retiré de la liste des VIP.`, ephemeral: true });
			}
			else {
				expirationTime -= duration * 60 * 1000;
				try {
					await dbClient.query(`UPDATE vip_users SET expiration_time = $1 WHERE user_id = $2`, [expirationTime, user.id]);
				}
				catch (err) {
					console.log(`${clr.red}[VIP]	Error while updating VIP data in the database:${clr.stop} ${err}`);
					return interaction.reply({ content: "Une erreur s'est produite lors de la mise à jour des données VIP.", ephemeral: true });
				}
				timeLeft = Math.ceil((expirationTime - currentTime) / (60 * 1000));
				await user.send(`La durée de votre statut VIP a été réduite de ${duration} jours. Durée restante:	${timeLeft} jours.`);
				interaction.reply({ content: `La durée du statut VIP de ${user.username} a été réduite de ${duration} jours. (reste: ${timeLeft})`, ephemeral: true });
			}
		}
		else if (action === 'check') {
			if (interaction.user.id !== user.id) { // if user is trying to check another user's VIP status
				return interaction.reply({ content: "Vous ne pouvez pas vérifier le detail du statut VIP d'un autre utilisateur.", ephemeral: true });
			}
			timeLeft = Math.ceil((expirationTime - currentTime) / (60 * 1000));
			interaction.reply({ content: `Il vous reste ${timeLeft} jours de status VIP.`, ephemeral: true });
		}
	}
}