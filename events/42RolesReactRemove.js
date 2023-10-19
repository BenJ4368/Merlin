const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.MessageReactionRemove,	// Triggers when any reaction is removed
	async execute(reaction, user) {

		if (user.id === reaction.message.client.user.id) // Checks if the reaction was removed by the bot, if so, do nothing and return.
			return ;
			
		if (reaction.message.id === "1122621252151033890") {	// Checks if the reaction was removed from the target's message reactions (42RoleMessage)

			const guild = reaction.message.guild;	// Store the discord server where the triggering happend (guild)
			const reactUser = guild.members.cache.get(user.id);	// Store the user who removed a reaction

			if (reaction.emoji.name === "overwatch") {	// Checks the reaction name
				const overwatchRoleId = "1122612244170162206"	// Id of the corresponding role
				const overwatchRole = guild.roles.cache.get(overwatchRoleId);	// Gets and stores the role
				if (reactUser && overwatchRole) {
					if (reactUser.roles.cache.has(overwatchRoleId)) { // Id the user has the corresponding role, take it away. Console.log it, and log any errors.
						reactUser.roles.remove(overwatchRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"OverWatch"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *Overwatch* t'as été retiré.");
					}
				}
			}

			/* Same code for each reaction emoji and its corresponding role */
			if (reaction.emoji.name === "vrising") {
				const vrisingRoleId = "1117865209596489840"
				const vrisingRole = guild.roles.cache.get(vrisingRoleId);
				if (reactUser && vrisingRole) {
					if (reactUser.roles.cache.has(vrisingRoleId)) {
						reactUser.roles.remove(vrisingRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"Vrising"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *VRising* t'as été retiré.");
					}
				}
			}

			if (reaction.emoji.name === "minecraft") {
				const minecraftRoleId = "1122612357722558617"
				const minecraftRole = guild.roles.cache.get(minecraftRoleId);
				if (reactUser && minecraftRole) {
					if (reactUser.roles.cache.has(minecraftRoleId)) {
						reactUser.roles.remove(minecraftRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"Minecraft"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *Minecraft* t'as été retiré.");
					}
				}
			}

			if (reaction.emoji.name === "rocketleague") {
				const rocketleagueRoleId = "1122612309701955605"
				const rocketleagueRole = guild.roles.cache.get(rocketleagueRoleId);
				if (reactUser && rocketleagueRole) {
					if (reactUser.roles.cache.has(rocketleagueRoleId)) {
						reactUser.roles.remove(rocketleagueRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"RocketLeague"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *RocketLeague* t'as été retiré.");
					}
				}
			}

			if (reaction.emoji.name === "leagueoflegends") {
				const leagueoflegendsRoleId = "1123731753706733649"
				const leagueoflegendsRole = guild.roles.cache.get(leagueoflegendsRoleId);
				if (reactUser && leagueoflegendsRole) {
					reactUser.roles.remove(leagueoflegendsRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"LeagueOfLegends"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *LeagueOfLegends* t'as été retiré.");
				}
			}

			if (reaction.emoji.name === "valorant") {
				const valorantRoleId = "1123731926050668714"
				const valorantRole = guild.roles.cache.get(valorantRoleId);
				if (reactUser && valorantRole) {
					reactUser.roles.remove(valorantRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"Valorant"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Valorant* t'as été retiré.");
				}
			}

			if (reaction.emoji.name === "browsergames") {
				const browserGamesRoleId = "1123993655473082530"
				const browserGamesRole = guild.roles.cache.get(browserGamesRoleId);
				if (reactUser && browserGamesRole) {
					reactUser.roles.remove(browserGamesRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"BrowserGames"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *BrowserGames* t'as été retiré.");
				}
			}

			if (reaction.emoji.name === "riskofrain") {
				const riskofrainRoleId = "1125527220509749348"
				const riskofrainRole = guild.roles.cache.get(riskofrainRoleId);
				if (reactUser && riskofrainRole) {
					reactUser.roles.remove(riskofrainRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"RiskOfRain"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *RiskOfRain* t'as été retiré.");
				}
			}

			if (reaction.emoji.name === "civilisationvi") {
				const civRoleId = "1126216792528920637"
				const civRole = guild.roles.cache.get(civRoleId);
				if (reactUser && civRole) {
					reactUser.roles.remove(civRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"CivilisationVI"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *CivilisationVI* t'as été retiré.");
				}
			}

			if (reaction.emoji.name === "terraria") {
				const terrariaRoleId = "1126211347277955102"
				const terrariaRole = guild.roles.cache.get(terrariaRoleId);
				if (reactUser && terrariaRole) {
					reactUser.roles.remove(terrariaRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"Terraria"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Terraria* t'as été retiré.");
				}
			}

			if (reaction.emoji.name === "speedrunners") {
				const speedRunnersRoleId = "1128753262946955304"
				const speedRunnersRole = guild.roles.cache.get(speedRunnersRoleId);
				if (reactUser && speedRunnersRole) {
					reactUser.roles.remove(speedRunnersRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"SpeedRunners"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *SpeedRunners* t'as été retiré.");
				}
			}

			if (reaction.emoji.name === "GTFO") {
				const GTFORoleId = "1160566739441033318"
				const GTFORole = guild.roles.cache.get(GTFORoleId);
				if (reactUser && GTFORole) {
					if (reactUser.roles.cache.has(GTFORoleId)) {
						reactUser.roles.remove(GTFORole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"GTFO"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *GTFO* t'as été retiré.");
					}
				}
			}

			if (reaction.emoji.name === "smite") {
				const smiteRoleId = "1162460348381663292"
				const smiteRole = guild.roles.cache.get(smiteRoleId);
				if (reactUser && smiteRole) {
					if (reactUser.roles.cache.has(smiteRoleId)) {
						reactUser.roles.remove(smiteRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"smite"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *Smite* t'as été retiré.");
					}
				}
			}

			if (reaction.emoji.name === "supersmashbros") {
				const supersmashbrosRoleId = "1164623682510000258"
				const supersmashbrosRole = guild.roles.cache.get(supersmashbrosRoleId);
				if (reactUser && supersmashbrosRole) {
					if (reactUser.roles.cache.has(supersmashbrosRoleId)) {
						reactUser.roles.remove(supersmashbrosRole)
							.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} unselected the rôle ${clr.whi}"SuperSmashBros"${clr.stop}`))
							.catch(console.error);
						reactUser.send("Le rôle *SuperSmashBros* t'as été retiré.");
					}
				}
			}

		}
	},
};