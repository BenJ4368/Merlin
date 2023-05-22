const Discord = require("discord.js");
const color = require("../resources/color_codes");

module.exports = {
	name: Discord.Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isChatInputCommand())
			return;

		const bot = interaction.client;
		let command = bot.commands.get(interaction.commandName);

		if (!command) {
			command = bot.adminCommands.get(interaction.commandName);
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
				await interaction.followUp({ content: `${color.cyan}[InteractionCreate]	${color.red}Error while executing ${color.yellow}${interaction.commandName}${color.stop}`, ephemeral: true});
		}
	},
};