const Discord = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } = require('@discordjs/voice');
const config = require("../config");
const Jimp = require('jimp');
const clr = require("../resources/color_codes");
const rpData = require("../resources/rp_data");

function RP_help(interaction)
{
	console.log(`${clr.cya}[RP]	${clr.mag}/rp help${clr.whi} was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);

	let embed = new Discord.EmbedBuilder()
		.setTitle(`List of /rp commands :`)
		.addFields(
			{ name: 'START', value: 'Starts a RolePlaying game session.\n\
									The user entering the command will be GameMaster.' },
			{ name: 'STOP', value: 'Stops a RolePlaying game session.\n\
									Only the session\'s GameMaster can stop the session.' },
			{ name: '1d4 | 1d10 | 1d20 | 1d100', value: 'Rolls a dice. (1-n)' },
			//{ name: '\u200B', value: '\u200B' },
		)
		.setColor(Discord.Colors.White)
	
	interaction.reply( { embeds: [embed], } );
}

let RP_role;
let RP_channelCategory;
let RP_channelVoice;
let RP_channelText;
let RP_threadCharacters;
let RP_threadDiceRolls;
let RP_voiceConnection;
let RP_soundBox;

const RP_soundPlayerDeath = './resources/rp/sounds/player_died.mp3';
const RP_soundPlayerHurt = './resources/rp/sounds/player_hurt.mp3';
const RP_soundPlayerHeal = './resources/rp/sounds/player_heal.mp3';
const RP_soundDiceRolling = './resources/rp/sounds/dice_rolling.mp3';
const RP_soundDiceSuccess = './resources/rp/sounds/dice_success.mp3';
const RP_soundDiceFailure = './resources/rp/sounds/dice_failure.mp3';
const RP_soundDiceCritSuccess = './resources/rp/sounds/dice_crit_success.mp3';
const RP_soundDiceCritFailure = './resources/rp/sounds/dice_crit_failure.mp3';

async function RP_startSession(interaction)
{
	if ( rpData.getStatus() == 0 ) {	// Checks if no session is already running

		rpData.startSession(interaction.guild.members.cache.get(interaction.user.id));
		interaction.deferReply();

		const everyoneRole = interaction.guild.roles.everyone;
		RP_role = await interaction.guild.roles.create({
			data: {
				name: 'rp_role',
				color: 'RANDOM',
			},
		});
		rpData.getGameMaster().roles.add(RP_role);

		RP_channelCategory = interaction.guild.channels.cache
							.find(channel => channel.name === 'RP_category' && channel.type === 'GUILD_CATEGORY');
		if (!RP_channelCategory)
		{
			RP_channelCategory = await interaction.guild.channels.create({
				name: 'RP_category',
				type: Discord.ChannelType.GuildCategory,
			});
			RP_channelCategory.setPosition(0);
			RP_channelCategory.permissionOverwrites.create(everyoneRole, { ViewChannel: false });
			RP_channelCategory.permissionOverwrites.create(RP_role, { ViewChannel: true });
		}

		RP_channelVoice = await interaction.guild.channels.create({
			name: 'RP_vocal',
			type: Discord.ChannelType.GuildVoice,
			parent: RP_channelCategory,
		});

		RP_channelText = await interaction.guild.channels.create({
			name: 'RP_text',
			type: Discord.ChannelType.GuildText,
			parent: RP_channelCategory,
		});

		RP_threadCharacters = await RP_channelText.threads.create({
			name: 'RP_Characters',
			autoArchiveDuration: null,
		});

		RP_threadDiceRolls = await RP_channelText.threads.create({
			name: 'RP_DiceRolls',
			autoArchiveDuration: null,
		});

		RP_voiceConnection = joinVoiceChannel({
			channelId: RP_channelVoice.id,
			guildId: RP_channelVoice.guild.id,
			adapterCreator: RP_channelVoice.guild.voiceAdapterCreator,
		});

		RP_soundBox = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});
		RP_voiceConnection.subscribe(RP_soundBox);

		interaction.editReply({ content: `${interaction.user.username} est le Maître du jeu pour cette session.` });
		console.log(`${clr.cya}[RP]	${clr.grn}RP session started by ${interaction.user.username}${clr.stop}`);
	}
	else	// If a session is already running, stop here.
	{
		interaction.reply({ content: `${interaction.user.username} est Maître d'une session en cours.\nTu vas devoir attendre.`});
		console.log(`${clr.cya}[RP]	${clr.mag}/rp start${clr.whi} session already running${clr.stop}`);
	}
}

function RP_stopSession(interaction, admin)
{
	if ( rpData.getStatus() == 1 ) { // Checks if a session is running

		if ( interaction.user.id == rpData.getGameMaster().id 
			|| (config.adminIds.includes(interaction.user.id) && admin == true)) {	// Only the gameMaster can end the session. (or admin ofc)

			console.log(`${clr.cya}[RP]	${clr.yel}RP session stopped by ${interaction.user.username}${clr.stop}`);
			rpData.stopSession();

			RP_channelVoice.delete();
			RP_channelText.delete();
			RP_role.delete();

			interaction.reply({ content: `${interaction.user.username} a mis fin à sa session de jdr.` });
		}
		else	// user is not the gameMaster
		{
			interaction.reply({ content: `Seul ${rpData.getGameMaster().username}, le Maître du Jeu, peut mettre fin à sa session de jdr.` });
			console.log(`${clr.cya}[RP]	${clr.mag}/rp stop ${clr.whi}acces was denied to ${clr.blu}${interaction.user.username}${clr.stop}`);
		}
	}
	else {	// If no session is running, stop here.
		console.log(`${clr.cya}[RP]	${clr.mag}/rp stop${clr.whi} no session running${clr.stop}`);
			interaction.reply({ content: "Mais de quelle jdr tu parles ?\nT'es sûr que ça va ?"});
	}

}

async function RP_diceRoll(interaction, max)
{
	if ( rpData.getStatus() == 1 )
	{
		if (interaction.channel == RP_threadDiceRolls) {
			let diceRoll = Math.floor(Math.random() * max) + 1;
			
			let rollColor;
			let rollSound;
			if (diceRoll > max / 2) {
				rollColor = Discord.Colors.DarkGreen;
				rollSound = RP_soundDiceSuccess;
				if (diceRoll == max) {
					rollColor = Discord.Colors.Green;
					rollSound = RP_soundDiceCritSuccess;
				}
			}
			else {
				rollColor = Discord.Colors.Yellow;
				rollSound = RP_soundDiceFailure;
				if (diceRoll == 1) {
					rollColor = Discord.Colors.Red;
					rollSound = RP_soundDiceCritFailure;
				}
			}


			let embed = new Discord.EmbedBuilder()
				.setTitle(`1d${max}:				${diceRoll}`)
				.setColor(rollColor);

			await interaction.deferReply();
			RP_soundBox.play(createAudioResource(RP_soundDiceRolling));
			
				setTimeout(async () => {
					RP_soundBox.play(createAudioResource(rollSound));
					await interaction.editReply({
						embeds: [embed],
					})
				}, 3000);
		}
		else {
			interaction.reply({ content: `Lance plutôt les dés dans le thread dédié:	${RP_threadDiceRolls}` })
		}
	}
	else
	{
		interaction.reply({ content: `Aucune session en cours.\nPour effectuer les actions des commandes /rp, vous avez besoin d'une session`});
	}

}

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('rp')
		.setDescription('Commands used in role playing sessions')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('Choose an action')
				.setRequired(true)
				.addChoices(
					{ name: 'HELP', value: 'help' },
					{ name: 'START', value: 'start' },
					{ name: 'STOP', value: 'stop' },
					{ name: 'AdminSTOP', value: 'adminstop' },
					{ name: '1d4', value: '1d4' },
					{ name: '1d10', value: '1d10' },
					{ name: '1d20', value: '1d20' },
					{ name: '1d100', value: '1d100' },
				)),

	async execute(interaction)
	{
		switch (interaction.options.getString('action')) {
			case 'help':
				RP_help(interaction)
				break;
			case 'start':
				console.log(`${clr.cya}[RP]	${clr.mag}/rp start${clr.whi} was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
				RP_startSession(interaction);
				break;
			case 'stop':
				console.log(`${clr.cya}[RP]	${clr.mag}/rp stop ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
				RP_stopSession(interaction, false);
				break;
			case 'adminstop':
				console.log(`${clr.cya}[RP]	${clr.mag}/rp adminstop ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
				RP_stopSession(interaction, true);
				break;
			case '1d4':
				console.log(`${clr.cya}[RP]	${clr.mag}/rp 1d4 ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
				RP_diceRoll(interaction, 4);
				break;
			case '1d10':
				console.log(`${clr.cya}[RP]	${clr.mag}/rp 1d10 ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
				RP_diceRoll(interaction, 10);
				break;
			case '1d20':
				console.log(`${clr.cya}[RP]	${clr.mag}/rp 1d20 ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
				RP_diceRoll(interaction, 20);
				break;
			case '1d100':
				console.log(`${clr.cya}[RP]	${clr.mag}/rp 1d100 ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
				RP_diceRoll(interaction, 100);
				break;
			default:
				interaction.reply("Erreur:	J'ai fait un infarctus");
				break;
		}
	}
}