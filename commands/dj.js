const Discord = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');
const clr = require("../resources/color_codes");

const subscriptions = new Map();

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('dj')
		.setDescription('Joue une playlist Youtube')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('Play or Stop')
				.setRequired(true)
				.addChoices(
					{ name: 'Play', value: 'play' },
					{ name: 'Stop', value: 'stop' }
				))
		.addStringOption(option =>
			option.setName('url')
				.setDescription('URL de la playlist Youtube')),

	async execute(interaction) {
		console.log(`${clr.cya}[cmd] ${clr.blu}/dj ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);

		const action = interaction.options.getString('action');
		const url = interaction.options.getString('url');
		const voiceChannel = interaction.member.voice.channel;

		if (!voiceChannel)
			return interaction.reply({ content: "Vous devez être dans un salon vocal pour utiliser cette commande.", flags: Discord.MessageFlags.Ephemeral });

		if (action === 'play') {
			if (!url)
				return interaction.reply({ content: 'Vous devez fournir une URL youtube pour jouer une playlist.', flags: Discord.MessageFlags.Ephemeral });

			await interaction.reply({ content: `🔊 Lecture de la playlist : ${url}` });
			try {
				await play.playlist_info(url, { incomplete: true });
			} catch (error) {
				console.error("Erreur lors de la récupération de la playlist:", error);
				return interaction.reply({ content: "Une erreur s'est produite. Verifiez l'URL fournie.", flags: Discord.MessageFlags.Ephemeral });
			}

			let videos = await playlist.all_videos();
			if (videos.length === 0)
				return interaction.followUp({ content: "Cette playlist est vide.", flags: Discord.MessageFlags.Ephemeral });

			let subscription = subscriptions.get(interaction.guild.id);
			if (!subscription) {
				const connection = joinVoiceChannel({
					channelId: voiceChannel.id,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});
				const player = createAudioPlayer();
				subscription = { connection, player, queue: [], currentIndex: 0 };
				subscriptions.set(interaction.guild.id, subscription);
				connection.subscribe(player);
			} else {
				subscription.player.stop();
				subscription.queue = [];
				subscription.currentIndex = 0;
			}

			subscription.queue = videos;

			const playNext = async () => {
				if (subscription.currentIndex >= subscription.queue.length) {
					subscription.connection.destroy();
					subscriptions.delete(interaction.guild.id);
					interaction.followUp({ content: "La playlist est terminée.", flags: Discord.MessageFlags.Ephemeral });
					return;
				}

				const video = subscription.queue[subscription.currentIndex];
				let stream;
				try {
					stream = await play.stream(video.url);
				} catch (error) {
					console.error("Erreur lors du streaming de la vidéo :", video.url, error);
					subscription.currentIndex++;
					return playNext();
				}
				const resource = createAudioResource(stream.stream, { inputType: stream.type });
				subscription.player.play(resource);
				interaction.followUp({ content: `▶️ Lecture : **${video.title}**`, flags: Discord.MessageFlags.Ephemeral });

				subscription.player.once(AudioPlayerStatus.Idle, () => {
					subscription.currentIndex++;
					playNext();
				});
			};

			playNext();

		} else if (action === 'stop') {
			const subscription = subscriptions.get(interaction.guild.id);
			if (subscription) {
				subscription.player.stop();
				subscription.connection.destroy();
				subscriptions.delete(interaction.guild.id);
				interaction.reply({ content: '🛑 Lecture stoppée et déconnecté du salon vocal.', flags: Discord.MessageFlags.Ephemeral });
			} else {
				interaction.reply({ content: "Aucune lecture en cours.", flags: Discord.MessageFlags.Ephemeral });
			}
		} else {
			interaction.reply({ content: 'Action invalide.', flags: Discord.MessageFlags.Ephemeral });
		}
	}
};
