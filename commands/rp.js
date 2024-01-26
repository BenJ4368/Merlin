const Discord = require('discord.js');
const config = require("../config");
const clr = require("../resources/color_codes");
const rpData = require("../resources/rp_data");

function RP_StartSession(interaction)
{
	console.log(`${clr.cya}[RP]	${clr.mag}/rp start${clr.whi} was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
		
	if ( rpData.getStatus() == 0 ) {	// Checks if no session is already running

		console.log(`${clr.cya}[RP]	${clr.grn}RP session started${clr.stop}`);
		rpData.startSession(interaction.user);
		interaction.reply({ content: "Début de la session de jdr." });
	}
	else	// If a session is already running, stop here.
	{
		console.log(`${clr.cya}[RP]	${clr.mag}/rp start${clr.whi} session already running${clr.stop}`);
		interaction.reply({ content: "Une session est déjà en cours et j'ai oublier le sort de dédoublement.\nTu vas devoir attendre."});
	}
}

function RP_StopSession(interaction)
{
	console.log(`${clr.cya}[RP]	${clr.mag}/rp stop ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
	
	if ( interaction.user.id == rpData.getGameMaster().id ) { // Only the gameMaster can end the session.
		if ( rpData.getStatus() == 1 ) {	// Checks if a session is running

			console.log(`${clr.cya}[RP]	${clr.yel}RP session stopped${clr.stop}`);
			rpData.stopSession();
			interaction.reply({ content: "Fin de la session de jdr." });
		}
		else	// If no session is running, stop here.
		{
			console.log(`${clr.cya}[RP]	${clr.mag}/rp stop${clr.whi} no session running${clr.stop}`);
			rpData.stopSession();
			interaction.reply({ content: "Mais de quelle jdr tu parles ?\nT'es sûr que ça va ?"});
		}
	}
	else {	// user is not the gameMaster
		interaction.reply({ content: "Seul le Maître du Jeu peut vous liberez." });
		console.log(`${clr.cya}[RP]	${clr.mag}/reload ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
	}

}
/*
function RP_1d10(interaction)
{
	
}*/


module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('rp')
		.setDescription('Commands used in role playing sessions')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('Choose an action')
				.setRequired(true)
				.addChoices(
					{ name: 'START', value: 'start' },
					{ name: 'STOP', value: 'stop' },
					{ name: '1d10', value: '1d10' },
					{ name: '1d20', value: '1d20' },
					{ name: '1d100', value: '1d100' },
				)),

	async execute(interaction)
	{
		switch (interaction.options.getString('action')) {
			case 'start':
				RP_StartSession(interaction);
				break;
			case 'stop':
				RP_StopSession(interaction);
				break;
			case '1d10':
				RP_1d10(interaction);
				break;
			case '1d20':
				RP_1d20(interaction);
				break;
			case '1d100':
				RP_1d100(interaction);
				break;
			default:
				interaction.reply("Erreur:	J'ai fait un infarctus");
				break;
		}
	}
}