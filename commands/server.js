const Discord = require('discord.js');
const clr = require("../resources/color_codes");
const config = require("../config");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('server')	
		.setDescription('Rejoingez le Serveur Minecraft')
		.addStringOption(option =>
			option.setName('nickname')
			  .setDescription('Un nom, autre que votre pseudo MC, pour se reconnaitre entre studs de 42 (login 42 par exemple)')
			  .setRequired(true)
		  ),

	async execute(interaction)	// Simply sends back a message
	{
		console.log(`${clr.cya}[comd]	${clr.mag}/server ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		if (interaction.user.id === "290163948861390849" || interaction.user.id === "509256239830794240")
		{
			interaction.reply({ content: `TG ENCULER`, ephemeral: true });
			return ;
		}

		const login = interaction.options.getString('nickname');
		const admin = await interaction.client.users.fetch(config.adminIds[0]);
		admin.send(`**${interaction.user.username}**	used /server and send	< **${login}** >	as keyword`)
		interaction.reply({ content: `Merci ${login}, voici l'IP du serveur:	42mulhouse.uhcserv.eu`, ephemeral: true });
	}
}
