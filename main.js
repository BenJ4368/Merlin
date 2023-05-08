const Discord = require("discord.js");
const config = require("./config");
const fs = require('node:fs');
const color = require("./resources/color_codes");

const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});



bot.commands = new Discord.Collection();

fs.readdirSync("./commands").filter(files =>
	files.endsWith(".js")).forEach(file => {
		const command = require(`./commands/${file}`);
		bot.commands.set(command.data.name, command);

		console.log(`${color.cyan}[Loader]	${color.yellow}${file.slice
			(0, file.length - 3)}${color.white} is operational.${color.cyan}`);
	}
);



fs.readdirSync("./events").filter(files =>
	files.endsWith(".js")).forEach(file => {
		const event = require(`./events/${file}`);
		if (event.one)
			bot.once(event.name, (...args) => event.execute(...args));
		else
			bot.on(event.name, (...args) => event.execute(...args));
	}
);

bot.login(config.token);
