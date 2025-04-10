const Discord = require("discord.js");

module.exports = {
	name: Discord.Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;

		if (message.channel.id !== "923586006094065684") return;

		try {
			await message.react("🎉");
			await message.react("✅");
			await message.react("🥳");
			await message.react("💯");
			await message.react("🎊");
			await message.react("🥂");
			await message.react("🎇");
			await message.react("👑");
			await message.react("🤩");
			await message.react("🥇");
			await message.react("🙌");
			await message.react("🎂");
			await message.react("🎯");
			await message.react("💪");
			await message.react("💥");
			await message.react("🏆");
			await message.react("😎");
			await message.react("👌");
			await message.react("💋");
			await message.react("🥹");
		} catch (error) {
			console.error(`[MessageCreate] Erreur en ajoutant une réaction :`, error);
		}
	},
};