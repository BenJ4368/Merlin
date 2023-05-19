const Discord = require('discord.js');
const Jimp = require('jimp');
const fs = require('fs');

async function playDeityImage(interaction) {
	// choisir un dossier aléatoire ./resources/gods/${randomDir} parmis tout les dossiers présents
	const directories = fs.readdirSync("./resources/gods/", { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
	const randomDir = directories[Math.floor(Math.random() * directories.length)];
	const GodAnswer = randomDir; // console.log la réponse
	console.log(GodAnswer);

	// puis, choisir un fichier aléatoire ./resources/gods/${randomDir}/skins/${randomFile}
	const files = fs.readdirSync(`./resources/gods/${randomDir}/skins/`, { withFileTypes: true })
		.filter(dirent => dirent.isFile())
		.map(dirent => dirent.name);
	const randomFile = files[Math.floor(Math.random() * files.length)];
	console.log(randomFile); // console.log le nom du fichier choisi


	const image = await Jimp.read(`./resources/gods/${randomDir}/skins/${randomFile}`);
	const x = Math.floor(Math.random() * (image.getWidth() - 300));
	const y = Math.floor(Math.random() * (image.getHeight() - 300));
	const croppedImage = await image.clone().crop(x, y, 300, 300).getBufferAsync(Jimp.MIME_PNG);

	const embed = new Discord.EmbedBuilder()
		.setTitle("Who is this deity ?")
		.setDescription("You have 40 seconds. Please answer using my /answer command.")
		.setColor(Discord.Colors.DarkOrange)

	const message = await interaction.reply({
		embeds: [embed],
		files: [{
			attachment: croppedImage,
			name: 'GoBackOnDiscordAndStopTryingToCheat.png'
		}],
		fetchReply: true,
	});

	await message.react('4️⃣');
	await message.react('0️⃣');
	let timeLeft = 40;

	const interval = setInterval(async () => {
		timeLeft -= 5;
		
		if (timeLeft >= 10) {
			await message.reactions.removeAll();
			await message.react(String.fromCharCode(0x30 + Math.floor(timeLeft / 10)) + '️⃣');
			await message.react(String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
			//console.log(String.fromCharCode(0x30 + Math.floor(timeLeft / 10)) + '️⃣', String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
		} else if (timeLeft > 0) {
			await message.reactions.removeAll();
			await message.react(String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
			//console.log(String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
		}

		if (timeLeft <= 0) {
			clearInterval(interval);
			await message.reactions.removeAll();
			await message.react('❌');
		}
	}, 5000);
}

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('challenge')
		.setDescription('Merlin will challenge your Smite knowledge.'),

	async execute(interaction)
	{
		try {
			playDeityImage(interaction);
		} catch (error) {
			console.log(error);
			interaction.reply('An error occured. Please try again in a couple seconds, or contact ./BenJ#5533');
		}
	}
}