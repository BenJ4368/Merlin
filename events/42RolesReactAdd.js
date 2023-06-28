const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.MessageReactionAdd,
	async execute(reaction, user) {

		if (user.id === reaction.message.client.user.id)
			return ;
			
		if (reaction.message.id === "1122621252151033890") {

			const guild = reaction.message.guild;
			const reactUser = guild.members.cache.get(user.id);

			if (reaction.emoji.name === "overwatch") {
				const overwatchRoleId = "1122612244170162206"
				const overwatchRole = guild.roles.cache.get(overwatchRoleId);
				if (reactUser && overwatchRole) {
					reactUser.roles.add(overwatchRole)
						.then(console.log(`${color.cyan}[42RRAdd]	${color.blue}${user.username} ${color.green}selected${color.white} the rôle "OverWatch".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "vrising") {
				const vrisingRoleId = "1117865209596489840"
				const vrisingRole = guild.roles.cache.get(vrisingRoleId);
				if (reactUser && vrisingRole) {
					reactUser.roles.add(vrisingRole)
						.then(console.log(`${color.cyan}[42RRAdd]	${color.blue}${user.username} ${color.green}selected${color.white} the rôle "Vrising".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "minecraft") {
				const minecraftRoleId = "1122612357722558617"
				const minecraftRole = guild.roles.cache.get(minecraftRoleId);
				if (reactUser && minecraftRole) {
					reactUser.roles.add(minecraftRole)
						.then(console.log(`${color.cyan}[42RRAdd]	${color.blue}${user.username} ${color.green}selected${color.white} the rôle "Minecraft".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "rocketleague") {
				const rocketleagueRoleId = "1122612309701955605"
				const rocketleagueRole = guild.roles.cache.get(rocketleagueRoleId);
				if (reactUser && rocketleagueRole) {
					reactUser.roles.add(rocketleagueRole)
						.then(console.log(`${color.cyan}[42RRAdd]	${color.blue}${user.username} ${color.green}selected${color.white} the rôle "RocketLeague".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "leagueoflegends") {
				const leagueoflegendsRoleId = "1123731753706733649"
				const leagueoflegendsRole = guild.roles.cache.get(leagueoflegendsRoleId);
				if (reactUser && leagueoflegendsRole) {
					reactUser.roles.add(leagueoflegendsRole)
						.then(console.log(`${color.cyan}[42RRAdd]	${color.blue}${user.username} ${color.green}selected${color.white} the rôle "LeagueOfLegends".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "valorant") {
				const valorantRoleId = "1123731926050668714"
				const valorantRole = guild.roles.cache.get(valorantRoleId);
				if (reactUser && valorantRole) {
					reactUser.roles.add(valorantRole)
						.then(console.log(`${color.cyan}[42RRAdd]	${color.blue}${user.username} ${color.green}selected${color.white} the rôle "Valorant".${color.stop}`))
						.catch(console.error);
				}
			}
		}
	},
};