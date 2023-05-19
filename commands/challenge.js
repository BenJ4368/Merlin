const Discord = require('discord.js');
const config = require("../config");
const Hirez = require('@joshmiquel/hirez');
const Jimp = require('jimp');
const fs = require('fs');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('challenge')
		.setDescription('Merlin will challenge your Smite knowledge.'),

	async execute(interaction)
	{
		try {
			// choisir un dossier aléatoire ./resources/gods/${randomDir} parmis tout les dossiers présents
			const directories = fs.readdirSync("./resources/gods/", { withFileTypes: true })
				.filter(dirent => dirent.isDirectory())
				.map(dirent => dirent.name);
			const randomDir = directories[Math.floor(Math.random() * directories.length)];
			const GodAnswer = randomDir;
			console.log(GodAnswer);

			// puis, choisir un fichier aléatoire ./resources/gods/${randomDir}/skins/${randomFile}
			const files = fs.readdirSync(`./resources/gods/${randomDir}/skins/`, { withFileTypes: true })
				.filter(dirent => dirent.isFile())
				.map(dirent => dirent.name);
			const randomFile = files[Math.floor(Math.random() * files.length)];
			console.log(randomFile);

			
			const image = await Jimp.read(`./resources/gods/${randomDir}/skins/${randomFile}`);
			console.log(image);
			const x = Math.floor(Math.random() * (image.getWidth() - 250));
			const y = Math.floor(Math.random() * (image.getHeight() - 250));
			const croppedImage = await image.clone().crop(x, y, 250, 250).getBufferAsync(Jimp.MIME_PNG);

			const embed = new Discord.EmbedBuilder()
				.setTitle("Who is this deity ?")
				.setDescription("I cropped this image out of any of that deity's skins.")
			
				await interaction.reply({ 
					embeds: [embed],
					files: [{
						attachment: croppedImage,
						name: 'croppedImage.png'
					}]
				});
		} catch (error) {
			console.log(error);
			interaction.reply('An error occured. Please try again in a couple seconds, or contact ./BenJ#5533');
		}
	}
}