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

	async execute(interaction) {
		try {
			const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
			const gods = await hirez.getGods();
			const promises = [];
			const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
							promises.push(
								new Promise((resolve, reject) => {
									fetch(skinURL)
										.then(async (response) => {
											const dest = fs.createWriteStream(savePath);
											response.body.pipe(dest);
											await delay(250);
											console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.green}was successfully downloaded.${color.stop}`);
											resolve();
										})
										.catch((error) => {
											console.error(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}downloading error: ${color.yellow}${error.message}${color.stop}`);
											reject(error);
										});
								})
							);
						} else {
							try {
								const image = await Jimp.read(savePath);
								if (image.getWidth() >= 250 && image.getHeight() >= 250) {
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.green}is valid.${color.stop}\n${skinURL}`);
								} else {
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}is not valid. ${color.yellow}Re-downloading...${color.stop}`);
									fs.unlinkSync(savePath);
									promises.push(
										new Promise((resolve, reject) => {
											fetch(skinURL)
												.then(async (response) => {
													const dest = fs.createWriteStream(savePath);
													response.body.pipe(dest);
													await delay(250);
													console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.green}successfully ${color.yellow}re-downloaded.${color.stop}`);
													resolve();
												})
												.catch((error) => { reject(error) });
										})
									);
								}
							} catch (error) {
								console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}re-downloading error: ${color.yellow}${error.message}${color.stop}\n${skinURL}`);
								fs.unlinkSync(savePath);
								console.log(`/// ${savePath} supprimé///`);
							}
						}
					}
				}
			}
			interaction.reply("done");
			await Promise.all(promises);
		} catch (error) {
			console.log(error);
			interaction.reply('An error occurred while trying to access the Hi-Rez API.');
		}
	}
};