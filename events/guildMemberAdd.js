const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.ClientReady,
	execute(member) {
		const targetChannel = member.guild.channels.cache.find((channel) => channel.id === '1118450787450892311');

		targetChannel.send(`## Bienvenue ${member} !\nSelectionne tes jeux [ici](https://discord.com/channels/1117863871827431434/1121929529003364452)`);
	},
};