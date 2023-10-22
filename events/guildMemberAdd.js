const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		const targetChannel = member.guild.channels.cache.find(channel => channel.id === '1122112439849328651');

		if (targetChannel) {
			targetChannel.send(`## Bienvenue ${member}, :wave:\n**[Viens me voir](https://discord.com/channels/1117863871827431434/1121929529003364452/1122621252151033890) dès que possible**.\n N'hésite pas ensuite à mentionner les rôles de jeux, poser des questions, organiser des events, lancer des sorts, combattre des momies, escalader la Tour Eiffel ou laver un singe à l'eau de vaisselle...`);

			const studRoleId = "1162504451953791087";
			const studRole = member.guild.roles.cache.get(studRoleId);
			member.roles.add(studRole).then(() => console.log(`${clr.cya}[+mbr]    ${clr.grn}${member.displayName} joined.${clr.stop}`)).catch(console.error);
		} else {
			console.error("Target channel not found");
		}
	},
};