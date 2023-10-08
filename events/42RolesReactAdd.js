const Discord = require("discord.js");
const clr = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.MessageReactionAdd,	// Triggers when any reaction is added
	async execute(reaction, user) {

		if (user.id === reaction.message.client.user.id)	// Checks if the reaction was added by the bot, if so, do nothing and return.
			return ;
			
		if (reaction.message.id === "1122621252151033890") {	// Checks if the reaction was added to the target's message reactions (42RoleMessage)

			const guild = reaction.message.guild;	// Store the discord server where the triggering happend (guild)
			const reactUser = guild.members.cache.get(user.id);	// Store the user who removed a reaction

			if (reaction.emoji.name === "overwatch") {	// Checks the reaction name
				const overwatchRoleId = "1122612244170162206"	// Id of the corresponding role
				const overwatchRole = guild.roles.cache.get(overwatchRoleId);	// Gets and stores the role
				if (reactUser && overwatchRole) {
					reactUser.roles.add(overwatchRole)	// Give the user the corresponding role. Console.log it, and log any errors. (User already possessing the role doesn't do anything)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"OverWatch"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Overwatch* t'as été donné.");
				}
			}

			/* Same code for each reaction emoji and its corresponding role */
			if (reaction.emoji.name === "vrising") {
				const vrisingRoleId = "1117865209596489840"
				const vrisingRole = guild.roles.cache.get(vrisingRoleId);
				if (reactUser && vrisingRole) {
					reactUser.roles.add(vrisingRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"Vrising"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *VRising* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "minecraft") {
				const minecraftRoleId = "1122612357722558617"
				const minecraftRole = guild.roles.cache.get(minecraftRoleId);
				if (reactUser && minecraftRole) {
					reactUser.roles.add(minecraftRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle "Minecraft".${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Minecraft* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "rocketleague") {
				const rocketleagueRoleId = "1122612309701955605"
				const rocketleagueRole = guild.roles.cache.get(rocketleagueRoleId);
				if (reactUser && rocketleagueRole) {
					reactUser.roles.add(rocketleagueRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"RocketLeague"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *RocketLeague* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "leagueoflegends") {
				const leagueoflegendsRoleId = "1123731753706733649"
				const leagueoflegendsRole = guild.roles.cache.get(leagueoflegendsRoleId);
				if (reactUser && leagueoflegendsRole) {
					reactUser.roles.add(leagueoflegendsRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"LeagueOfLegends"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *LeagueOfLegends* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "valorant") {
				const valorantRoleId = "1123731926050668714"
				const valorantRole = guild.roles.cache.get(valorantRoleId);
				if (reactUser && valorantRole) {
					reactUser.roles.add(valorantRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"Valorant"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Valorant* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "browsergames") {
				const browserGamesRoleId = "1123993655473082530"
				const browserGamesRole = guild.roles.cache.get(browserGamesRoleId);
				if (reactUser && browserGamesRole) {
					reactUser.roles.add(browserGamesRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"BrowserGames"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *BrowserGames* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "riskofrain") {
				const riskofrainRoleId = "1125527220509749348"
				const riskofrainRole = guild.roles.cache.get(riskofrainRoleId);
				if (reactUser && riskofrainRole) {
					reactUser.roles.add(riskofrainRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"RiskOfRain"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *RiskOfRain* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "civilisationvi") {
				const civRoleId = "1126216792528920637"
				const civRole = guild.roles.cache.get(civRoleId);
				if (reactUser && civRole) {
					reactUser.roles.add(civRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"CivilisationVI"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *CivilisationVI* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "terraria") {
				const terrariaRoleId = "1126211347277955102"
				const terrariaRole = guild.roles.cache.get(terrariaRoleId);
				if (reactUser && terrariaRole) {
					reactUser.roles.add(terrariaRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"Terraria"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *Terraria* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "speedrunners") {
				const speedRunnersRoleId = "1128753262946955304"
				const speedRunnersRole = guild.roles.cache.get(speedRunnersRoleId);
				if (reactUser && speedRunnersRole) {
					reactUser.roles.add(speedRunnersRole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle ${clr.whi}"SpeedRunners"${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *SpeedRunners* t'as été donné.");
				}
			}

			if (reaction.emoji.name === "GTFO") {
				const GTFORoleId = "1160566739441033318"
				const GTFORole = guild.roles.cache.get(GTFORoleId);
				if (reactUser && GTFORole) {
					reactUser.roles.add(GTFORole)
						.then(console.log(`${clr.cya}[comd]	${clr.blu}${user.username} selected the rôle "GTFO".${clr.stop}`))
						.catch(console.error);
					reactUser.send("Le rôle *GTFO* t'as été donné.");
				}
			}
		}
	},
};