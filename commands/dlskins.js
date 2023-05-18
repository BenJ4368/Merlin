const Discord = require('discord.js');
const config = require("../config");
const Hirez = require('@joshmiquel/hirez');
const fs = require('fs');
const axios = require('axios');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('dlskins')
		.setDescription('dl skins'),

	async execute(interaction)
	{
		try {
			const hirez = new Hirez.Smite(config.hirezDevId, config.hirezAuthKey);
			const gods = await hirez.getGods();
			let skinCount = 0;
			gods.forEach(async (god) => {
			  const godName = god.Name;
			  const godFolderPath = `./resources/gods/${godName}`;
			  const skinsFolderPath = `${godFolderPath}/skins`;
		
			  // Vérifier si le dossier du dieu existe, sinon le créer
			  if (!fs.existsSync(godFolderPath)) {
				fs.mkdirSync(godFolderPath);
			  }
		
			  // Vérifier si le dossier des skins existe, sinon le créer
			  if (!fs.existsSync(skinsFolderPath)) {
				fs.mkdirSync(skinsFolderPath);
			  }
		
			  const skins = await hirez.getGodSkins(god.id);
		
			  skins.forEach((skin) => {
				const skinURL = skin.godSkin_URL;
				skinCount++;
				if (skinURL) {
				  const fileName = skinURL.split('/').pop();
				  const savePath = `${skinsFolderPath}/${fileName}`;

				if (!fs.existsSync(savePath)) {
					axios({
						method: 'GET',
						url: skinURL,
						responseType: 'stream',
					})
						.then((response) => {
						response.data.pipe(fs.createWriteStream(savePath));
						console.log(`Le skin '${fileName}' du dieu '${godName}' a été téléchargé avec succès.`);
						})
						.catch((error) => {
						console.error(`Erreur lors du téléchargement du skin '${fileName}' du dieu '${godName}': ${error.message}`);
						});
					}
				}
			  });
			});
			console.log(skinCount);
			interaction.reply("done");
			console.log("FINI");
		} catch (error) {
			console.log(error);
			interaction.reply('An error occured while trying to acces the Hi-Rez API.');
		}
	}
}