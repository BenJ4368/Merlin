const Jimp = require('jimp');
const { EmbedBuilder } = require('discord.js');

class Imposteur {
	constructor() {
		this.name = 'Imposteur';
		this.description = 'Faites perdre la partie sans éveiller les soupçons de votre équipe.';
		this.color = '#ff0000';
	}

	getName() { return this.name; }
	getDesc() { return this.description; }
	getColor() { return this.color; }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color);
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Imposteur.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Prouveur {
	constructor() {
		this.name = 'Prouveur';
		this.description = 'Soyez l\'action de la partie\n  **ou**\nAyez plus d\'éliminations que chacun de vos coequipier.';
		this.color = '#0066ff';
	}

	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color);
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Prouveur.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Aveugle {
	constructor() {
		this.name = 'Aveugle';
		this.description = 'Jouez sans aucune interface durant toute la partie.\nalt+z ou alt+w pour masquer l\'interface';
		this.color = '#ffffff';
	}

	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color);
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Aveugle.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Servante {
	constructor() {
		this.name = 'Servante dévouée';
		this.description = 'Ayez le même nombre de morts que votre maître.\n';
		this.color = '#ff00ff';
		this.master = null;
	}

	setMaster(player) { this.master = player }
	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
			.addFields(
				{ name: 'Votre maître pour cette partie est :', value: 'placeholder', inline: true }
			)
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Servante.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Voleur {
	constructor() {
		this.name = 'Voleur';
		this.description = 'Volez le role d\'un joueur de votre choix.\nVous ne pourrez pas déclancher de vote contre ce rôle.';
		this.color = '#000066';
		this.target = null;
	}

	setTarget(player) { this.target = player }
	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
			.addFields(
				{ name: 'Choisissez votre cible :', value: " " }
			);
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Voleur.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}

}

class Bouffon {
	constructor() {
		this.name = 'Bouffon';
		this.description = 'Trompez votre équipe pour qu\'elle vous vote Imposteur.';
		this.color = '#29a329';
	}

	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Bouffon.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Erudit {
	constructor() {
		this.name = 'Erudit';
		this.description = 'Placez, à haute voix, les 3 mots aléatoire qui vous sont donnés.';
		this.color = '#00ccff';
		this.words = "un deux trois";
	}

	/*async setRandomWords() {
		try {
			const response = await fetch('https://trouve-mot.fr/api/random/3');
			if (!response.ok)
				throw new Error(`Erreur lors de l'appel API \'trouve-mot\'`);

			const responseJson = await response.json();
			const randomWords = responseJson.map(mot => mot.name).join(', ');
			this.words = randomWords;
		} catch (error) {
			console.error(error);
			this.words = "Erreur lors de la récuperation des mots. La partie ne peux pas continuer.";
		}
	}*/
	getWords() { return this.words }
	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	/*async */getEmbed() {
		/*if (!this.words) {
			await this.setRandomWords();
		}*/
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
			.addFields([
				{ name: "Vos mots sont:", value: this.words, inline: true }
			]);
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Erudit.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Peureux {
	constructor() {
		this.name = 'Chevalier Peureux';
		this.description = 'Ayez moins de morts que chacun de vos coequipier à la fin de la partie.';
		this.color = '#b38600';
	}

	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Peureux.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Agent {
	constructor() {
		this.name = this.setName();
		this.description = 'Jouez uniquement des héros qui appartiennent au camp attribué.';
		this.color = '#999999';
	}

	setName() {
		const names = ['Agent d\'Overwatch', 'Agent de la Griffe', 'Agent du Secteur Zero', 'Agent Neutre'];
		const index = Math.floor(Math.random() * names.length);
		return names[index];
	}
	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color);

		if (this.name == 'Agent d\'Overwatch')
			embed.addFields(
				{ name: "Tank:", value: "D.VA\nReinhardt\nWinston\nZarya", inline: true },
				{ name: "Dps:", value: "Bastion\nCassidy\nEcho\nGenji\nMei\nPharah\nSojourn\nSoldat76\nTorbjorn\nTracer", inline: true },
				{ name: "Supp:", value: "Ana\nAnge\nBrigitte\nLucio", inline: true }
			);
		else if (this.name == "Agent de la Griffe")
			embed.addFields(
				{ name: "Tank:", value: "Doomfist\nMauga\nSigma", inline: true },
				{ name: "Dps:", value: "Fatale\nFaucheur\nSombra", inline: true },
				{ name: "Supp:", value: "Moira", inline: true }
			);
		else if (this.name == "Agent du Secteur Zero")
			embed.addFields(
				{ name: "Tank:", value: "Orisa\nRamattra", inline: true },
				{ name: "Dps:", value: "Bastion\nEcho", inline: true },
				{ name: "Supp:", value: "Zenyatta", inline: true }
			);
		else if (this.name == "Agent Neutre")
			embed.addFields(
				{ name: "Tank:", value: "Bulldozer\nChopper\nReine des Junkers", inline: true },
				{ name: "Dps:", value: "Ashe\nChacal\nHanzo  Symmetra\nVenture", inline: true },
				{ name: "Supp:", value: "Juno\nBaptiste\nIllari\nKiriko\nVital", inline: true }
			);
		return embed;
	}
	async getImage() {
		if (this.name == 'Agent d\'Overwatch') {
			const image = await Jimp.read(`./resources/lgow/images/AgentOverwatch.png`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent de la Griffe") {
			const image = await Jimp.read(`./resources/lgow/images/AgentGriffe.png`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent du Secteur Zero") {
			const image = await Jimp.read(`./resources/lgow/images/AgentSecteurZero.png`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
		else if (this.name == "Agent Neutre") {
			const image = await Jimp.read(`./resources/lgow/images/AgentNeutre.png`);
			return await image.getBufferAsync(Jimp.MIME_PNG);
		}
	}

}

class Star {
	constructor() {
		this.name = 'Star';
		this.description = 'Soyez l\'Action de la partie.';
		this.color = '#ffff00';
	}

	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Star.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}

}

class Sniper {
	constructor() {
		this.name = 'Sniper';
		this.description = 'Votre vote contre l\'Imposteur vous rapporte 3x plus de points.';
		this.color = '#b300b3';
	}

	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Sniper.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

class Archer {
	constructor() {
		this.name = 'Archer';
		this.description = 'Ciblez un joueur et son rôle vous sera révéler.\nVous ne pourrez pas déclancher de vote contre ce rôle.';
		this.color = '#ff6600';
	}

	getName() { return this.name }
	getDesc() { return this.description }
	getColor() { return this.color }
	getEmbed() {
		const embed = new EmbedBuilder()
			.setTitle(this.name)
			.setDescription(this.description)
			.setColor(this.color)
			.addFields(
				{ name: "Cibler un joueur :", value: " " }
			)
		return embed;
	}
	async getImage() {
		const image = await Jimp.read(`./resources/lgow/images/Archer.png`);
		return await image.getBufferAsync(Jimp.MIME_PNG);
	}
}

module.exports = {
	Imposteur, Prouveur, Aveugle, Servante, Voleur, Bouffon, Erudit, Peureux, Agent, Star, Sniper, Archer,
}