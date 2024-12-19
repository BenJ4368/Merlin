const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require('../config');
const axios = require('axios');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('crit')
		.setDescription('Informations sur une oeuvre')
		.addStringOption(option =>
			option.setName('recherche')
				.setDescription('Titre de l\'oeuvre, ou Nom d\'une personne')
				.setRequired(true)
		),

		async execute(interaction) {
			console.log(`${clr.cya}[comd]	${clr.blu}/crit ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);

			const recherche = interaction.options.getString('recherche');
			const apiKey = config.tvdbApiKey;

			const baseURL = 'https://api4.thetvdb.com/v4';

			try {
				const authResponse = await axios.post(`${baseURL}/login`, {
					apikey: apiKey
				});

				const token = authResponse.data.data.token;

				const searchResponse = await axios.get(`${baseURL}/search`, {
					headers: { Authorization: `Bearer ${token}` },
					params: { q: recherche }
				});

				if (!searchResponse.data.data || searchResponse.data.data.length === 0) {
					await interaction.reply({ content: `Aucun résultat trouvé pour **${recherche}**.`, ephemeral: true });
					return;
				}

				const result = searchResponse.data.data[0];

				let embed;
				if (result.type === 'movie') {
					embed = new Discord.EmbedBuilder()
						.setTitle((result.translations && result.translations.fra) || result.name || 'Titre non disponible')
						.setDescription((result.overviews && (result.overviews.fra || result.overviews.eng)) || 'Résumé non disponible')
						.addFields(
							{ name: 'Réal.', value: result.director || 'Non spécifié', inline: true },
							{ name: 'Sortie', value: result.first_air_time || result.year || 'Non spécifiée', inline: true },
							{ name: 'Pays', value: result.country || 'Non spécifié', inline: true }
						)
						.setImage(result.image_url || null)
						.setColor('#ffffff') // Different color for movies
						.setFooter({ text: 'Source : TheTVDB' });
				} else if (result.type === 'series') {
					embed = new Discord.EmbedBuilder()
						.setTitle((result.translations && result.translations.fra) || result.name || 'Titre non disponible')
						.setDescription((result.overviews && (result.overviews.fra || result.overviews.eng)) || 'Résumé non disponible')
						.addFields(
							{ name: 'Status', value: result.status === 'Continuing' ? 'En cours' : 'Terminée', inline: true },
							{ name: 'Sortie', value: result.first_air_time || result.year || 'Non spécifiée', inline: true },
							{ name: 'Pays', value: result.country || 'Non spécifié', inline: true }
						)
						.setImage(result.image_url || null)
						.setColor('#ffffff') // Different color for series
						.setFooter({ text: 'Source : TheTVDB' });
				} else if (result.type === 'person') {
					embed = new Discord.EmbedBuilder()
						.setTitle(result.name)
						.setDescription((result.overviews && (result.overviews.fra || result.overviews.eng)) || 'Informations non disponibles')
						.setImage(result.image_url || null)
						.setColor('#ffffff') // Different color for series
						.setFooter({ text: 'Source : TheTVDB' });
				} else {
					embed = new Discord.EmbedBuilder()
						.setTitle('La recherche n\'a pas donné de résultat')
						.setFooter({ text: 'Source : TheTVDB' });
				}

				await interaction.reply({ embeds: [embed] });

			} catch (error) {
				console.error('Erreur avec l\'API TVDB :', error);
				await interaction.reply({
					content: `Une erreur s'est produite lors de la récupération des informations pour **${recherche}**.`,
					ephemeral: true
				});
			}
		}
	};
