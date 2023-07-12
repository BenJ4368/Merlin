const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.MessageReactionRemove,
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
					if (reactUser.roles.cache.has(overwatchRoleId)) {
						reactUser.roles.remove(overwatchRole)
							.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "OverWatch".${color.stop}`))
							.catch(console.error);
					}
				}
			}

			if (reaction.emoji.name === "vrising") {
				const vrisingRoleId = "1117865209596489840"
				const vrisingRole = guild.roles.cache.get(vrisingRoleId);
				if (reactUser && vrisingRole) {
					if (reactUser.roles.cache.has(vrisingRoleId)) {
						reactUser.roles.remove(vrisingRole)
							.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "Vrising".${color.stop}`))
							.catch(console.error);
					}
				}
			}

			if (reaction.emoji.name === "minecraft") {
				const minecraftRoleId = "1122612357722558617"
				const minecraftRole = guild.roles.cache.get(minecraftRoleId);
				if (reactUser && minecraftRole) {
					if (reactUser.roles.cache.has(minecraftRoleId)) {
						reactUser.roles.remove(minecraftRole)
							.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "Minecraft".${color.stop}`))
							.catch(console.error);
					}
				}
			}

			if (reaction.emoji.name === "rocketleague") {
				const rocketleagueRoleId = "1122612309701955605"
				const rocketleagueRole = guild.roles.cache.get(rocketleagueRoleId);
				if (reactUser && rocketleagueRole) {
					if (reactUser.roles.cache.has(rocketleagueRoleId)) {
						reactUser.roles.remove(rocketleagueRole)
							.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "RocketLeague".${color.stop}`))
							.catch(console.error);
					}
				}
			}

			if (reaction.emoji.name === "leagueoflegends") {
				const leagueoflegendsRoleId = "1123731753706733649"
				const leagueoflegendsRole = guild.roles.cache.get(leagueoflegendsRoleId);
				if (reactUser && leagueoflegendsRole) {
					reactUser.roles.remove(leagueoflegendsRole)
						.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "LeagueOfLegends".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "valorant") {
				const valorantRoleId = "1123731926050668714"
				const valorantRole = guild.roles.cache.get(valorantRoleId);
				if (reactUser && valorantRole) {
					reactUser.roles.remove(valorantRole)
						.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "Valorant".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "browsergames") {
				const browserGamesRoleId = "1123993655473082530"
				const browserGamesRole = guild.roles.cache.get(browserGamesRoleId);
				if (reactUser && browserGamesRole) {
					reactUser.roles.remove(browserGamesRole)
						.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "BrowserGames".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "riskofrain") {
				const riskofrainRoleId = "1125527220509749348"
				const riskofrainRole = guild.roles.cache.get(riskofrainRoleId);
				if (reactUser && riskofrainRole) {
					reactUser.roles.remove(riskofrainRole)
						.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "RiskOfRain".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "civilisationvi") {
				const civRoleId = "1126216792528920637"
				const civRole = guild.roles.cache.get(civRoleId);
				if (reactUser && civRole) {
					reactUser.roles.remove(civRole)
						.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "CivilisationVI".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "terraria") {
				const terrariaRoleId = "1126211347277955102"
				const terrariaRole = guild.roles.cache.get(terrariaRoleId);
				if (reactUser && terrariaRole) {
					reactUser.roles.remove(terrariaRole)
						.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "Terraria".${color.stop}`))
						.catch(console.error);
				}
			}

			if (reaction.emoji.name === "speedrunners") {
				const speedrunnersRoleId = "1128753262946955304"
				const speedrunnersRole = guild.roles.cache.get(speedrunnersRoleId);
				if (reactUser && speedrunnersRole) {
					reactUser.roles.remove(speedrunnersRole)
						.then(console.log(`${color.cyan}[42RRRemove]	${color.blue}${user.username} ${color.yellow}unselected${color.white} the rôle "speedrunners".${color.stop}`))
						.catch(console.error);
				}
			}
		}
	},
};