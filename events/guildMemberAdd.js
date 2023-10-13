const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.GuildMemberAdd,
	execute(member) {
		const targetChannel = member.guild.channels.cache.find((channel) => channel.id === '1118450787450892311');

		targetChannel.send(`## Bienvenue ${member}, :wave:\n**Va parler à [Merlin](https://discord.com/channels/1117863871827431434/1121929529003364452/1122621252151033890) dès que possible**,\ntu pourras ensuite mentionner tout les rôles de jeux pour savoir qui veux jouer.`);

		const studRoleId = "1122112439849328651";
		const studRole = member.guild.cache.get(studRoleId);
		member.roles.add(studRole).then(console.log(`${clr.cya}[+mbr]	${clr.grn}${user.username} joined.${clr.stop}`))
	},
};