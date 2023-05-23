const config = require("../config");
const Hirez = require('@joshmiquel/hirez');
const color = require("../resources/color_codes")
const fs = require('fs');
const Jimp = require('jimp');
const fetch = require('node-fetch');
const readline = require('readline');

async function dlskins() {
	try {
		const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
		const gods = await hirez.getGods();

		if (!fs.existsSync('./resources/gods'))
			fs.mkdirSync('./resources/gods');

		for (const god of gods) {

			await new Promise((resolve) => {
				const prompt = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				});

				prompt.question(`${color.cyan}[dlskins] ${color.lime}Start downloading ${god.Name}'s skins? (y/any)${color.stop}`,
					(promptAnswer) => {
						prompt.close();
						if (promptAnswer.toLocaleLowerCase() === 'y')
							resolve();
					});
			})
			try {
				const godFolderPath = `./resources/gods/${god.Name}`;
				const skinsFolderPath = `${godFolderPath}/skins`;

				if (!fs.existsSync(godFolderPath))
					fs.mkdirSync(godFolderPath);

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
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}downloading error: ${color.yellow}${error.message}${color.stop}`);
								});
						}
						else {
							try {
								const image = await Jimp.read(savePath);
								if (image.getWidth() >= 250 && image.getHeight() >= 250) {
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.green}is valid.${color.stop}`);
								} else {
									console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}is not valid. ${color.yellow}Deleting...${color.stop}`);
									fs.unlinkSync(savePath);
									console.log(`${color.cyan}[dlskins] ${color.red}${fileName} deleted.${color.stop}`);
								}
							} catch (error) {
								console.log(`${color.cyan}[dlskins] ${color.white}${fileName} ${color.red}is not valid :\n ${color.yellow}${error}${color.stop}`);
								fs.unlinkSync(savePath);
								console.log(`${color.cyan}[dlskins] ${color.red}${fileName} deleted.${color.stop}`);
							}
						}
					}
				}
			} catch (error) {
				console.log(`${color.cyan}[dlskins] ${color.white}${god.Name} ${color.red}${error}${color.stop}`)
			}
		}
		console.log(`${color.cyan}[dlskins] ${color.green}is over.${color.stop}`)
	} catch (error) {
		console.log(error);
	}
}
dlskins().then(() => console.log(`${color.cyan}[dlskins] ${color.green}is over.${color.stop}`));
