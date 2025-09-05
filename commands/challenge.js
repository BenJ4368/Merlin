const Discord = require('discord.js');
const color = require("../resources/color_codes")
const Jimp = require('jimp');
const fs = require('fs');

function sleep(seconds) {
	return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

async function playDeityImage(CommandInteraction) {

	const directories = fs.readdirSync('./resources/smite/gods/', { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

	// choisir un dossier aléatoire ./resources/smite/gods/${randomDir} parmis tout les dossiers présents
	const selectedDirectories = [];
	while (selectedDirectories.length < 25) {
		const randomIndex = Math.floor(Math.random() * directories.length);
		const randomDirectory = directories[randomIndex];
		if (!selectedDirectories.includes(randomDirectory)) {
			selectedDirectories.push(randomDirectory);
		}
	}
	const godAnswer = selectedDirectories[Math.floor(Math.random() * selectedDirectories.length)];

	// puis, choisir un fichier aléatoire ./resources/smite/gods/${godAnswer}/skins/${randomFile}
	const files = fs.readdirSync(`./resources/smite/gods/${godAnswer}/skins/`, { withFileTypes: true })
		.filter(dirent => dirent.isFile())
		.map(dirent => dirent.name);
	const randomFile = files[Math.floor(Math.random() * files.length)];

	const image = await Jimp.read(`./resources/smite/gods/${godAnswer}/skins/${randomFile}`);
	const x = Math.floor(Math.random() * (image.getWidth() - 300));
	const y = Math.floor(Math.random() * (image.getHeight() - 300));
	const croppedImage = await image.clone().crop(x, y, 300, 300).getBufferAsync(Jimp.MIME_PNG);

	const actionRows = [];
	for (let i = 1; i <= 5; i++) {
		const buttons = [];

		for (let j = 1; j <= 5; j++) {
			const godName = selectedDirectories[(i - 1) * 5 + j - 1]
			const button = new Discord.ButtonBuilder()
				.setCustomId(`${godName}`)
				.setLabel(`${godName}`)
				.setStyle(Discord.ButtonStyle.Secondary);
			buttons.push(button);
		}
		const actionRow = new Discord.ActionRowBuilder()
			.setComponents(buttons);
		actionRows.push(actionRow);
	}

	const embed = new Discord.EmbedBuilder()
		.setTitle("Who is this deity ?")
		.setDescription("You have 40 seconds to answer using the buttons below.")
		.setColor(Discord.Colors.DarkOrange)

	const message = await CommandInteraction.reply({
		embeds: [embed],
		files: [{
			attachment: croppedImage,
			name: 'GoBackOnDiscordAndStopTryingToCheat.png'
		}],
		fetchReply: true,
	});

	const buttonMessage = await CommandInteraction.channel.send({
		content: "_ _",
		components: actionRows
	})

	await message.react("\u23F3");
	await message.react('4️⃣');
	await message.react('0️⃣');
	let timeLeft = 40;

	const cooldown = setInterval(async () => {
		timeLeft -= 5;

		if (timeLeft >= 10) {

			await message.reactions.cache
				.filter(reaction => [
					String.fromCharCode(0x30 + Math.floor((timeLeft + 5) % 10)) + '️⃣',
					String.fromCharCode(0x30 + Math.floor((timeLeft + 5) / 10)) + '️⃣']
					.includes(reaction.emoji.name))
				.forEach(reaction => reaction.remove());
			await sleep(0.5);
			await message.react(String.fromCharCode(0x30 + Math.floor(timeLeft / 10)) + '️⃣');
			await message.react(String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
			//console.log(String.fromCharCode(0x30 + Math.floor(timeLeft / 10)) + '️⃣', String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
		} else if (timeLeft > 0) {
			await message.reactions.cache
				.filter(reaction => [
					String.fromCharCode(0x30 + Math.floor((timeLeft + 5) % 10)) + '️⃣',
					String.fromCharCode(0x30 + Math.floor((timeLeft + 5) / 10)) + '️⃣']
					.includes(reaction.emoji.name))
				.forEach(reaction => reaction.remove());
			await sleep(0.5);
			await message.react(String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
			//console.log(String.fromCharCode(0x30 + Math.floor(timeLeft % 10)) + '️⃣');
		}

		if (timeLeft <= 0) {
			clearInterval(cooldown);
			buttonMessage.delete()
			await message.reactions.removeAll();
			await message.react('❌');
			embed
				.setTitle("You ran out of time.")
				.setDescription(`The answer was : ${godAnswer}`)
				.setColor(Discord.Colors.Red)
			await CommandInteraction.editReply({
				embeds: [embed],
			});
		}
	}, 5000);

	const collector = new Discord.InteractionCollector(CommandInteraction.client, {
		message: buttonMessage,
		componentType: Discord.ComponentType.Button,
		time: 40000
	});

	collector.on('collect', async userPressedButton => {
		if (userPressedButton.customId == godAnswer) {
			clearInterval(cooldown);
			buttonMessage.delete()
			await sleep(1);
			await message.reactions.removeAll();
			await message.react('✅');
			embed
				.setTitle(`${userPressedButton.member.displayName} is right !`)
				.setDescription(`The answer was : ${godAnswer}`)
				.setColor(Discord.Colors.Red)
			await CommandInteraction.editReply({
				embeds: [embed],
			});
		}
		else {
			const rowOfWrongButton = userPressedButton.message.components.find(actionRow =>
				actionRow.components.some(component => component.customId === userPressedButton.customId));
			const wrongButtonIndex = rowOfWrongButton.components
				.findIndex(component => component.customId === userPressedButton.customId);
			rowOfWrongButton.components.splice(wrongButtonIndex, 1);
			if (rowOfWrongButton.components.length === 0) {
				const messageComponents = userPressedButton.message.components;
				const rowIndex = messageComponents.findIndex(actionRow => actionRow === rowOfWrongButton);
				messageComponents.splice(rowIndex, 1);
			}
			await userPressedButton.update({
				components: userPressedButton.message.components
			});
		}
	})
}

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('challenge')
		.setDescription('Merlin will challenge your Smite knowledge.'),

	async execute(CommandInteraction) {
		console.log(`${color.cyan}[command]	${color.magenta}/challenge ${color.white}was fired by ${color.blue}${CommandInteraction.user.tag}.${color.stop}`);
		try {
			playDeityImage(CommandInteraction);
		} catch (error) {
			console.log(error);
			CommandInteraction.reply('An error occured. Please try again in a couple seconds, or contact ./BenJ#5533');
		}
	}
}