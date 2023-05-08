const Discord = require('discord.js');
const config = require("../config");
const Hirez = require('@joshmiquel/hirez');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('randomize')
		.setDescription('Returns a random deity.'),

	async execute(interaction)
	{
		try {

			const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
			// hirez.testSession()
			// 	.then((result) => {
			//  		console.log(result); 
			// 	})
			// 	.catch((error) => {
			// 		console.error(error);
			// 	});

			const gods = await hirez.getGods();
			const randomGod = gods[Math.floor(Math.random() * gods.length)];

			const skins = await hirez.getGodSkins(randomGod.id);
			const standardSkin = skins.find((skin) => /standard/i.test(skin.skin_name));
		  
			const embed = new Discord.EmbedBuilder()
				.setTitle(randomGod.Name)
				.setDescription(randomGod.Title + ', ' + randomGod.Pantheon)
				.setImage(standardSkin.godSkin_URL)
				.setTimestamp()
				.setFooter({ text: 'BBot by BenJ4368#5533' });
		  
			interaction.reply({ embeds: [embed] });
		  } catch (error) {
			console.log(error);
			interaction.reply('An error occured while trying to acces the Hi-Rez API.');
		  }
	}
}