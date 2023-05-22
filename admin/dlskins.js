const Discord = require('discord.js');
const config = require("../config");
const Hirez = require('@joshmiquel/hirez');
const color = require("../resources/color_codes")
const fs = require('fs');
const Jimp = require('jimp');
const fetch = require('node-fetch');
const color_codes = require('../resources/color_codes');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('dlskins')
		.setDescription('dl skins'),
	serverId: '881683007688282122',
	async execute(interaction) {
		try {
			interaction.reply("DLskin completed");
			const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
			const gods = await hirez.getGods();

			if (!fs.existsSync('./resources/gods')) {
				fs.mkdirSync('./resources/gods');
			}

			for (const god of gods) {
				const godName = god.Name;
				const godFolderPath = `./resources/gods/${godName}`;
				const skinsFolderPath = `${godFolderPath}/skins`;

				if (!fs.existsSync(godFolderPath)) {
					fs.mkdirSync(godFolderPath);
				}

				if (!fs.existsSync(skinsFolderPath)) {
					fs.mkdirSync(skinsFolderPath);
				}

				const skins = await hirez.getGodSkins(god.id);

				for (const skin of skins) {
					const skinURL = skin.godSkin_URL;
					if (skinURL) {
						const fileName = skinURL.split('/').pop();
						const savePath = `${skinsFolderPath}/${fileName}`;

						if (!fs.existsSync(savePath)) {
							fetch(skinURL)
								.then(async (response) => {
									const dest = fs.createWriteStream(savePath);
									response.body.pipe(dest);
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.green}was successfully downloaded.${color.stop}`);
								})
								.catch((error) => {
									console.error(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}downloading error: ${color.yellow}${error.message}${color.stop}`);
								});
						}
						else {
							try {
								const image = await Jimp.read(savePath);
								if (image.getWidth() >= 250 && image.getHeight() >= 250) {
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.green}is valid.${color.stop}\n${skinURL}`);
								} else {
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}is not valid. ${color.yellow}Re-downloading...${color.stop}`);
									fs.unlinkSync(savePath);
								}
							} catch (error) {
								fs.unlinkSync(savePath);
								console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}re-downloading error: ${color.yellow}${error.message}${color.stop}\n${skinURL}`);
								fetch(skinURL)
									.then(async (response) => {
										const dest = fs.createWriteStream(savePath);
										response.body.pipe(dest);
										console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.green}successfully ${color.yellow}re-downloaded.${color.stop}`);
								})
							}
						}
					}
				}
			}
			await Promise.all(promises);
		} catch (error) {
			console.log(error);
			interaction.reply('An error occurred while trying to access the Hi-Rez API.');
		}
	}
};