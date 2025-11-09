const Discord = require('discord.js');
const color = require("../resources/color_codes")
const fs = require('fs');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('randomgod')
		.setDescription('Donne un dieu aléatoire. (smite1)')
		.addStringOption(option =>
			option.setName('role')
				.setDescription('Rôle du dieu à afficher (optionnel)')
				.addChoices(
					{ name: 'Assassin', value: 'assassin' },
					{ name: 'Chasseur', value: 'hunter' },
					{ name: 'Mage', value: 'mage' },
					{ name: 'Guerrier', value: 'warrior' },
					{ name: 'Guardien', value: 'guardian' },
				)),

	async execute(CommandInteraction) {
		console.log(`${color.cya}[command]	${color.mag}/randomgod ${color.whi}was fired by ${color.blu}${CommandInteraction.user.tag}.${color.stop}`);
		try {

			const optionRole = CommandInteraction.options.getString('role');

			var chosenRole
			if (!optionRole) {
				const roleDirs = fs.readdirSync('./resources/smite/gods/', { withFileTypes: true })
									.filter(dirent => dirent.isDirectory())
									.map(dirent => dirent.name);
				chosenRole = roleDirs[Math.floor(Math.random() * roleDirs.length)];
			} else {
				chosenRole = optionRole;
			}

			const godsInRole = fs.readdirSync(`./resources/smite/gods/${chosenRole}/`, { withFileTypes: true })
					.filter(dirent => dirent.isDirectory())
					.map(dirent => dirent.name);

			const godAnswer = godsInRole[Math.floor(Math.random() * godsInRole.length)];

			const files = fs.readdirSync(`./resources/smite/gods/${chosenRole}/`, { withFileTypes: true })
				.filter(dirent => dirent.isFile() && dirent.name.startsWith("standard_"))
				.map(dirent => dirent.name);
			const randomFile = files[Math.floor(Math.random() * files.length)];


			await CommandInteraction.reply({
				files: [{ attachment: `./resources/smite/gods/${randomDirectory}/${randomFile}`, name: randomFile }]
			});

		} catch (error) {
			console.log(error);
			CommandInteraction.reply('An error occured. Please try again in a couple seconds, or contact ./BenJ#5533');
		}
	}
}


