const Discord = require('discord.js');
const config = require("../config");
const clr = require("../resources/color_codes");
const schedule = require('node-schedule');
const { add } = require('libsodium-wrappers');

let vipUsers = {};

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
		let expirationTime = vipUsers[user.id]?.expiration || currentTime;

		if (!role) return interaction.reply({ content: "Une erreur s'est produite: Le rôle VIP n'existe pas.", ephemeral: true });

		if (!duration && (action == 'add' || action == 'remove')) { // if duration is not specified for add/remove
			return interaction.reply({ content: "Veuillez spécifier une durée en jours pour les actions add/remove.", ephemeral: true });
		}
		if (action === 'add' || action === 'remove' && !config.adminIds.includes(interaction.user.id)) { // if user is not an admin and is trying to add/remove VIP status
			return interaction.reply({ content: "Vous n'avez pas la permission d'ajouter ou de retirer le statut VIP.", ephemeral: true });
		}

		if (action === 'add') {
			expirationTime += duration * 60 * 1000; // milliseconds
			vipUsers[user.id] = { expiration };

			if (!member.roles.cache.has(role.id)) {
				await member.roles.add(role);
			}

			// schedule a job to remove the role when the expiration time is reached
			schedule.scheduleJob(new Date(expirationTime), async () => {
				delete vipUsers[user.id];
				if (member.roles.cache.has(role.id)) {
					await member.roles.remove(role);
					console.log(`${clr.red}[VIP]	${clr.red}${user.username} ${clr.whi}a perdu son statut VIP.`);
				}
			});

			// schedule a job to notify the user 5 days before expiration
			const notifyTime = expirationTime - 5 * 60 * 1000; // 5 days before expiration
			schedule.scheduleJob(new Date(notifyTime), async () => {
				if (vipUsers[user.id]) {
					await user.send(`Votre statut VIP va expirer dans 5 jours.`);
					console.log(`${clr.red}[VIP]	${clr.red}${user.username} ${clr.whi}a été notifié de l'expiration de son statut VIP dans 5 jours.`);
				}
			});


			interaction.reply({ content: `L'utilisateur ${user.username} a été ajouté à la liste des VIP pour une durée de ${duration} jours.`, ephemeral: true });
		}
		else if (action === 'remove') {
			if (expirationTime - currentTime <= jours * 24 * 60 * 60 * 1000) {
				// if time left is less than the duration, remove the role
				delete vipUsers[user.id];
				if (member.roles.cache.has(role.id)) {
					await member.roles.remove(role);
				}
				interaction.reply({ content: `L'utilisateur ${user.username} a été retiré de la liste des VIP.`, ephemeral: true });
			}
			else {
				expirationTime -= duration * 24 * 60 * 60 * 1000;
				vipUsers[user.id].expiration = expiration;
				timeLeft = Math.ceil((expirationTime - currentTime) / (24 * 60 * 60 * 1000));
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
		else if (action === 'list') {
			let vipList = 'Voici les utilisateur VIP actuels:\n';
			for (const id in vipUsers) {
				const vipUser = interaction.guild.members.cache.get(id);
				vipList += `${vipUser.user.username}\n`;
			}
			interaction.reply({ content: vipList, ephemeral: true });
		}
	}
}