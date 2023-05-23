const Discord = require("discord.js");
const config = require("./config");
const fs = require('node:fs');
const color = require("./resources/color_codes");

const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });

bot.commands = new Discord.Collection();
bot.commandArray = [];
const reglarCommandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js") && !file.startsWith("_"))
if (reglarCommandFiles.length > 0) {
	reglarCommandFiles.forEach(file => {
		const command = require(`./commands/${file}`);
		bot.commands.set(command.data.name, command);
		bot.commandArray.push(command.data.toJSON());
		console.log(`${color.cyan}[Main]	${color.yellow}${file.slice(0, file.length - 3)} ${color.white} is operational.${color.cyan}`);
	}
	);

	const rest = new Discord.REST({ version: '10' }).setToken(config.token);
	(async () => {
		try {
			console.log(`${color.cyan}[Main]	${color.yellow}Trying to update application commands.${color.stop}`);
			const data = await rest.put(
				Discord.Routes.applicationCommands(config.clientId),
				{ body: bot.commandArray },
			);
			console.log(`${color.cyan}[Main]	${color.yellow}Successfully updated ${data.length} application commands.${color.stop}`);
		} catch (error) {
			console.error(error);
		}
	})();
}


bot.adminCommands = new Discord.Collection();
bot.adminCommandArray = [];
const adminCommandFiles = fs.readdirSync("./admin").filter(file => file.endsWith(".js") && !file.startsWith("_"));
if (adminCommandFiles.length > 0) {
	adminCommandFiles.forEach(file => {
		const command = require(`./admin/${file}`);
		bot.adminCommands.set(command.data.name, command);
		bot.adminCommandArray.push(command.data.toJSON());
		console.log(`${color.red}[Admin] ${color.yellow}${file.slice(0, file.length - 3)} ${color.white} is operational.${color.cyan}`);
	}
	);
	(async () => {
		try {
			console.log(`${color.red}[Admin]	${color.yellow}Trying to update admin commands.${color.stop}`);
			const data = await rest.put(
				Discord.Routes.applicationGuildCommands(config.clientId, config.adminGuildId),
				{ body: bot.adminCommandArray },
			);
			console.log(`${color.red}[Admin]	${color.yellow}Successfully updated ${data.length} admin commands.${color.stop}`);
		} catch (error) {
			console.error(error);
		}
	})();
}

fs.readdirSync("./events").filter(files =>
	files.endsWith(".js")).forEach(file => {
		const event = require(`./events/${file}`);
		if (event.one)
			bot.once(event.name, (...args) => event.execute(...args));
		else
			bot.on(event.name, (...args) => event.execute(...args));
	}
	);

/* Uncomment to delete ALL application commands*/
rest.put(Discord.Routes.applicationCommands(config.clientId),
	{ body: [] },
);
console.log(`${color.cyan}[Main]	${color.red}Deleted all application commands.${color.stop}`);


/* Uncomment to delete ALL admin commands commands*/
rest.put(Discord.Routes.applicationGuildCommands(config.clientId, config.adminGuildId),
	{ body: [] },
);
console.log(`${color.red}[Admin]	${color.red}Deleted all admin commands.${color.stop}`);



bot.login(config.token);
