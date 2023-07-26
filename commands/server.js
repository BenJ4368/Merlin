const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('server')	
		.setDescription('Rejoingez le Serveur Minecraft')
		.addStringOption(option =>
			option.setName('42login')
			  .setDescription('Votre login 42, obligatoire')
			  .setRequired(true)
		  ),

	async execute(interaction)	// Simply sends back a message
	{
		console.log(`${clr.cya}[comd]	${clr.mag}/server ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);

		const login = interaction.options.getString('42login');
		const admin = await interaction.client.users.fetch(config.adminIds[0]);
		admin.send(`**${interaction.user.username}** used /server and send < **${login}** > as his/her 42 login`)
		interaction.reply({ content: `Merci ${login}, voici l'IP du serveur:	42mulhouse.uhcserv.eu`, ephemeral: true });
	}
}
