const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isChatInputCommand())
			return;

		const bot = interaction.client;
		const command = bot.commands.get(interaction.commandName);

		if (!command)
		{
			console.error(`${color.cyan}[InteractionCreate]	${color.red}No command matching ${color.yellow}${interaction.commandName} ${color.red}was found.${color.stop}`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred)
				await interaction.followUp({ content: `${color.cyan}[InteractionCreate]	${color.red}Error while executing ${color.yellow}${interaction.commandName}${color.stop}`, ephemeral: true});
			else
				await interaction.reply({ content: `${color.cyan}[InteractionCreate]	${color.red}Error while executing ${color.yellow}${interaction.commandName}${color.stop}`, ephemeral: true});
		}
	},
};