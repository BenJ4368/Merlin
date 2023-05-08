const Discord = require('discord.js');

module.exports = {

	data: new Discord.SlashCommandBuilder()
		.setName('unmute')
		.setDescription('démute un utilisateur')
		.addUserOption( option =>
			option
				.setName('cible')
				.setDescription("l'utilisateur à démuter")
				.setRequired(true)),

	async execute(interaction) {

		const targetUser = interaction.options.getUser('cible');
		const targetMember = interaction.guild.members.cache.get(targetUser.id);

		if (targetMember.voice.serverMute)
		{
			targetMember.voice.setMute(false);
			interaction.reply(`${targetUser} est démuter.`)
		}
		else
			interaction.reply(`${targetUser} n'est pas mute.`)
	},
};