const Discord = require('discord.js');
const color = require("../resources/color_codes")
const fs = require('fs');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('randomgod')
		.setDescription('Donne un dieu aléatoire. (smite1)'),

	async execute(CommandInteraction) {
		console.log(`${color.cya}[command]	${color.mag}/randomgod ${color.whi}was fired by ${color.blu}${CommandInteraction.user.tag}.${color.stop}`);
		try {

			const directories = fs.readdirSync('./resources/smite/gods/', { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name);


			const randomIndex = Math.floor(Math.random() * directories.length);
			const randomDirectory = directories[randomIndex];

			const files = fs.readdirSync(`./resources/smite/gods/${randomDirectory}/`, { withFileTypes: true })
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


