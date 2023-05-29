const Discord = require('discord.js');
const config = require("../config");
const Hirez = require('@joshmiquel/hirez');
const color = require("../resources/color_codes");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('random')
		.setDescription('Returns a random Deity or Build.')
		.addStringOption(option =>
			option.setName('exclusion')
				.setDescription('You may exclude one role.')
				.addChoices(
					{ name: 'Assassin', value: 'Assassin' },
					{ name: 'Guardian', value: 'Guardian' },
					{ name: 'Hunter', value: 'Hunter' },
					{ name: 'Mage', value: 'Mage' },
					{ name: 'Warrior', value: 'Worrior' },
				)),

	async execute(interaction)
	{
		console.log(`${color.cyan}[command]	${color.magenta}/random ${color.white}was fired by ${color.blue}${interaction.user.tag}.${color.stop}`);
		try {
			const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
			const excludeRole = interaction.options.getString('exclusion');

			let gods;
			if (excludeRole)
			{
				gods = await hirez.getGods();
				gods.filter(gods => !gods.Roles.includes(excludeRole));
			}
			else
				gods = await hirez.getGods();

			// const aphrodite = gods.find(god => god.Name === 'Aphrodite');
			// console.log(aphrodite);
			const randomGod = gods[Math.floor(Math.random() * gods.length)];
			const skins = await hirez.getGodSkins(randomGod.id);
			const standardSkin = skins.find((skin) => /standard/i.test(skin.skin_name));

			const embed = new Discord.EmbedBuilder()
				.setTitle(randomGod.Name)
				.setDescription(randomGod.Title + ', ' + randomGod.Pantheon)
				.setImage(standardSkin.godSkin_URL)
			if (excludeRole) {
				embed.setFooter({ text: `Excluded role: ${excludeRole}` });
			}

			interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.log(error);
			interaction.reply('An error occured while trying to acces the Hi-Rez API.');
		}
	}
}