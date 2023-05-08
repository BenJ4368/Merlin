const Discord = require("discord.js");
const config = require("./config");
const fs = require("fs");
const color = require("./resources/color_codes");

const commands = [];
const command_files = fs.readdirSync("./commands").filter(files => files.endsWith(".js"));

for (const file of command_files)
{
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new Discord.REST({ version: '10'}).setToken(config.token);

(async () => {
	try
	{
		const data = await rest.put(
				Discord.Routes.applicationCommands( config.clientId ),
				{ body: commands },
			);
		console.log(`${color.yellow}Successfully reloaded ${data.length} application (/) commands.${color.stop}`);
	}
	catch (error)
	{
		console.error(error);
	}
})();